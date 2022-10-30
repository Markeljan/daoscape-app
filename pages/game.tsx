import { Button, Flex, Image, Link, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
import Navbar from "../src/components/Navbar";
import ToggleTheme from "../src/components/ToggleTheme";
import { DAOSCAPE_DATA } from "../src/contracts";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useContract,
  useProvider,
  useSigner,
} from "wagmi";
import { createContext, useContext, useEffect, useState } from "react";
import {
  BsArrowLeft,
  BsArrowRight,
  BsFillVolumeUpFill,
  BsToggleOff,
  BsToggleOn,
  BsVolumeMuteFill,
} from "react-icons/bs";
import Sound from "react-sound";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import { UseContractConfig } from "wagmi/dist/declarations/src/hooks/contracts/useContract";

import { ContractContext } from "../src/contexts/ContractContext";
import QuestHall from "../src/components/QuestHall";

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

  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const DAOSCAPE_READ = useContract({
    address: DAOSCAPE_DATA[chain?.id as keyof typeof DAOSCAPE_DATA] as string,
    abi: DAOSCAPE_DATA.abi,
    signerOrProvider: provider,
  });
  const DAOSCAPE_WRITE = useContract({
    address: DAOSCAPE_DATA[chain?.id as keyof typeof DAOSCAPE_DATA] as string,
    abi: DAOSCAPE_DATA.abi,
  });

  const addRecentTransaction = useAddRecentTransaction();
  const {
    config: beginQuestConfig,
    status: beginQuestStatus,
    isSuccess: beginQuestTx,
  } = usePrepareContractWrite({
    ...DAOSCAPE_WRITE,
    functionName: "beginQuest",
    args: [selectedNFT?.id],
    overrides: {
      gasPrice: 600000000000,
    },
  } as UseContractConfig);
  const { data: beginQuestData, write: beginQuest } = useContractWrite(beginQuestConfig);

  const { config: endQuestConfig } = usePrepareContractWrite({
    ...DAOSCAPE_READ,
    functionName: "endQuest",
    args: [],
    overrides: {
      gasPrice: 600000000000,
    },
    enabled: false,
  } as UseContractConfig);
  const { data: endQuestData, write: endQuest } = useContractWrite(endQuestConfig);

  const { data: totalSupplyData } = useContractRead({
    ...DAOSCAPE_READ,
    functionName: "totalSupply",
  });

  const { data: userNFTBalance } = useContractRead({
    ...DAOSCAPE_READ,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    let tempNFTArray = [] as NFT[];
    let tempUserNFTArray = [] as NFT[];
    let nftOwner;
    let nftURI;
    async function getAndRenderNFTs() {
      for (let i = 1; i <= Number(totalSupplyData); i++) {
        nftOwner = await DAOSCAPE_READ?.ownerOf(i);
        nftURI = await DAOSCAPE_READ?.tokenURI(i);
        tempNFTArray.push({ id: i, owner: nftOwner, uri: nftURI });
        //add user NFTS to UserNFTsArray
        if (nftOwner === address) {
          tempUserNFTArray.push({ id: i, owner: nftOwner, uri: nftURI });
        }
      }
      setNFTsArray(tempNFTArray);
      setUserNFTsArray(tempUserNFTArray);
    }
    DAOSCAPE_READ && getAndRenderNFTs();
  }, [DAOSCAPE_READ]);

  useEffect(() => {
    if (NFTsArray.length > 0) {
      setSelectedNFT(NFTsArray.find((nft) => nft.owner === address) as NFT);
      setNFTEls(renderAllNFTs() as any);
      setUserNFTEls(renderUserNFTs() as any);
    }
  }, [NFTsArray]);

  useEffect(() => {
    if (selectedNFT) {
      setSelectedNFTEl(renderSelectedNFTEl() as any);
    }
  }, [selectedNFT]);

  function renderAllNFTs() {
    if (NFTsArray.length < 1) {
      return;
    }
    return NFTsArray.map((nft) => {
      return (
        <Flex key={nft.id} direction="column" align="center" justify="center">
          <Image src={nft.uri} />
          <Text>{"id: " + nft.id}</Text>
          <Text>
            {"Owner: "}
            <Link href={chain?.blockExplorers?.default.url + "/address/" + nft.owner} isExternal>
              {nft.owner?.substring(0, 20)}
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
    if (userNFTsArray.length < 1) {
      return;
    }
    return NFTsArray.map((nft) => {
      if (nft.owner === address)
        return (
          <Flex key={nft.id} direction="column" align="center" justify="center">
            <Image src={nft.uri} />
            <Text>{"id: " + nft.id}</Text>
            <Text>
              {"Owner: "}
              <Link href={chain?.blockExplorers?.default.url + "/address/" + nft.owner} isExternal>
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
    if (!selectedNFT) {
      return;
    }
    return (
      <Flex width={"200px"} direction="column">
        <Image src={selectedNFT!.uri} />
        <Text>{"Token id: " + selectedNFT!.id}</Text>
        <Text>
          {"Owner: "}
          <Link
            href={chain?.blockExplorers?.default.url + "/address/" + selectedNFT!.owner}
            isExternal
          >
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
                userNFTsArray.findIndex((nft) => nft.id === selectedNFT.id) === 0
                  ? userNFTsArray[userNFTsArray.length - 1]
                  : userNFTsArray[userNFTsArray.findIndex((nft) => nft.id === selectedNFT.id) - 1]
              )
            }
          >
            <BsArrowLeft size={"40px"} />
          </Button>
          <Button
            onClick={() =>
              setSelectedNFT(
                userNFTsArray.findIndex((nft) => nft.id === selectedNFT.id) ===
                  userNFTsArray.length - 1
                  ? userNFTsArray[0]
                  : userNFTsArray[userNFTsArray.findIndex((nft) => nft.id === selectedNFT.id) + 1]
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
    <ContractContext.Provider value="hello from context">
      <Head>
        <title>DAOScape Game</title>
        <meta name="description" content="DAOScape Game" />
        <link rel="icon" href="/swords.ico" />
      </Head>
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

          {showQuests && <QuestHall />}

          {/* <Flex
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
              <Button
                disabled={beginQuestStatus === "success" ? false : true}
                onClick={() => beginQuest?.()}
              >
                Start Quest
              </Button>
              <Button onClick={() => endQuest?.()}>End Quest</Button>
            </SimpleGrid>
          </Flex> */}
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
      <Sound url="/osrs.mp3" playStatus={muted ? "PLAYING" : "PAUSED"} volume={muted ? 0 : 10} />
    </ContractContext.Provider>
  );
}

function useDebounce(tokenId: string, arg1: number) {
  throw new Error("Function not implemented.");
}
//checks for NFT in user wallet.
// export async function getServerSideProps(context: any) {
//   if (!PRIVATE_KEY) {
//     throw new Error("No PRIVATE_KEY environment variable found.");
//   }
//   const user = await getUser(context.req);

//   if (!user) {
//     return {
//       redirect: {
//         destination: "/mint",
//         permanent: false,
//       },
//     };
//   }

//   const userNFTBalance = await contract.balanceOf(user.address, DEFAULT_GAS);
//   let hasNFT;
//   Number(userNFTBalance) > 0 ? (hasNFT = true) : (hasNFT = false);

//   if (!hasNFT) {
//     return {
//       redirect: {
//         destination: "/mint",
//         permanent: false,
//       },
//     };
//   }

//   // Finally, return the props
//   return {
//     props: {},
//   };
// }
