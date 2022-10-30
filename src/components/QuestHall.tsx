import { Flex, Button, Text, SimpleGrid } from "@chakra-ui/react";
import { useContext } from "react";
import { ContractContext } from "../contexts/ContractContext";

export default function QuestHall() {
  const message = useContext(ContractContext);
  console.log(message);
  return (
    <Flex
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
      <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={10} background={formBackground}>
        <Button
          disabled={beginQuestStatus === "success" ? false : true}
          onClick={() => beginQuest?.()}
        >
          Start Quest
        </Button>
        <Button onClick={() => endQuest?.()}>End Quest</Button>
      </SimpleGrid>
    </Flex>
  );
}
