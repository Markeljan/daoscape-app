import { Flex, Button, Image, Link } from "@chakra-ui/react";
import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import { useColorModeValue } from "@chakra-ui/react";

export default function GameMap() {
  const {
    setShowTavern,
    showTavern,
    showQuests,
    setShowQuests,
    buttonBackground,
    selectedNFTEl,
    buttonHoverBackground,
    buttonActiveBackground,
  } = useContext<any>(GameContext);

  return (
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
  );
}
