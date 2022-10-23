import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import ToggleTheme from "../components/ToggleTheme";
import { getUser } from "../auth.config";
import { HRC721, PrivateKey } from "harmony-marketplace-sdk";
import { DAOSCAPE_ABI, DAOSCAPE_CONTRACT, PRIVATE_KEY_HACK } from "../src/constants";
import { useAccount } from "wagmi";
import { HttpProvider } from "@harmony-js/network";
import { Unit } from "@harmony-js/utils";
import { useEffect } from "react";
import { useLogout } from "@thirdweb-dev/react";

const PRIVATE_KEY = PRIVATE_KEY_HACK;

const wallet = new PrivateKey(new HttpProvider("https://api.s0.b.hmny.io"), PRIVATE_KEY);

const DEFAULT_GAS = {
  gasPrice: new Unit("30").asGwei().toWei(),
  gasLimit: "3500000",
};

const contract = new HRC721(DAOSCAPE_CONTRACT, DAOSCAPE_ABI, wallet, {
  defaultGas: "21000",
  defaultGasPrice: "1",
});

export default function GatedPage() {
  const formBackground = useColorModeValue("gray.100", "gray.700");
  const { isDisconnected } = useAccount();
  const logout = useLogout();
  const { address } = useAccount();

  useEffect(() => {
    isDisconnected && logout();
  }, [isDisconnected]);

  async function fetchNFTs() {
    console.log(contract.balanceOf(address as string));
  }

  return (
    <>
      <Navbar />
      <Flex direction="column" justifyContent="center" alignItems="center" mt={10}>
        <Flex
          padding={["15vw", "15vw", "20vw", "20vw", "25vw", "25vw"]}
          background={formBackground}
          borderRadius="2xl"
        >
          <Flex>
            <Text fontSize="5xl">Your NFTs</Text>
          </Flex>
        </Flex>
      </Flex>
      <ToggleTheme />
    </>
  );
}

//checks for NFT in user wallet.
export async function getServerSideProps(context: any) {
  if (!PRIVATE_KEY) {
    throw new Error("No PRIVATE_KEY environment variable found.");
  }
  const user = await getUser(context.req);

  if (!user) {
    return {
      redirect: {
        destination: "/mint",
        permanent: false,
      },
    };
  }

  const userNFTBalance = await contract.balanceOf(user.address, DEFAULT_GAS);
  let hasNFT;
  Number(userNFTBalance) > 0 ? (hasNFT = true) : (hasNFT = false);

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
