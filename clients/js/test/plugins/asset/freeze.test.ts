import test from 'ava';
import { generateSigner } from '@metaplex-foundation/umi';
import {
  PluginType,
  addPlugin,
  approvePluginAuthority,
  pubkeyPluginAuthority,
  pluginAuthorityPair,
  revokePluginAuthority,
  updatePlugin,
  createPlugin,
  ownerPluginAuthority,
} from '../../../src';
import {
  DEFAULT_ASSET,
  assertAsset,
  createAsset,
  createUmi,
} from '../../_setup';

test('it can freeze and unfreeze an asset', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();

  const asset = await createAsset(umi);

  await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: createPlugin({ type: 'Freeze', data: { frozen: true } }),
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...DEFAULT_ASSET,
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    freeze: {
      authority: {
        type: 'Owner',
      },
      frozen: true,
    },
  });

  await updatePlugin(umi, {
    asset: asset.publicKey,
    plugin: createPlugin({ type: 'Freeze', data: { frozen: false } }),
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...DEFAULT_ASSET,
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    freeze: {
      authority: {
        type: 'Owner',
      },
      frozen: false,
    },
  });
});

test('it can delegate then freeze an asset', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const delegateAddress = generateSigner(umi);

  const asset = await createAsset(umi, {
    plugins: [pluginAuthorityPair({ type: 'Freeze', data: { frozen: false } })],
  });

  await approvePluginAuthority(umi, {
    asset: asset.publicKey,
    pluginType: PluginType.Freeze,
    newAuthority: pubkeyPluginAuthority(delegateAddress.publicKey),
  }).sendAndConfirm(umi);

  await updatePlugin(umi, {
    asset: asset.publicKey,
    plugin: createPlugin({ type: 'Freeze', data: { frozen: true } }),
    authority: delegateAddress,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...DEFAULT_ASSET,
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    freeze: {
      authority: {
        type: 'Pubkey',
        address: delegateAddress.publicKey,
      },
      frozen: true,
    },
  });
});

test('owner cannot undelegate a freeze plugin with a delegate', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const delegateAddress = generateSigner(umi);

  const asset = await createAsset(umi, {
    plugins: [
      pluginAuthorityPair({
        type: 'Freeze',
        data: { frozen: true },
        authority: pubkeyPluginAuthority(delegateAddress.publicKey),
      }),
    ],
  });

  const result = revokePluginAuthority(umi, {
    asset: asset.publicKey,
    pluginType: PluginType.Freeze,
  }).sendAndConfirm(umi);

  await t.throwsAsync(result, { name: 'InvalidAuthority' });
});

test('owner cannot approve to reassign authority back to owner if frozen', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const delegateAddress = generateSigner(umi);

  const asset = await createAsset(umi, {
    plugins: [
      pluginAuthorityPair({
        type: 'Freeze',
        data: { frozen: true },
        authority: pubkeyPluginAuthority(delegateAddress.publicKey),
      }),
    ],
  });

  await assertAsset(t, umi, {
    ...DEFAULT_ASSET,
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    freeze: {
      authority: {
        type: 'Pubkey',
        address: delegateAddress.publicKey,
      },
      frozen: true,
    },
  });

  const result = approvePluginAuthority(umi, {
    asset: asset.publicKey,
    pluginType: PluginType.Freeze,
    newAuthority: ownerPluginAuthority(),
  }).sendAndConfirm(umi);

  await t.throwsAsync(result, { name: 'InvalidAuthority' });

  await assertAsset(t, umi, {
    ...DEFAULT_ASSET,
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    freeze: {
      authority: {
        type: 'Pubkey',
        address: delegateAddress.publicKey,
      },
      frozen: true,
    },
  });
});

test('it cannot add multiple freeze plugins to an asset', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();

  const asset = await createAsset(umi, {
    plugins: [pluginAuthorityPair({ type: 'Freeze', data: { frozen: false } })],
  });

  const result = addPlugin(umi, {
    asset: asset.publicKey,
    plugin: createPlugin({ type: 'Freeze', data: { frozen: true } }),
  }).sendAndConfirm(umi);

  await t.throwsAsync(result, { name: 'PluginAlreadyExists' });
});
