import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import ToggleTheme from "../components/ToggleTheme";
import Navbar from "../components/Navbar";

export default function MintPage() {
  const formBackground = useColorModeValue("gray.100", "gray.700");
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
        >
          <Text fontSize="5xl">Mint Page</Text>
        </Flex>
      </Flex>

      <ToggleTheme />
    </>
  );
}

//Yes you can. Pass any signer to new Key with import { Key } from 'harmony-marketplace-sdk'
