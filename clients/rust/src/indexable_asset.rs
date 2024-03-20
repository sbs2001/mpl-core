use base64::prelude::*;
use borsh::BorshDeserialize;
use solana_program::pubkey::Pubkey;
use std::{cmp::Ordering, collections::HashMap, io::ErrorKind};

use crate::{
    accounts::{BaseAssetV1, BaseCollectionV1, PluginHeaderV1},
    types::{Key, Plugin, PluginAuthority, PluginType, UpdateAuthority},
    DataBlob,
};

impl PluginType {
    // Needed to determine if a plugin is a known or unknown type.
    // TODO: Derive this using Kinobi.
    pub fn from_u8(n: u8) -> Option<PluginType> {
        match n {
            0 => Some(PluginType::Royalties),
            1 => Some(PluginType::FreezeDelegate),
            2 => Some(PluginType::BurnDelegate),
            3 => Some(PluginType::TransferDelegate),
            4 => Some(PluginType::UpdateDelegate),
            5 => Some(PluginType::PermanentFreezeDelegate),
            6 => Some(PluginType::Attributes),
            7 => Some(PluginType::PermanentTransferDelegate),
            8 => Some(PluginType::PermanentBurnDelegate),
            _ => None,
        }
    }
}

/// Schema used for indexing known plugin types.
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IndexablePluginSchemaV1 {
    pub index: u64,
    pub offset: u64,
    pub authority: PluginAuthority,
    pub data: Plugin,
}

/// Schema used for indexing unknown plugin types, storing the plugin as raw data.
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IndexableUnknownPluginSchemaV1 {
    pub index: u64,
    pub offset: u64,
    pub authority: PluginAuthority,
    pub r#type: u8,
    pub data: String,
}

// Type used to store a plugin that was processed and is either a known or unknown plugin type.
// Used when building an `IndexableAsset`.
#[derive(Clone, Debug, Eq, PartialEq)]
enum ProcessedPlugin {
    Known((PluginType, IndexablePluginSchemaV1)),
    Unknown(IndexableUnknownPluginSchemaV1),
}

impl ProcessedPlugin {
    fn from_data(
        index: u64,
        offset: u64,
        plugin_type: u8,
        plugin_slice: &mut &[u8],
        authority: PluginAuthority,
    ) -> Result<Self, std::io::Error> {
        let processed_plugin = if let Some(plugin_type) = PluginType::from_u8(plugin_type) {
            let plugin = Plugin::deserialize(plugin_slice)?;
            let indexable_plugin_schema = IndexablePluginSchemaV1 {
                index,
                offset,
                authority,
                data: plugin,
            };
            ProcessedPlugin::Known((plugin_type, indexable_plugin_schema))
        } else {
            let encoded: String = BASE64_STANDARD.encode(plugin_slice);
            ProcessedPlugin::Unknown(IndexableUnknownPluginSchemaV1 {
                index,
                offset,
                authority,
                r#type: plugin_type,
                data: encoded,
            })
        };

        Ok(processed_plugin)
    }
}

// Registry record that can be used when some plugins are not known.
struct RegistryRecordSafe {
    pub plugin_type: u8,
    pub authority: PluginAuthority,
    pub offset: u64,
}

impl RegistryRecordSafe {
    /// Associated function for sorting `RegistryRecordIndexable` by offset.
    pub fn compare_offsets(a: &RegistryRecordSafe, b: &RegistryRecordSafe) -> Ordering {
        a.offset.cmp(&b.offset)
    }
}

// Plugin registry that can safely be deserialized even if some plugins are not known.
struct PluginRegistryV1Safe {
    pub _key: Key,
    pub registry: Vec<RegistryRecordSafe>,
}

impl PluginRegistryV1Safe {
    #[inline(always)]
    pub fn from_bytes(data: &[u8]) -> Result<Self, std::io::Error> {
        let mut data: &[u8] = data;
        let key = Key::deserialize(&mut data)?;
        if key != Key::PluginRegistryV1 {
            return Err(ErrorKind::InvalidInput.into());
        }

        let registry_size = u32::deserialize(&mut data)?;

        let mut registry = vec![];
        for _ in 0..registry_size {
            let plugin_type = u8::deserialize(&mut data)?;
            let authority = PluginAuthority::deserialize(&mut data)?;
            let offset = u64::deserialize(&mut data)?;

            registry.push(RegistryRecordSafe {
                plugin_type,
                authority,
                offset,
            });
        }

        Ok(Self {
            _key: key,
            registry,
        })
    }
}

/// A type used to store both Core Assets and Core Collections for indexing.
#[derive(Clone, Debug, Eq, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct IndexableAsset {
    pub owner: Option<Pubkey>,
    pub update_authority: UpdateAuthority,
    pub name: String,
    pub uri: String,
    pub seq: u64,
    pub plugins: HashMap<PluginType, IndexablePluginSchemaV1>,
    pub unknown_plugins: Vec<IndexableUnknownPluginSchemaV1>,
}

impl IndexableAsset {
    /// Create a new `IndexableAsset` from a `BaseAssetV1``.  Note this uses a passed-in `seq` rather than
    /// the one contained in `asset` to avoid errors.
    pub fn from_asset(asset: BaseAssetV1, seq: u64) -> Self {
        Self {
            owner: Some(asset.owner),
            update_authority: asset.update_authority,
            name: asset.name,
            uri: asset.uri,
            seq,
            plugins: HashMap::new(),
            unknown_plugins: Vec::new(),
        }
    }

    /// Create a new `IndexableAsset` from a `BaseCollectionV1`.
    pub fn from_collection(asset: BaseCollectionV1) -> Self {
        Self {
            owner: None,
            update_authority: UpdateAuthority::Address(asset.update_authority),
            name: asset.name,
            uri: asset.uri,
            seq: 0,
            plugins: HashMap::new(),
            unknown_plugins: Vec::new(),
        }
    }

    // Add a processed plugin to the correct `IndexableAsset` struct member.
    fn add_processed_plugin(&mut self, plugin: ProcessedPlugin) {
        match plugin {
            ProcessedPlugin::Known((plugin_type, indexable_plugin_schema)) => {
                self.plugins.insert(plugin_type, indexable_plugin_schema);
            }
            ProcessedPlugin::Unknown(indexable_unknown_plugin_schema) => {
                self.unknown_plugins.push(indexable_unknown_plugin_schema)
            }
        }
    }

    /// Fetch the base `Asset`` or `Collection`` and all the plugins and store in an `IndexableAsset`.
    pub fn fetch(key: Key, account: &[u8]) -> Result<Self, std::io::Error> {
        let (mut indexable_asset, asset_size) = match key {
            Key::AssetV1 => {
                let asset = BaseAssetV1::from_bytes(account)?;
                let asset_size = asset.get_size();
                let indexable_asset = Self::from_asset(asset, 0);
                (indexable_asset, asset_size)
            }
            Key::CollectionV1 => {
                let asset = BaseCollectionV1::from_bytes(account)?;
                let asset_size = asset.get_size();
                let indexable_asset = Self::from_collection(asset);
                (indexable_asset, asset_size)
            }
            _ => return Err(ErrorKind::InvalidInput.into()),
        };

        if asset_size != account.len() {
            let header = PluginHeaderV1::from_bytes(&account[asset_size..])?;
            let plugin_registry = PluginRegistryV1Safe::from_bytes(
                &account[(header.plugin_registry_offset as usize)..],
            )?;

            let mut registry_records = plugin_registry.registry;
            registry_records.sort_by(RegistryRecordSafe::compare_offsets);

            for (i, records) in registry_records.windows(2).enumerate() {
                let mut plugin_slice =
                    &account[records[0].offset as usize..records[1].offset as usize];
                let processed_plugin = ProcessedPlugin::from_data(
                    i as u64,
                    records[0].offset,
                    records[0].plugin_type,
                    &mut plugin_slice,
                    records[0].authority.clone(),
                )?;

                indexable_asset.add_processed_plugin(processed_plugin);
            }

            if let Some(record) = registry_records.last() {
                let mut plugin_slice =
                    &account[record.offset as usize..header.plugin_registry_offset as usize];

                let processed_plugin = ProcessedPlugin::from_data(
                    registry_records.len() as u64 - 1,
                    record.offset,
                    record.plugin_type,
                    &mut plugin_slice,
                    record.authority.clone(),
                )?;

                indexable_asset.add_processed_plugin(processed_plugin);
            }
        }
        Ok(indexable_asset)
    }
}
