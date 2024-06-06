import { generateSigner } from '@metaplex-foundation/umi';
import test from 'ava';
import {
  addPlugin,
  approvePluginAuthority,
  revokePluginAuthority,
  update,
  updateAuthority,
  updatePlugin,
} from '../../../src';
import { DEFAULT_ASSET, assertAsset, createUmi } from '../../_setupRaw';
import { createAsset } from '../../_setupSdk';

test('it can create an asset with updateDelegate', async (t) => {
  const umi = await createUmi();

  const asset = await createAsset(umi, {
    plugins: [
      {
        type: 'UpdateDelegate',
        additionalDelegates: [],
      },
    ],
  });

  await assertAsset(t, umi, {
    ...DEFAULT_ASSET,
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [],
    },
  });
});

test('it can create an asset with updateDelegate with additional delegates', async (t) => {
  const umi = await createUmi();
  const updateDelegate = generateSigner(umi);

  const asset = await createAsset(umi, {
    plugins: [
      {
        type: 'UpdateDelegate',
        additionalDelegates: [updateDelegate.publicKey],
      },
    ],
  });

  await assertAsset(t, umi, {
    ...DEFAULT_ASSET,
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [updateDelegate.publicKey],
    },
  });
});

test('it can add updateDelegate to asset with additional delegates', async (t) => {
  const umi = await createUmi();
  const asset = await createAsset(umi);
  const updateDelegate = generateSigner(umi);

  await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'UpdateDelegate',
      additionalDelegates: [updateDelegate.publicKey],
    },
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...DEFAULT_ASSET,
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [updateDelegate.publicKey],
    },
  });
});

test('it can update updateDelegate on asset with additional delegates', async (t) => {
  const umi = await createUmi();
  const asset = await createAsset(umi);
  const updateDelegate = generateSigner(umi);

  await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'UpdateDelegate',
      additionalDelegates: [],
    },
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...DEFAULT_ASSET,
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [],
    },
  });

  await updatePlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'UpdateDelegate',
      additionalDelegates: [updateDelegate.publicKey],
    },
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...DEFAULT_ASSET,
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [updateDelegate.publicKey],
    },
  });
});

test('an updateDelegate can update an asset', async (t) => {
  const umi = await createUmi();
  const asset = await createAsset(umi, {
    name: 'short',
    uri: 'https://short.com',
  });
  const updateDelegate = generateSigner(umi);

  await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'UpdateDelegate',
      additionalDelegates: [],
      authority: {
        type: 'Address',
        address: updateDelegate.publicKey,
      },
    },
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'Address',
        address: updateDelegate.publicKey,
      },
      additionalDelegates: [],
    },
    name: 'short',
    uri: 'https://short.com',
  });

  await update(umi, {
    asset,
    name: 'Test Bread 2',
    uri: 'https://example.com/bread2',
    authority: updateDelegate,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...DEFAULT_ASSET,
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'Address',
        address: updateDelegate.publicKey,
      },
      additionalDelegates: [],
    },
    name: 'Test Bread 2',
    uri: 'https://example.com/bread2',
  });
});

test('an updateDelegate additionalDelegate can update an asset', async (t) => {
  const umi = await createUmi();
  const asset = await createAsset(umi, {
    name: 'short',
    uri: 'https://short.com',
  });
  const updateDelegate = generateSigner(umi);

  await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'UpdateDelegate',
      additionalDelegates: [updateDelegate.publicKey],
    },
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [updateDelegate.publicKey],
    },
    name: 'short',
    uri: 'https://short.com',
  });

  await update(umi, {
    asset,
    name: 'Test Bread 2',
    uri: 'https://example.com/bread2',
    authority: updateDelegate,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...DEFAULT_ASSET,
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [updateDelegate.publicKey],
    },
    name: 'Test Bread 2',
    uri: 'https://example.com/bread2',
  });
});

test('an updateDelegate cannot update an asset after delegate authority revoked', async (t) => {
  const umi = await createUmi();
  const asset = await createAsset(umi, {
    name: 'short',
    uri: 'https://short.com',
  });
  const updateDelegate = generateSigner(umi);

  await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'UpdateDelegate',
      additionalDelegates: [],
      authority: {
        type: 'Address',
        address: updateDelegate.publicKey,
      },
    },
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'Address',
        address: updateDelegate.publicKey,
      },
      additionalDelegates: [],
    },
    name: 'short',
    uri: 'https://short.com',
  });

  await revokePluginAuthority(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'UpdateDelegate',
    },
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [],
    },
    name: 'short',
    uri: 'https://short.com',
  });

  const result = update(umi, {
    asset,
    name: 'Test Bread 2',
    uri: 'https://example.com/bread2',
    authority: updateDelegate,
  }).sendAndConfirm(umi);

  await t.throwsAsync(result, { name: 'NoApprovals' });

  await assertAsset(t, umi, {
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [],
    },
    name: 'short',
    uri: 'https://short.com',
  });
});

test('an updateDelegate additionalDelegate cannot update an asset after delegate authority revoked', async (t) => {
  const umi = await createUmi();
  const { identity } = umi;
  const asset = await createAsset(umi, {
    name: 'short',
    uri: 'https://short.com',
  });
  const updateDelegate = generateSigner(umi);

  await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'UpdateDelegate',
      additionalDelegates: [updateDelegate.publicKey],
    },
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [updateDelegate.publicKey],
    },
    name: 'short',
    uri: 'https://short.com',
  });

  await updatePlugin(umi, {
    asset: asset.publicKey,
    authority: identity,
    plugin: {
      type: 'UpdateDelegate',
      additionalDelegates: [],
    },
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [],
    },
    name: 'short',
    uri: 'https://short.com',
  });

  const result = update(umi, {
    asset,
    name: 'Test Bread 2',
    uri: 'https://example.com/bread2',
    authority: updateDelegate,
  }).sendAndConfirm(umi);

  await t.throwsAsync(result, { name: 'NoApprovals' });

  await assertAsset(t, umi, {
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [],
    },
    name: 'short',
    uri: 'https://short.com',
  });
});

test('it cannot add additional delegate as additional delegate', async (t) => {
  const umi = await createUmi();
  const updateDelegate = generateSigner(umi);
  const updateDelegate2 = generateSigner(umi);
  const asset = await createAsset(umi, {
    plugins: [
      {
        type: 'UpdateDelegate',
        additionalDelegates: [updateDelegate.publicKey],
      },
    ],
  });

  const result = updatePlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'UpdateDelegate',
      additionalDelegates: [
        updateDelegate.publicKey,
        updateDelegate2.publicKey,
      ],
    },
    authority: updateDelegate,
  }).sendAndConfirm(umi);

  await t.throwsAsync(result, { name: 'NoApprovals' });
});

test('it can remove additional delegate as additional delegate if self', async (t) => {
  const umi = await createUmi();
  const updateDelegate = generateSigner(umi);
  const updateDelegate2 = generateSigner(umi);
  const asset = await createAsset(umi, {
    plugins: [
      {
        type: 'UpdateDelegate',
        additionalDelegates: [
          updateDelegate.publicKey,
          updateDelegate2.publicKey,
        ],
      },
    ],
  });

  await updatePlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'UpdateDelegate',
      additionalDelegates: [updateDelegate2.publicKey],
    },
    authority: updateDelegate,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [updateDelegate2.publicKey],
    },
  });
});

test('it cannot remove another additional delegate as additional delegate', async (t) => {
  const umi = await createUmi();
  const updateDelegate = generateSigner(umi);
  const updateDelegate2 = generateSigner(umi);
  const asset = await createAsset(umi, {
    plugins: [
      {
        type: 'UpdateDelegate',
        additionalDelegates: [
          updateDelegate.publicKey,
          updateDelegate2.publicKey,
        ],
      },
    ],
  });

  const result = updatePlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'UpdateDelegate',
      additionalDelegates: [updateDelegate.publicKey],
    },
    authority: updateDelegate,
  }).sendAndConfirm(umi);

  await t.throwsAsync(result, { name: 'NoApprovals' });
});

test('it cannot approve the update plugin authority as additional delegate', async (t) => {
  const umi = await createUmi();
  const updateDelegate = generateSigner(umi);
  const updateDelegate2 = generateSigner(umi);
  const asset = await createAsset(umi, {
    plugins: [
      {
        type: 'UpdateDelegate',
        additionalDelegates: [updateDelegate.publicKey],
      },
    ],
  });

  const result = approvePluginAuthority(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'UpdateDelegate',
    },
    newAuthority: {
      type: 'Address',
      address: updateDelegate2.publicKey,
    },
    authority: updateDelegate,
  }).sendAndConfirm(umi);

  await t.throwsAsync(result, { name: 'NoApprovals' });
});

test('it cannot revoke the update plugin authority as additional delegate', async (t) => {
  const umi = await createUmi();
  const updateDelegate = generateSigner(umi);
  const updateDelegate2 = generateSigner(umi);
  const asset = await createAsset(umi, {
    plugins: [
      {
        type: 'UpdateDelegate',
        additionalDelegates: [updateDelegate.publicKey],
        authority: {
          type: 'Address',
          address: updateDelegate2.publicKey,
        },
      },
    ],
  });

  const result = revokePluginAuthority(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'UpdateDelegate',
    },
    authority: updateDelegate,
  }).sendAndConfirm(umi);

  await t.throwsAsync(result, { name: 'NoApprovals' });
});

test('it can approve/revoke the update plugin authority of non-updateDelegate plugins as additional delegate', async (t) => {
  const umi = await createUmi();
  const updateDelegate = generateSigner(umi);
  const updateDelegate2 = generateSigner(umi);
  const asset = await createAsset(umi, {
    plugins: [
      {
        type: 'UpdateDelegate',
        additionalDelegates: [updateDelegate.publicKey],
      },
      {
        type: 'Edition',
        number: 1,
      },
    ],
  });

  await approvePluginAuthority(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'Edition',
    },
    newAuthority: {
      type: 'Address',
      address: updateDelegate2.publicKey,
    },
    authority: updateDelegate,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [updateDelegate.publicKey],
    },
    edition: {
      authority: {
        type: 'Address',
        address: updateDelegate2.publicKey,
      },
      number: 1,
    },
  });

  await revokePluginAuthority(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'Edition',
    },
    authority: updateDelegate,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    updateDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
      additionalDelegates: [updateDelegate.publicKey],
    },
    edition: {
      authority: {
        type: 'UpdateAuthority',
      },
      number: 1,
    },
  });
});

test('it can update a non-updateDelegate plugin as additional delegate', async (t) => {
  const umi = await createUmi();
  const updateDelegate = generateSigner(umi);
  const asset = await createAsset(umi, {
    plugins: [
      {
        type: 'Edition',
        number: 1,
      },
      {
        type: 'UpdateDelegate',
        additionalDelegates: [updateDelegate.publicKey],
      },
    ],
  });

  await updatePlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'Edition',
      number: 2,
    },
    authority: updateDelegate,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    edition: {
      authority: {
        type: 'UpdateAuthority',
      },
      number: 2,
    },
  });
});

test('it cannot add updateDelegate plugin with additional delegate as additional delegate', async (t) => {
  const umi = await createUmi();
  const updateDelegate = generateSigner(umi);
  const asset = await createAsset(umi);

  const result = addPlugin(umi, {
    asset: asset.publicKey,
    plugin: {
      type: 'UpdateDelegate',
      additionalDelegates: [updateDelegate.publicKey],
    },
    authority: updateDelegate,
  }).sendAndConfirm(umi);

  await t.throwsAsync(result, { name: 'NoApprovals' });
});

test('it cannot update the update authority of the asset as an updateDelegate additional delegate', async (t) => {
  const umi = await createUmi();
  const updateDelegate = generateSigner(umi);
  const updateDelegate2 = generateSigner(umi);

  const asset = await createAsset(umi, {
    plugins: [
      {
        type: 'UpdateDelegate',
        additionalDelegates: [updateDelegate.publicKey],
      },
    ],
  });

  const result = update(umi, {
    asset,
    authority: updateDelegate,
    newUpdateAuthority: updateAuthority('Address', [updateDelegate2.publicKey]),
  }).sendAndConfirm(umi);

  await t.throwsAsync(result, { name: 'NoApprovals' });
});
