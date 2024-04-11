//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::DataStoreUpdateInfo;
use crate::generated::types::LifecycleHookUpdateInfo;
use crate::generated::types::OracleUpdateInfo;
use borsh::BorshDeserialize;
use borsh::BorshSerialize;

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum ExternalPluginUpdateInfo {
    LifecycleHook(LifecycleHookUpdateInfo),
    Oracle(OracleUpdateInfo),
    DataStore(DataStoreUpdateInfo),
}
