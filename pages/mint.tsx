import { Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import ToggleTheme from "../components/ToggleTheme";
import Navbar from "../components/Navbar";
import { HRC721, PrivateKey } from "harmony-marketplace-sdk";
import { HttpProvider } from "@harmony-js/network";
import { DAOSCAPE_ABI } from "../src/constants";
import { ChainID, Unit } from "@harmony-js/utils";
import { useAddress } from "@thirdweb-dev/react";
import { Key } from "harmony-marketplace-sdk";

export default function MintPage() {
  const formBackground = useColorModeValue("gray.100", "gray.700");
  const address = useAddress() as string;

  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  // const PRIVATE_KEY = "45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e";
  const wallet = new PrivateKey(new HttpProvider("https://api.s0.b.hmny.io"), PRIVATE_KEY!);

  const contract = new HRC721("0x4F8224c93226Bd5A62DD640b511f1cE0b537f69d", DAOSCAPE_ABI, wallet, {
    defaultGas: "21000",
    defaultGasPrice: "1",
  });

  const DEFAULT_GAS = {
    gasPrice: new Unit("30").asGwei().toWei(),
    gasLimit: "3500000",
  };
  async function mintNFT() {
    let userNFTBalance = await contract.balanceOf(address, DEFAULT_GAS);
    console.log(userNFTBalance.toString());
    const txReceipt = await contract.safeMint(address, "2", DEFAULT_GAS);
    console.log(txReceipt);
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
          <Button onClick={() => mintNFT()}>Mint Scaper</Button>
        </Flex>
      </Flex>

      <ToggleTheme />
    </>
  );
}
