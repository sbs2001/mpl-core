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
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  mapSerializer,
  option,
  string,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';
import {
  DataState,
  DataStateArgs,
  ExternalPluginInitInfo,
  ExternalPluginInitInfoArgs,
  PluginAuthorityPair,
  PluginAuthorityPairArgs,
  getDataStateSerializer,
  getExternalPluginInitInfoSerializer,
  getPluginAuthorityPairSerializer,
} from '../types';

// Accounts.
export type CreateV2InstructionAccounts = {
  /** The address of the new asset */
  asset: Signer;
  /** The collection to which the asset belongs */
  collection?: PublicKey | Pda;
  /** The authority signing for creation */
  authority?: Signer;
  /** The account paying for the storage fees */
  payer?: Signer;
  /** The owner of the new asset. Defaults to the authority if not present. */
  owner?: PublicKey | Pda;
  /** The authority on the new asset */
  updateAuthority?: PublicKey | Pda;
  /** The system program */
  systemProgram?: PublicKey | Pda;
  /** The SPL Noop Program */
  logWrapper?: PublicKey | Pda;
};

// Data.
export type CreateV2InstructionData = {
  discriminator: number;
  dataState: DataState;
  name: string;
  uri: string;
  plugins: Option<Array<PluginAuthorityPair>>;
  externalPlugins: Option<Array<ExternalPluginInitInfo>>;
};

export type CreateV2InstructionDataArgs = {
  dataState: DataStateArgs;
  name: string;
  uri: string;
  plugins: OptionOrNullable<Array<PluginAuthorityPairArgs>>;
  externalPlugins: OptionOrNullable<Array<ExternalPluginInitInfoArgs>>;
};

export function getCreateV2InstructionDataSerializer(): Serializer<
  CreateV2InstructionDataArgs,
  CreateV2InstructionData
> {
  return mapSerializer<
    CreateV2InstructionDataArgs,
    any,
    CreateV2InstructionData
  >(
    struct<CreateV2InstructionData>(
      [
        ['discriminator', u8()],
        ['dataState', getDataStateSerializer()],
        ['name', string()],
        ['uri', string()],
        ['plugins', option(array(getPluginAuthorityPairSerializer()))],
        [
          'externalPlugins',
          option(array(getExternalPluginInitInfoSerializer())),
        ],
      ],
      { description: 'CreateV2InstructionData' }
    ),
    (value) => ({ ...value, discriminator: 20 })
  ) as Serializer<CreateV2InstructionDataArgs, CreateV2InstructionData>;
}

// Args.
export type CreateV2InstructionArgs = CreateV2InstructionDataArgs;

// Instruction.
export function createV2(
  context: Pick<Context, 'payer' | 'programs'>,
  input: CreateV2InstructionAccounts & CreateV2InstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplCore',
    'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'
  );

  // Accounts.
  const resolvedAccounts = {
    asset: {
      index: 0,
      isWritable: true as boolean,
      value: input.asset ?? null,
    },
    collection: {
      index: 1,
      isWritable: true as boolean,
      value: input.collection ?? null,
    },
    authority: {
      index: 2,
      isWritable: false as boolean,
      value: input.authority ?? null,
    },
    payer: {
      index: 3,
      isWritable: true as boolean,
      value: input.payer ?? null,
    },
    owner: {
      index: 4,
      isWritable: false as boolean,
      value: input.owner ?? null,
    },
    updateAuthority: {
      index: 5,
      isWritable: false as boolean,
      value: input.updateAuthority ?? null,
    },
    systemProgram: {
      index: 6,
      isWritable: false as boolean,
      value: input.systemProgram ?? null,
    },
    logWrapper: {
      index: 7,
      isWritable: false as boolean,
      value: input.logWrapper ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: CreateV2InstructionArgs = { ...input };

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
  const data = getCreateV2InstructionDataSerializer().serialize(
    resolvedArgs as CreateV2InstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
