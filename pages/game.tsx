import { Button, Flex, Image, Link, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
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
import {
  BsArrowLeft,
  BsArrowRight,
  BsFillVolumeMuteFill,
  BsFillVolumeUpFill,
  BsToggleOff,
  BsToggleOn,
  BsVolumeMute,
  BsVolumeMuteFill,
  BsVolumeOff,
  BsVolumeUp,
} from "react-icons/bs";
import Sound from "react-sound";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

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
  const formBackground = useColorModeValue("gray.150", "gray.700");
  const buttonBackground = useColorModeValue("blue.200", "blue.600");
  const buttonHoverBackground = useColorModeValue("blue.300", "blue.700");
  const buttonActiveBackground = useColorModeValue("blue.400", "blue.800");
  const { isDisconnected } = useAccount();
  const logout = useLogout();
  const { address } = useAccount();
  const [totalSupply, setTotalSupply] = useState(0);
  const [NFTsArray, setNFTsArray] = useState([] as NFT[]);
  const [userNFTsArray, setUserNFTsArray] = useState([] as NFT[]);
  const [selectedNFT, setSelectedNFT] = useState<NFT>();
  const [selectedNFTEl, setSelectedNFTEl] = useState();
  const [NFTEls, setNFTEls] = useState();
  const [userNFTEls, setUserNFTEls] = useState();
  const [showTavern, setShowTavern] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [filterNFTs, setFilterNFTs] = useState(false);
  const [muted, setMuted] = useState(false);

  const addRecentTransaction = useAddRecentTransaction();

  const { config } = usePrepareContractWrite({
    address: DAOSCAPE_CONTRACT,
    chainId: 0x6357d2e0,
    abi: DAOSCAPE_ABI,
    functionName: "beginQuest",
    args: [selectedNFT?.id],
    overrides: {
      gasPrice: 600000000000,
    },
  } as UseContractConfig);
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  useEffect(() => {
    data &&
      addRecentTransaction({
        hash: data.hash,
        description: "Quest Started",
      });
  }, [data]);

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
      let tempUserNFTArray = [] as NFT[];
      NFTsArray.forEach((nft) => {
        if (nft.owner === address?.toLocaleLowerCase()) {
          tempUserNFTArray.push(nft);
        }
      });
      setUserNFTsArray(tempUserNFTArray);

      setNFTEls(renderAllNFTs() as any);
      setUserNFTEls(renderUserNFTs() as any);
      setSelectedNFT(NFTsArray.find((nft) => nft.owner === address!.toLocaleLowerCase()) as NFT);
    }
  }, [NFTsArray]);

  useEffect(() => {
    selectedNFT && setSelectedNFTEl(renderSelectedNFTEl() as any);
  }, [selectedNFT]);

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

  function renderSelectedNFTEl() {
    return (
      <Flex width={"200px"} direction="column">
        <Image src={selectedNFT!.uri} />
        <Text>{"Token id: " + selectedNFT!.id}</Text>
        <Text>
          {"Owner: "}
          <Link href={"https://explorer.pops.one/address/" + selectedNFT!.owner} isExternal>
            {selectedNFT!.owner.substring(0, 5) + "..." + selectedNFT!.owner.substring(39, 42)}
          </Link>
        </Text>
        <Text>
          {"URI: "}
          <Link href={selectedNFT!.uri} isExternal>
            {selectedNFT!.uri.substring(0, 20)}
          </Link>
        </Text>
        <Flex justify={"space-between"}>
          <Button
            onClick={() =>
              setSelectedNFT(
                userNFTsArray.findIndex((nft) => nft.id === selectedNFT!.id) === 0
                  ? userNFTsArray[userNFTsArray.length - 1]
                  : userNFTsArray[userNFTsArray.findIndex((nft) => nft.id === selectedNFT!.id) - 1]
              )
            }
          >
            <BsArrowLeft size={"40px"} />
          </Button>
          <Button
            onClick={() =>
              setSelectedNFT(
                userNFTsArray.findIndex((nft) => nft.id === selectedNFT!.id) ===
                  userNFTsArray.length - 1
                  ? userNFTsArray[0]
                  : userNFTsArray[userNFTsArray.findIndex((nft) => nft.id === selectedNFT!.id) + 1]
              )
            }
          >
            <BsArrowRight size={"40px"} />
          </Button>
        </Flex>
      </Flex>
    );
  }

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
            <Flex
              p={3}
              m={1}
              borderRadius="2xl"
              background={useColorModeValue(buttonBackground, buttonBackground)}
              position={"absolute"}
            >
              {selectedNFTEl}
            </Flex>
            <Link href="https://docs.daoscape.one/home/gameplay/combat" isExternal>
              <Button
                position={"absolute"}
                fontSize={"20px"}
                top="28%"
                left="30%"
                background={buttonBackground}
                opacity="0.9"
                _hover={{ background: buttonHoverBackground }}
                _active={{ background: buttonActiveBackground }}
                p="2, 4"
                rounded="md"
              >
                Arena 🥊
              </Button>
            </Link>
            <Button
              onClick={() => setShowQuests(!showQuests)}
              fontSize={"20px"}
              position={"absolute"}
              top="25%"
              left="75%"
              background={buttonBackground}
              opacity="0.9"
              _hover={{ background: buttonHoverBackground }}
              _active={{ background: buttonActiveBackground }}
              p="2, 4"
              rounded="md"
            >
              Quest 💰
            </Button>

            <Link href="https://docs.daoscape.one/home/gameplay/training" isExternal>
              <Button
                fontSize={"20px"}
                position={"absolute"}
                top="80%"
                left="40%"
                background={buttonBackground}
                opacity="0.9"
                _hover={{ background: buttonHoverBackground }}
                _active={{ background: buttonActiveBackground }}
                p="2, 4"
                rounded="md"
              >
                Training 🏋️‍♂️
              </Button>
            </Link>

            <Button
              onClick={() => setShowTavern(!showTavern)}
              fontSize={"20px"}
              position={"absolute"}
              top="55%"
              left="62%"
              background={buttonBackground}
              opacity="0.9"
              _hover={{ background: buttonHoverBackground }}
              _active={{ background: buttonActiveBackground }}
              p="2, 4"
              rounded="md"
            >
              Tavern 🍻
            </Button>

            <Link href="https://docs.daoscape.one/home/gameplay/combat" isExternal>
              <Button
                fontSize={"20px"}
                position={"absolute"}
                top="45%"
                left="82%"
                background={buttonBackground}
                opacity="0.9"
                _hover={{ background: buttonHoverBackground }}
                _active={{ background: buttonActiveBackground }}
                p="2, 4"
                rounded="md"
              >
                Wilderness ☠
              </Button>
            </Link>
          </Flex>

          <Flex
            hidden={showTavern ? false : true}
            fontSize={"20px"}
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
              columns={{ base: 2, md: 3, lg: 4 }}
              spacing={"40px"}
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
            <Flex>
              <Button onClick={() => setShowQuests(!showQuests)} fontSize={"3xl"}>
                Exit Quests
              </Button>
            </Flex>
            <Flex
              p={3}
              borderRadius="2xl"
              background={useColorModeValue(buttonActiveBackground, buttonActiveBackground)}
            >
              {selectedNFTEl}
            </Flex>

            <Text fontSize={"xl"}>Send your Scapers on quests to earn EXP, and DAOGold!</Text>
            <Text fontSize={"lg"}>(60 min lock period.)</Text>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 2 }}
              spacing={10}
              background={formBackground}
            >
              <Button onClick={() => write?.()}>Start Quest</Button>
              <Button>End Quest</Button>
            </SimpleGrid>
          </Flex>
        </Flex>
      </Flex>
      <Flex justify={"space-between"} align="center">
        <ToggleTheme />
        <Button
          m={6}
          onClick={() => {
            setMuted(!muted);
          }}
        >
          {muted ? <BsVolumeMuteFill size={30} /> : <BsFillVolumeUpFill size={30} />}
        </Button>
      </Flex>
      <Sound url="/osrs.mp3" playStatus="PLAYING" volume={muted ? 0 : 40} />
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
