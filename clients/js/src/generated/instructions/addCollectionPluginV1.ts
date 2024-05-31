/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Context,
  Option,
  OptionOrNullable,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  none,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  mapSerializer,
  option,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';
import {
  BasePluginAuthority,
  BasePluginAuthorityArgs,
  Plugin,
  PluginArgs,
  getBasePluginAuthoritySerializer,
  getPluginSerializer,
} from '../types';

// Accounts.
export type AddCollectionPluginV1InstructionAccounts = {
  /** The address of the asset */
  collection: PublicKey | Pda;
  /** The account paying for the storage fees */
  payer?: Signer;
  /** The owner or delegate of the asset */
  authority?: Signer;
  /** The system program */
  systemProgram?: PublicKey | Pda;
  /** The SPL Noop Program */
  logWrapper?: PublicKey | Pda;
};

// Data.
export type AddCollectionPluginV1InstructionData = {
  discriminator: number;
  plugin: Plugin;
  initAuthority: Option<BasePluginAuthority>;
};

export type AddCollectionPluginV1InstructionDataArgs = {
  plugin: PluginArgs;
  initAuthority?: OptionOrNullable<BasePluginAuthorityArgs>;
};

export function getAddCollectionPluginV1InstructionDataSerializer(): Serializer<
  AddCollectionPluginV1InstructionDataArgs,
  AddCollectionPluginV1InstructionData
> {
  return mapSerializer<
    AddCollectionPluginV1InstructionDataArgs,
    any,
    AddCollectionPluginV1InstructionData
  >(
    struct<AddCollectionPluginV1InstructionData>(
      [
        ['discriminator', u8()],
        ['plugin', getPluginSerializer()],
        ['initAuthority', option(getBasePluginAuthoritySerializer())],
      ],
      { description: 'AddCollectionPluginV1InstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: 3,
      initAuthority: value.initAuthority ?? none(),
    })
  ) as Serializer<
    AddCollectionPluginV1InstructionDataArgs,
    AddCollectionPluginV1InstructionData
  >;
}

// Args.
export type AddCollectionPluginV1InstructionArgs =
  AddCollectionPluginV1InstructionDataArgs;

// Instruction.
export function addCollectionPluginV1(
  context: Pick<Context, 'payer' | 'programs'>,
  input: AddCollectionPluginV1InstructionAccounts &
    AddCollectionPluginV1InstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplCore',
    'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'
  );

  // Accounts.
  const resolvedAccounts = {
    collection: {
      index: 0,
      isWritable: true as boolean,
      value: input.collection ?? null,
    },
    payer: {
      index: 1,
      isWritable: true as boolean,
      value: input.payer ?? null,
    },
    authority: {
      index: 2,
      isWritable: false as boolean,
      value: input.authority ?? null,
    },
    systemProgram: {
      index: 3,
      isWritable: false as boolean,
      value: input.systemProgram ?? null,
    },
    logWrapper: {
      index: 4,
      isWritable: false as boolean,
      value: input.logWrapper ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: AddCollectionPluginV1InstructionArgs = { ...input };

  // Default values.
  if (!resolvedAccounts.payer.value) {
    resolvedAccounts.payer.value = context.payer;
  }
  if (!resolvedAccounts.systemProgram.value) {
    resolvedAccounts.systemProgram.value = context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    );
    resolvedAccounts.systemProgram.isWritable = false;
  }

  // Accounts in order.
  const orderedAccounts: ResolvedAccount[] = Object.values(
    resolvedAccounts
  ).sort((a, b) => a.index - b.index);

  // Keys and Signers.
  const [keys, signers] = getAccountMetasAndSigners(
    orderedAccounts,
    'programId',
    programId
  );

  // Data.
  const data = getAddCollectionPluginV1InstructionDataSerializer().serialize(
    resolvedArgs as AddCollectionPluginV1InstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
