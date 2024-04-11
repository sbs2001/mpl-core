/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Option, OptionOrNullable } from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  option,
  struct,
  tuple,
  u64,
} from '@metaplex-foundation/umi/serializers';
import {
  ExternalCheckResult,
  ExternalCheckResultArgs,
  ExternalPluginKey,
  ExternalPluginKeyArgs,
  HookableLifecycleEvent,
  HookableLifecycleEventArgs,
  PluginAuthority,
  PluginAuthorityArgs,
  getExternalCheckResultSerializer,
  getExternalPluginKeySerializer,
  getHookableLifecycleEventSerializer,
  getPluginAuthoritySerializer,
} from '.';

export type ExternalPluginRecord = {
  pluginKey: ExternalPluginKey;
  authority: PluginAuthority;
  lifecycleChecks: Option<Array<[HookableLifecycleEvent, ExternalCheckResult]>>;
  offset: bigint;
};

export type ExternalPluginRecordArgs = {
  pluginKey: ExternalPluginKeyArgs;
  authority: PluginAuthorityArgs;
  lifecycleChecks: OptionOrNullable<
    Array<[HookableLifecycleEventArgs, ExternalCheckResultArgs]>
  >;
  offset: number | bigint;
};

export function getExternalPluginRecordSerializer(): Serializer<
  ExternalPluginRecordArgs,
  ExternalPluginRecord
> {
  return struct<ExternalPluginRecord>(
    [
      ['pluginKey', getExternalPluginKeySerializer()],
      ['authority', getPluginAuthoritySerializer()],
      [
        'lifecycleChecks',
        option(
          array(
            tuple([
              getHookableLifecycleEventSerializer(),
              getExternalCheckResultSerializer(),
            ])
          )
        ),
      ],
      ['offset', u64()],
    ],
    { description: 'ExternalPluginRecord' }
  ) as Serializer<ExternalPluginRecordArgs, ExternalPluginRecord>;
}
