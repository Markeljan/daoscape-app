import {
  Button,
  Flex,
  Image,
  Input,
  Link,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import ToggleTheme from "../components/ToggleTheme";
import { getUser } from "../auth.config";
import { HRC721, PrivateKey } from "harmony-marketplace-sdk";
import { DAOSCAPE_ABI, DAOSCAPE_CONTRACT, PRIVATE_KEY_HACK } from "../src/constants";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { HttpProvider } from "@harmony-js/network";
import { ChainID, Unit } from "@harmony-js/utils";
import { useEffect, useState } from "react";
import { useLogout } from "@thirdweb-dev/react";
import { UseContractConfig } from "wagmi/dist/declarations/src/hooks/contracts/useContract";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";

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
  const buttonBackground = useColorModeValue("blue.200", "blue.600");
  const buttonHoverBackground = useColorModeValue("blue.300", "blue.700");
  const buttonActiveBackground = useColorModeValue("blue.400", "blue.800");
  const { isDisconnected } = useAccount();
  const logout = useLogout();
  const { address } = useAccount();
  const [totalSupply, setTotalSupply] = useState(0);
  const [NFTsArray, setNFTsArray] = useState([] as NFT[]);
  const [NFTEls, setNFTEls] = useState();
  const [userNFTEls, setUserNFTEls] = useState();
  const [showTavern, setShowTavern] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState(0);
  const [filterNFTs, setFilterNFTs] = useState(false);
  const { config } = usePrepareContractWrite({
    address: DAOSCAPE_CONTRACT,
    chainId: 0x6357d2e0,
    abi: DAOSCAPE_ABI,
    functionName: "beginQuest",
    args: [selectedTokenId],
    overrides: {
      gasPrice: 600000000000,
    },
  } as UseContractConfig);
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  useEffect(() => {
    isDisconnected && logout();
  }, [isDisconnected]);

  //fetch NFT contract and user NFT data on mount
  useEffect(() => {
    async function getTotalSupply() {
      setTotalSupply(Number(await contract.totalSupply(DEFAULT_GAS)));
      const userNFTCount = Number(await contract.balanceOf(address!, DEFAULT_GAS));
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

  useEffect(() => {
    if (NFTsArray) {
      setNFTEls(renderAllNFTs() as any);
      setUserNFTEls(renderUserNFTs() as any);
    }
  }, [NFTsArray]);

  function renderAllNFTs() {
    return NFTsArray.map((nft) => {
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

  function renderUserNFTs() {
    return NFTsArray.map((nft) => {
      console.log(nft);
      console.log(address);
      if (nft.owner === address!.toLocaleLowerCase())
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

  function startQuest() {}

  return (
    <>
      <Navbar />
      <Flex direction="column" justifyContent="center" alignItems="center" mt={10}>
        <Flex
          direction="column"
          justify="center"
          align={"center"}
          width="95%"
          padding={{ base: 10, md: 10, lg: 10 }}
          background={formBackground}
          borderRadius="2xl"
          gap={10}
        >
          {/* Game Container */}
          <Flex
            hidden={showTavern || showQuests ? true : false}
            direction={"column"}
            position={"relative"}
          >
            <Image width="100%" src="/gameMap.jpg" />
            <Link href="https://docs.daoscape.one/home/gameplay/combat" isExternal>
              <Button
                position={"absolute"}
                top="28%"
                left="30%"
                background={buttonBackground}
                opacity="0.9"
                _hover={{ background: buttonHoverBackground }}
                _active={{ background: buttonActiveBackground }}
                textColor="white"
                p="2, 4"
                rounded="md"
              >
                Arena 🥊
              </Button>
            </Link>
            <Button
              onClick={() => setShowQuests(!showQuests)}
              position={"absolute"}
              top="25%"
              left="75%"
              background={buttonBackground}
              opacity="0.9"
              _hover={{ background: buttonHoverBackground }}
              _active={{ background: buttonActiveBackground }}
              textColor="white"
              p="2, 4"
              rounded="md"
            >
              Quest 💰
            </Button>

            <Link href="https://docs.daoscape.one/home/gameplay/training" isExternal>
              <Button
                position={"absolute"}
                top="80%"
                left="40%"
                background={buttonBackground}
                opacity="0.9"
                _hover={{ background: buttonHoverBackground }}
                _active={{ background: buttonActiveBackground }}
                textColor="white"
                p="2, 4"
                rounded="md"
              >
                Training 🏋️‍♂️
              </Button>
            </Link>

            <Button
              onClick={() => setShowTavern(!showTavern)}
              position={"absolute"}
              top="55%"
              left="62%"
              background={buttonBackground}
              opacity="0.9"
              _hover={{ background: buttonHoverBackground }}
              _active={{ background: buttonActiveBackground }}
              textColor="white"
              p="2, 4"
              rounded="md"
            >
              Tavern 🍻
            </Button>

            <Link href="https://docs.daoscape.one/home/gameplay/combat" isExternal>
              <Button
                position={"absolute"}
                top="45%"
                left="82%"
                background={buttonBackground}
                opacity="0.9"
                _hover={{ background: buttonHoverBackground }}
                _active={{ background: buttonActiveBackground }}
                textColor="white"
                p="2, 4"
                rounded="md"
              >
                Wilderness ☠
              </Button>
            </Link>
          </Flex>

          <Flex
            hidden={showTavern ? false : true}
            direction={"column"}
            width="100%"
            border="4px dotted gray"
            borderRadius="2xl"
            justify={"center"}
            align="center"
            p={5}
            pl={10}
            pr={10}
            gap={5}
          >
            <Button onClick={() => setShowTavern(!showTavern)} fontSize={"3xl"}>
              Exit Tavern
            </Button>
            <Button
              onClick={() => setFilterNFTs(!filterNFTs)}
              leftIcon={filterNFTs ? <BsToggleOn size={"40px"} /> : <BsToggleOff size={"40px"} />}
              fontSize={"xl"}
            >
              Filter Owned NFTs
            </Button>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={10}
              background={formBackground}
            >
              {filterNFTs ? userNFTEls : NFTEls}
            </SimpleGrid>
          </Flex>

          <Flex
            hidden={showQuests ? false : true}
            direction={"column"}
            width="100%"
            border="4px dotted gray"
            borderRadius="2xl"
            justify={"center"}
            align="center"
            p={5}
            pl={10}
            pr={10}
            gap={4}
          >
            <Button onClick={() => setShowQuests(!showQuests)} fontSize={"3xl"}>
              Exit Quests
            </Button>
            <Text fontSize={"xl"}>
              Send your Scapers on quests to earn experience, loot and/or DAOGold!
            </Text>
            <Text fontSize={"lg"}>(60 min lock period.)</Text>
            <Input
              onChange={(e) => setSelectedTokenId(Number(e.target.value))}
              value={selectedTokenId}
              width={"200px"}
              placeholder="Scaper tokenId"
            ></Input>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={10}
              background={formBackground}
            >
              <Button onClick={() => startQuest()}>Start Quest</Button>
              <Button>End Quest</Button>
            </SimpleGrid>
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
