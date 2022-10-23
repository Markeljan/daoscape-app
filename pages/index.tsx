import type { NextPage } from "next";
import Head from "next/head";
import { Flex, useColorModeValue, Image } from "@chakra-ui/react";
import HomeGrid from "../components/HomeGrid";
import ToggleTheme from "../components/ToggleTheme";
import Navbar from "../components/Navbar";

const Home: NextPage = () => {
  const formBackground = useColorModeValue("gray.100", "gray.700");

  return (
    <>
      <Head>
        <title>DAOScape</title>
        <meta name="description" content="DAOScape Homepage" />
        <link rel="icon" href="/swords.ico" />
      </Head>

      <Navbar />

      <Flex direction="column" m={10}>
        <Flex justifyContent="center" gap={20}></Flex>
      </Flex>

      <Flex direction={"column"} alignItems="center">
        <HomeGrid formBackground={formBackground} />
      </Flex>

      <ToggleTheme />

      {/* <button
        onClick={() => {
          addRecentTransaction({
            hash: "0x0d9e03b0ff69ffea90c0b0094c5fe58aa52480c5e84b86812a38b997879b24da",
            description: "Call",
          });
        }}
      >
        Add recent transaction2
      </button> */}
    </>
  );
};

export default Home;
