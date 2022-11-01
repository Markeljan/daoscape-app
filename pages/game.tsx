import { Button, Flex, Image, Link, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
import Navbar from "../src/components/Navbar";
import ToggleTheme from "../src/components/ToggleTheme";
import { DAOSCAPE_DATA } from "../src/contracts";
import {
  useAccount,
  useContractRead,
  useNetwork,
  useContract,
  useProvider,
  useSigner,
} from "wagmi";
import { useEffect, useState } from "react";
import { BsArrowLeft, BsArrowRight, BsFillVolumeUpFill, BsVolumeMuteFill } from "react-icons/bs";
import Sound from "react-sound";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import Head from "next/head";

import QuestHall from "../src/components/QuestHall";
import { GameContext } from "../src/contexts/GameContext";
import Tavern from "../src/components/Tavern";
import GameMap from "../src/components/GameMap";

interface NFT {
  id: number;
  owner: string;
  uri: string;
}

export default function Game() {
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
    signerOrProvider: signer,
  });

  const beginQuest = () => DAOSCAPE_WRITE?.beginQuest(selectedNFT?.id);
  const endQuest = () => DAOSCAPE_WRITE?.endQuest(selectedNFT?.id);

  const gameData = {
    DAOSCAPE_READ,
    DAOSCAPE_WRITE,
    address,
    chain,
    provider,
    signer,
    beginQuest,
    endQuest,
    showQuests,
    setShowQuests,
    showTavern,
    setShowTavern,
    buttonActiveBackground,
    formBackground,
    selectedNFTEl,
    setFilterNFTs,
    filterNFTs,
    userNFTEls,
    NFTEls,
    buttonBackground,
    buttonHoverBackground,
  };

  const addRecentTransaction = useAddRecentTransaction();

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
    <GameContext.Provider value={gameData as any}>
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
          <GameMap />
          <Tavern />
          <QuestHall />
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
    </GameContext.Provider>
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
