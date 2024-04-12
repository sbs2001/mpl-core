/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Context,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  mapSerializer,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';
import {
  ExternalPluginInitInfo,
  ExternalPluginInitInfoArgs,
  getExternalPluginInitInfoSerializer,
} from '../types';

// Accounts.
export type AddCollectionExternalPluginV1InstructionAccounts = {
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
export type AddCollectionExternalPluginV1InstructionData = {
  discriminator: number;
  initInfo: ExternalPluginInitInfo;
};

export type AddCollectionExternalPluginV1InstructionDataArgs = {
  initInfo: ExternalPluginInitInfoArgs;
};

export function getAddCollectionExternalPluginV1InstructionDataSerializer(): Serializer<
  AddCollectionExternalPluginV1InstructionDataArgs,
  AddCollectionExternalPluginV1InstructionData
> {
  return mapSerializer<
    AddCollectionExternalPluginV1InstructionDataArgs,
    any,
    AddCollectionExternalPluginV1InstructionData
  >(
    struct<AddCollectionExternalPluginV1InstructionData>(
      [
        ['discriminator', u8()],
        ['initInfo', getExternalPluginInitInfoSerializer()],
      ],
      { description: 'AddCollectionExternalPluginV1InstructionData' }
    ),
    (value) => ({ ...value, discriminator: 23 })
  ) as Serializer<
    AddCollectionExternalPluginV1InstructionDataArgs,
    AddCollectionExternalPluginV1InstructionData
  >;
}

// Args.
export type AddCollectionExternalPluginV1InstructionArgs =
  AddCollectionExternalPluginV1InstructionDataArgs;

// Instruction.
export function addCollectionExternalPluginV1(
  context: Pick<Context, 'payer' | 'programs'>,
  input: AddCollectionExternalPluginV1InstructionAccounts &
    AddCollectionExternalPluginV1InstructionArgs
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
  const resolvedArgs: AddCollectionExternalPluginV1InstructionArgs = {
    ...input,
  };

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
  const data =
    getAddCollectionExternalPluginV1InstructionDataSerializer().serialize(
      resolvedArgs as AddCollectionExternalPluginV1InstructionDataArgs
    );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
