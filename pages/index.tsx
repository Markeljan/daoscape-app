import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Flex, useColorModeValue, useColorMode } from "@chakra-ui/react";
import HomeGrid from "../components/HomeGrid";
import ToggleTheme from "../components/ToggleTheme";

const Home: NextPage = () => {
  const formBackground = useColorModeValue("gray.100", "gray.700");

  return (
    <>
      <Head>
        <title>DAOScape</title>
        <meta name="description" content="DAOScape Homepage" />
        <link rel="icon" href="/swords.ico" />
      </Head>
      <Flex direction="column" height="100vh" p={12}>
        <Flex mb={"80px"} justifyContent="center" gap={20}>
          <Image width={128} height={128} src="/nft-preview.gif"></Image>
          <Image src="/DAOScape.png" width="391px" height="141px" />
        </Flex>

        <HomeGrid formBackground={formBackground} />
      </Flex>
    </>
  );
};

export default Home;
