/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Serializer, struct, u64 } from '@metaplex-foundation/umi/serializers';
import {
  BasePluginAuthority,
  BasePluginAuthorityArgs,
  PluginType,
  PluginTypeArgs,
  getBasePluginAuthoritySerializer,
  getPluginTypeSerializer,
} from '.';

export type RegistryRecord = {
  pluginType: PluginType;
  authority: BasePluginAuthority;
  offset: bigint;
};

export type RegistryRecordArgs = {
  pluginType: PluginTypeArgs;
  authority: BasePluginAuthorityArgs;
  offset: number | bigint;
};

export function getRegistryRecordSerializer(): Serializer<
  RegistryRecordArgs,
  RegistryRecord
> {
  return struct<RegistryRecord>(
    [
      ['pluginType', getPluginTypeSerializer()],
      ['authority', getBasePluginAuthoritySerializer()],
      ['offset', u64()],
    ],
    { description: 'RegistryRecord' }
  ) as Serializer<RegistryRecordArgs, RegistryRecord>;
}
