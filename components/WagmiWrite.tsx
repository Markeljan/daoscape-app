import { usePrepareContractWrite } from "wagmi";

export default function WagmiWrite({ contract }: { contract: Contract }) {
  const { config: beginQuestConfig } = usePrepareContractWrite({
    address: address,
    chainId: chain?.id,
    abi: DAOSCAPE_ABI,
    functionName: "beginQuest",
    args: [selectedNFT?.id],
    overrides: {
      gasPrice: 600000000000,
    },
  } as UseContractConfig);
}
