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
use borsh::BorshDeserialize;
use borsh::BorshSerialize;

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct OracleInitInfo {
    pub init_authority: Option<PluginAuthority>,
    pub lifecycle_checks: Option<Vec<(HookableLifecycleEvent, ExternalCheckResult)>>,
    pub pda: Option<ExtraAccount>,
}
