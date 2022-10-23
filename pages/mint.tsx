import { Button, Flex, Link, Text, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import ToggleTheme from "../components/ToggleTheme";
import Navbar from "../components/Navbar";
import { HRC721, PrivateKey } from "harmony-marketplace-sdk";
import { HttpProvider } from "@harmony-js/network";
import { DAOSCAPE_ABI } from "../src/constants";
import { ChainID, Unit } from "@harmony-js/utils";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useAccount, useContractWrite, useFeeData, usePrepareContractWrite } from "wagmi";
import NextLink from "next/link";
import { UseContractConfig } from "wagmi/dist/declarations/src/hooks/contracts/useContract";
import { useEffect } from "react";
import { isExternal } from "util/types";

export default function MintPage() {
  const addRecentTransaction = useAddRecentTransaction();
  const formBackground = useColorModeValue("gray.100", "gray.700");
  const buttonBackground = useColorModeValue("gray.200", "gray.600");
  const txBackground = "white";
  const { address } = useAccount();
  const { config } = usePrepareContractWrite({
    address: "0x59552fB54b327D0f2785EC498eF0e02A2A294Efe",
    chainId: 0x6357d2e0,
    abi: DAOSCAPE_ABI,
    functionName: "safeMint",
    args: [address, "599"],
  } as UseContractConfig);
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  useEffect(() => {
    if (isSuccess) {
      data &&
        addRecentTransaction({
          hash: data.hash,
          description: "Mint Scaper",
        });
    }
  }, [data]);

  // const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const PRIVATE_KEY = "3c90a1577ed63b0beb17f27490a66c0713953269ebb0f625fb546a61676dc5d8";
  // const PRIVATE_KEY = "45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e";
  const wallet = new PrivateKey(
    new HttpProvider("https://api.s0.b.hmny.io"),
    PRIVATE_KEY,
    ChainID.HmyTestnet
  );

  const contract = new HRC721("0x59552fB54b327D0f2785EC498eF0e02A2A294Efe", DAOSCAPE_ABI, wallet, {
    defaultGas: "21000",
    defaultGasPrice: "1",
  });

  const DEFAULT_GAS = {
    gasPrice: new Unit("30").asGwei().toWei(),
    gasLimit: "3500000",
  };

  const MED_GAS = {
    gasPrice: new Unit("300").asGwei().toWei(),
    gasLimit: "3500000",
  };

  async function mintNFT() {
    //*** harmonysdk mint  ***//
    // let userNFTBalance = await contract.balanceOf(address as string, DEFAULT_GAS);
    // console.log(userNFTBalance.toString());
    // const txReceipt = await contract.safeMint(address as string, "598", MED_GAS);
    // addRecentTransaction({
    //   hash: txReceipt.receipt!.transactionHash,
    //   description: "Mint",
    // });
    // console.log(txReceipt);
  }

  return (
    <>
      <Head>
        <title>Mint DAOScaper</title>
        <meta name="description" content="DAOScape Mint Page" />
        <link rel="icon" href="/2.png" />
      </Head>

      <Navbar />

      <Flex direction="column" justifyContent="center" alignItems="center" mt={10}>
        <Flex
          padding={["15vw", "15vw", "20vw", "20vw", "25vw", "25vw"]}
          background={formBackground}
          borderRadius="2xl"
          direction={"column"}
          gap={10}
        >
          <Text fontSize="5xl">Mint Page</Text>
          <Button disabled={!write} onClick={() => write?.()} backgroundColor={buttonBackground}>
            Mint Scaper
          </Button>
          {isLoading && (
            <Flex
              justify="center"
              align="center"
              p={2}
              borderRadius={"xl"}
              backgroundColor={txBackground}
              textColor={"black"}
            >
              Confirm in Wallet
            </Flex>
          )}
          {isSuccess && (
            <Flex
              justify="center"
              align="center"
              p={2}
              borderRadius={"xl"}
              backgroundColor={txBackground}
              textColor={"black"}
            >
              <Link href={"https://explorer.pops.one/tx/" + data?.hash} isExternal>
                Transaction: {data?.hash.substring(0, 5) + "..." + data?.hash.substring(62)}
              </Link>
            </Flex>
          )}
        </Flex>
      </Flex>

      <ToggleTheme />
    </>
  );
}
