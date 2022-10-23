import { Flex, Image, Link, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import ToggleTheme from "../components/ToggleTheme";
import { getUser } from "../auth.config";
import { HRC721, PrivateKey } from "harmony-marketplace-sdk";
import { DAOSCAPE_ABI, DAOSCAPE_CONTRACT, PRIVATE_KEY_HACK } from "../src/constants";
import { useAccount } from "wagmi";
import { HttpProvider } from "@harmony-js/network";
import { ChainID, Unit } from "@harmony-js/utils";
import { useEffect, useState } from "react";
import { useLogout } from "@thirdweb-dev/react";

const PRIVATE_KEY = PRIVATE_KEY_HACK;

const wallet = new PrivateKey(
  new HttpProvider("https://api.s0.b.hmny.io"),
  PRIVATE_KEY,
  ChainID.HmyTestnet
);

const DEFAULT_GAS = {
  gasPrice: new Unit("30").asGwei().toWei(),
  gasLimit: "3500000",
};

const MED_GAS = {
  gasPrice: new Unit("300").asGwei().toWei(),
  gasLimit: "3500000",
};

const contract = new HRC721(DAOSCAPE_CONTRACT, DAOSCAPE_ABI, wallet, {
  defaultGas: "21000",
  defaultGasPrice: "1",
});

interface NFT {
  id: number;
  owner: string;
  uri: string;
}

export default function GatedPage() {
  const formBackground = useColorModeValue("gray.100", "gray.700");
  const { isDisconnected } = useAccount();
  const logout = useLogout();
  const { address } = useAccount();
  const [totalSupply, setTotalSupply] = useState(0);
  const [NFTsArray, setNFTsArray] = useState([] as NFT[]);
  const [NFTEls, setNFTEls] = useState();

  useEffect(() => {
    isDisconnected && logout();
  }, [isDisconnected]);

  //fetch NFT contract and user NFT data on mount
  useEffect(() => {
    async function getTotalSupply() {
      setTotalSupply(Number(await contract.totalSupply(DEFAULT_GAS)));
      const userNFTCount = Number(await contract.balanceOf(address!, DEFAULT_GAS));
      console.log("totalSupply", totalSupply);
      console.log("nftBalance", userNFTCount);
    }
    address && getTotalSupply();
  }, []);

  //update NFTsArray after knowing total supply
  useEffect(() => {
    let tempNFTArray = [] as NFT[];
    let nftOwner;
    let nftURI;
    async function getNFTsArray() {
      for (let i = 1; i < totalSupply; i++) {
        nftOwner = await contract.ownerOf(i, DEFAULT_GAS);
        nftURI = await contract.tokenURI(i, DEFAULT_GAS);
        tempNFTArray.push({ id: i, owner: nftOwner, uri: nftURI });
      }
      setNFTsArray(tempNFTArray);
    }
    totalSupply >= 1 && getNFTsArray();
  }, [totalSupply]);

  function renderAllNFTs() {
    return NFTsArray.map((nft) => {
      console.log("nft0", nft);
      return (
        <Flex key={nft.id} direction="column" align="center" justify="center">
          <Image src={nft.uri} />
          <Text>{"id: " + nft.id}</Text>
          <Text>
            {"Owner: "}
            <Link href={"https://explorer.pops.one/address/" + nft.owner} isExternal>
              {nft.owner.substring(0, 20)}
            </Link>
          </Text>
          <Text>
            {"URI: "}
            <Link href={nft.uri} isExternal>
              {nft.uri.substring(0, 20)}{" "}
            </Link>
          </Text>
        </Flex>
      );
    });
  }

  return (
    <>
      <Navbar />
      <Flex direction="column" justifyContent="center" alignItems="center" mt={10}>
        <Flex
          direction="column"
          justify="center"
          align={"center"}
          padding={{ base: 10, md: 10, lg: 10 }}
          background={formBackground}
          borderRadius="2xl"
          gap={10}
        >
          <Text fontSize="2xl" fontWeight="bold">
            Welcome to DAOScape!
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {/* {NFTsArray && renderAllNFTs()} */}
          </SimpleGrid>
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
