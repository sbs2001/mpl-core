//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::ExternalCheckResult;
use crate::generated::types::ExtraAccount;
use crate::generated::types::HookableLifecycleEvent;
use crate::generated::types::PluginAuthority;
use crate::generated::types::ValidationResultsOffset;
#[cfg(feature = "anchor")]
use anchor_lang::prelude::{AnchorDeserialize, AnchorSerialize};
#[cfg(not(feature = "anchor"))]
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;

#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[cfg_attr(not(feature = "anchor"), derive(BorshSerialize, BorshDeserialize))]
#[cfg_attr(feature = "anchor", derive(AnchorSerialize, AnchorDeserialize))]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OracleInitInfo {
    #[cfg_attr(
        feature = "serde",
        serde(with = "serde_with::As::<serde_with::DisplayFromStr>")
    )]
    pub base_address: Pubkey,
    pub init_plugin_authority: Option<PluginAuthority>,
    pub lifecycle_checks: Vec<(HookableLifecycleEvent, ExternalCheckResult)>,
    pub base_address_config: Option<ExtraAccount>,
    pub results_offset: Option<ValidationResultsOffset>,
}
