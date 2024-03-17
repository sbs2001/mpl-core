/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Option, OptionOrNullable, PublicKey } from '@metaplex-foundation/umi';
import {
  Serializer,
  option,
  publicKey as publicKeySerializer,
  string,
  struct,
  u64,
} from '@metaplex-foundation/umi/serializers';
import {
  Key,
  KeyArgs,
  UpdateAuthority,
  UpdateAuthorityArgs,
  getKeySerializer,
  getUpdateAuthoritySerializer,
} from '.';

export type AssetAccountData = {
  key: Key;
  owner: PublicKey;
  updateAuthority: UpdateAuthority;
  name: string;
  uri: string;
  seq: Option<bigint>;
};

export type AssetAccountDataArgs = {
  key: KeyArgs;
  owner: PublicKey;
  updateAuthority: UpdateAuthorityArgs;
  name: string;
  uri: string;
  seq: OptionOrNullable<number | bigint>;
};

export function getAssetAccountDataSerializer(): Serializer<
  AssetAccountDataArgs,
  AssetAccountData
> {
  return struct<AssetAccountData>(
    [
      ['key', getKeySerializer()],
      ['owner', publicKeySerializer()],
      ['updateAuthority', getUpdateAuthoritySerializer()],
      ['name', string()],
      ['uri', string()],
      ['seq', option(u64())],
    ],
    { description: 'AssetAccountData' }
  ) as Serializer<AssetAccountDataArgs, AssetAccountData>;
}
