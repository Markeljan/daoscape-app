import { Flex, Button, SimpleGrid } from "@chakra-ui/react";
import { useContext } from "react";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import { GameContext } from "../contexts/GameContext";

export default function Tavern() {
  const {
    setShowTavern,
    showTavern,
    setFilterNFTs,
    filterNFTs,
    formBackground,
    userNFTEls,
    NFTEls,
  } = useContext<any>(GameContext);
  return (
    <Flex
      hidden={!showTavern}
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

      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={"40px"} background={formBackground}>
        {filterNFTs ? userNFTEls : NFTEls}
      </SimpleGrid>
    </Flex>
  );
}
