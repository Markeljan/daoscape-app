import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import ToggleTheme from "../components/ToggleTheme";
import { getUser } from "../auth.config";
import { HRC721, PrivateKey } from "harmony-marketplace-sdk";
import { DAOSCAPE_ABI, ERC721ABI } from "../src/constants";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useAccount } from "wagmi";
import { HttpProvider } from "@harmony-js/network";
import { Unit } from "@harmony-js/utils";
import { useEffect } from "react";
import { useLogout } from "@thirdweb-dev/react";

export default function GatedPage() {
  const formBackground = useColorModeValue("gray.100", "gray.700");
  const { isDisconnected } = useAccount();
  const logout = useLogout();

  useEffect(() => {
    isDisconnected && logout();
  }, [isDisconnected]);

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
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  // const PRIVATE_KEY = "45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e";
  if (!PRIVATE_KEY) {
    throw new Error("No PRIVATE_KEY environment variable found.");
  }

  const wallet = new PrivateKey(new HttpProvider("https://api.s0.b.hmny.io"), PRIVATE_KEY);

  const contract = new HRC721("0x4F8224c93226Bd5A62DD640b511f1cE0b537f69d", DAOSCAPE_ABI, wallet, {
    defaultGas: "21000",
    defaultGasPrice: "1",
  });

  const DEFAULT_GAS = {
    gasPrice: new Unit("30").asGwei().toWei(),
    gasLimit: "3500000",
  };

  const userNFTBalance = await contract.balanceOf(user.address, DEFAULT_GAS);
  let hasNFT;
  Number(userNFTBalance) > 0 ? (hasNFT = true) : (hasNFT = false);
  console.log(userNFTBalance.toString(), hasNFT);

  if (!hasNFT) {
    return {
      redirect: {
        destination: "/mint",
        permanent: false,
      },
    };
  }

  // Finally, return the props
  return {
    props: {},
  };
}
