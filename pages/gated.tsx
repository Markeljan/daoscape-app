import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import ToggleTheme from "../components/ToggleTheme";
import { getUser } from "../auth.config";
import { HRC721, HRC20, HarmonyShards, PrivateKey } from "harmony-marketplace-sdk";
import { ABI } from "../src/constants";

export default function GatedPage() {
  const formBackground = useColorModeValue("gray.100", "gray.700");

  return (
    <>
      <Navbar />
      <Flex direction="column" justifyContent="center" alignItems="center" mt={10}>
        <Flex
          padding={["15vw", "15vw", "20vw", "20vw", "25vw", "25vw"]}
          background={formBackground}
          borderRadius="2xl"
        >
          <Text fontSize="5xl">Gated Content</Text>
        </Flex>
      </Flex>
      <ToggleTheme />
    </>
  );
}

export async function getServerSideProps(context: any) {
  const user = await getUser(context.req);

  if (!user) {
    return {
      redirect: {
        destination: "/mint",
        permanent: false,
      },
    };
  }

  //ensure we are able to generate an auth token using our pk instantiated SDK
  const PRIVATE_KEY = process.env.THIRDWEB_AUTH_PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    throw new Error("No PRIVATE_KEY environment variable found.");
  }
  const wallet = new PrivateKey(HarmonyShards.SHARD_0, PRIVATE_KEY);
  const contract = new HRC20("0x35305d505a884ccfaba7b7d5f533ef29ad57254b", ABI, wallet);

  const totalSuply = await contract.totalSupply();
  const hasNft = true;

  console.log(totalSuply);

  console.log("User", user.address, "doesn't have an NFT! Redirecting...");
  if (!hasNft) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  // Finally, return the props
  return {
    props: {},
  };
}
