import { Unit } from "@harmony-js/utils";

export const AddressZero = '0x0000000000000000000000000000000000000000'
export const DEFAULT_GAS_PRICE = '1000000000'
export const DEFAULT_GAS_LIMIT = '3500000'
export const HARMONY_RPC_SHARD_0_URL = 'https://api.harmony.one'
export const HARMONY_RPC_SHARD_1_URL = 'https://s1.api.harmony.one'
export const HARMONY_RPC_SHARD_2_URL = 'https://s2.api.harmony.one'
export const HARMONY_RPC_SHARD_3_URL = 'https://s3.api.harmony.one'
export const HARMONY_RPC_SHARD_0_TESTNET_URL = 'https://api.s0.b.hmny.io'
export const HARMONY_RPC_SHARD_1_TESTNET_URL = 'https://api.s1.b.hmny.io'
export const HARMONY_RPC_SHARD_2_TESTNET_URL = 'https://api.s2.b.hmny.io'
export const HARMONY_RPC_SHARD_3_TESTNET_URL = 'https://api.s3.b.hmny.io'
export const HARMONY_RPC_SHARD_0_DEVNET_URL = 'https://api.s0.ps.hmny.io'
export const HARMONY_RPC_WS = 'wss://ws.s0.t.hmny.io'
export const HARMONY_RPC_DEVNET_WS = 'wss://ws.s0.ps.hmny.io'

export enum NetworkInfo {
  MAINNET,
  DEVNET,
}

export enum TokenType {
  HRC20,
  HRC721,
  HRC1155,
}

export enum BridgeType {
  HMY_TO_ETH,
  ETH_TO_HMY,
}

// Harmony owner of the manager contracts
export const MAINNET_MULTISIG_WALLET = '0x715CdDa5e9Ad30A0cEd14940F9997EE611496De6'

export const MAINNET_HRC20_CONTRACTS_ADDRESSES = {
  ethManagerAddress: '0x2912885736Ce25E437c0113200254140a709a58d',
  hmyManagerAddress: '0xe0c1267f1c63e83472d2b3e25d970740940d752b',
  tokenManagerAddress: '0x92591545c6462ad0751c890D15DF5F47846fF4Bf',
}

export const MAINNET_HRC721_CONTRACTS_ADDRESSES = {
  ethManagerAddress: '0x426A61A2127fDD1318Ec0EdCe02474f382FdAd30',
  hmyManagerAddress: '0xbaf4d51738a42b976c3558b5f983cf4721451499',
  tokenManagerAddress: '0xF837fe0Eba85bE14446E546115ef20891E357D2B',
}

export const MAINNET_HRC1155_CONTRACTS_ADDRESSES = {
  ethManagerAddress: '0x478279c5A0beb8401De1b4EaCB4863a243a8e3A3',
  hmyManagerAddress: '0x4f9b3defb4f61227a7574f2a7adfe2841e1ae20e',
  tokenManagerAddress: '0x94da065b27f4a61d6595c2ebb541bb7bd11b6266',
}

export const DEFAULT_TX_OPTIONS = {
  gasPrice: new Unit('30').asGwei().toWei(),
  gasLimit: 3500000,
}

export const ABI: any = [
  {
    constant: true,
    inputs: [],
    name: 'test',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]