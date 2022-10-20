import { Chain } from "wagmi";

export const harmonyTestnet: Chain = {
  id: 1666700000,
  name: "Harmony Testnet",
  network: "harmony-testnet",
  nativeCurrency: { name: "ONE", symbol: "ONE", decimals: 18 },
  rpcUrls: {
    default: "https://api.s0.b.hmny.io",
  },
  blockExplorers: {
    default: {
      name: "explorer.pops",
      url: "https://explorer.pops.one/",
    },
  },
  testnet: true,
};

export const defaultChains: Chain[] = [harmonyTestnet];
