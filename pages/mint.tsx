import { Flex } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";
import ToggleTheme from "../components/ToggleTheme";

export default function MintPage() {
  const formBackground = useColorModeValue("gray.100", "gray.700");
  return (
    <>
      <Head>
        <title>Mint DAOScaper</title>
        <meta name="description" content="DAOScape Mint Page" />
        <link rel="icon" href="/2.png" />
      </Head>
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Flex padding={[50, 100, 150, 200, 250, 300]} background={formBackground}>
          <h1>Mint Page</h1>
        </Flex>
      </Flex>
    </>
  );
}
