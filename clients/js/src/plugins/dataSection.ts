import {
  BaseDataSection,
  BaseDataSectionInitInfoArgs,
  BaseDataSectionUpdateInfoArgs,
  BasePluginAuthority,
  ExternalRegistryRecord,
} from '../generated';
import { ExternalPluginAdapterKey } from './externalPluginAdapterKey';
import { ExternalPluginAdapterManifest } from './externalPluginAdapterManifest';
import { BaseExternalPluginAdapter } from './externalPluginAdapters';
import { parseExternalPluginAdapterData } from './lib';
import {
  LinkedDataKey,
  linkedDataKeyFromBase,
  linkedDataKeyToBase,
} from './linkedDataKey';
import { PluginAuthority, pluginAuthorityFromBase } from './pluginAuthority';

export type DataSection = Omit<
  BaseDataSection,
  'dataAuthority' | 'parentKey'
> & {
  dataAuthority: PluginAuthority;
  parentKey: LinkedDataKey;
  data?: any;
};

export type DataSectionPlugin = BaseExternalPluginAdapter &
  DataSection & {
    type: 'DataSection';
  };

export type DataSectionInitInfoArgs = Omit<
  BaseDataSectionInitInfoArgs,
  'parentKey'
> & {
  type: 'DataSection';
  parentKey: LinkedDataKey;
};

export type DataSectionUpdateInfoArgs = BaseDataSectionUpdateInfoArgs & {
  key: ExternalPluginAdapterKey;
};

export function dataSectionInitInfoArgsToBase(
  d: DataSectionInitInfoArgs
): BaseDataSectionInitInfoArgs {
  return {
    parentKey: linkedDataKeyToBase(d.parentKey),
    schema: d.schema,
  };
}

export function dataSectionUpdateInfoArgsToBase(
  d: DataSectionUpdateInfoArgs
): BaseDataSectionUpdateInfoArgs {
  // TODO fix this
  return {};
}

export function dataSectionFromBase(
  s: BaseDataSection,
  r: ExternalRegistryRecord,
  account: Uint8Array
): DataSection {
  let dataAuthority: BasePluginAuthority;
  if (s.parentKey.__kind === 'LifecycleHook') {
    [, dataAuthority] = s.parentKey.fields;
  } else {
    [dataAuthority] = s.parentKey.fields;
  }

  return {
    ...s,
    parentKey: linkedDataKeyFromBase(s.parentKey),
    dataAuthority: pluginAuthorityFromBase(dataAuthority),
    data: parseExternalPluginAdapterData(s, r, account),
  };
}

export const dataSectionManifest: ExternalPluginAdapterManifest<
  DataSection,
  BaseDataSection,
  DataSectionInitInfoArgs,
  BaseDataSectionInitInfoArgs,
  DataSectionUpdateInfoArgs,
  BaseDataSectionUpdateInfoArgs
> = {
  type: 'DataSection',
  fromBase: dataSectionFromBase,
  initToBase: dataSectionInitInfoArgsToBase,
  updateToBase: dataSectionUpdateInfoArgsToBase,
};
