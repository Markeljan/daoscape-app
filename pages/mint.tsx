import { Button, Flex, Link, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import ToggleTheme from "../components/ToggleTheme";
import Navbar from "../components/Navbar";
import { DAOSCAPE_ABI, DAOSCAPE_CONTRACT } from "../src/constants";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { UseContractConfig } from "wagmi/dist/declarations/src/hooks/contracts/useContract";
import { useEffect } from "react";
import Image from "next/image";
import { ethers } from "ethers";

export default function MintPage() {
  const addRecentTransaction = useAddRecentTransaction();
  const formBackground = useColorModeValue("gray.100", "gray.700");
  const buttonBackground = useColorModeValue("gray.200", "gray.600");
  const txBackground = "white";
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { config } = usePrepareContractWrite({
    address: DAOSCAPE_CONTRACT,
    chainId: chain?.id,
    abi: DAOSCAPE_ABI,
    functionName: "safeMint",
    args: [address, "599"],
    overrides: {
      from: address,
      value: ethers.utils.parseEther("1"),
      gasPrice: 600000000000,
    },
  } as UseContractConfig);
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  useEffect(() => {
    if (isSuccess) {
      data &&
        addRecentTransaction({
          hash: data.hash,
          description: "Mint DAOScaper",
        });
    }
  }, [data]);

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
          p={["10vw"]}
          pt={["5vw"]}
          pb={["5vw"]}
          background={formBackground}
          borderRadius="2xl"
          direction={"column"}
          gap={10}
        >
          <Flex direction="column" justifyContent="center" alignItems="center" gap={10}>
            <Text fontSize="5xl">Mint DAOScaper</Text>
            <Image src="/nft-preview.gif" alt="DAOScapers" width="300px" height="300px" />
          </Flex>
          <Button disabled={!write} onClick={() => write?.()} backgroundColor={buttonBackground}>
            Mint 1 ONE
          </Button>
          {isLoading && (
            <Flex
              justify="center"
              align="center"
              p={2}
              borderRadius={"xl"}
              backgroundColor={txBackground}
              textColor={"black"}
              gap={4}
            >
              Confirm in Wallet
              <Spinner color="orange.500" speed="1s" thickness="2.5px" />
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
