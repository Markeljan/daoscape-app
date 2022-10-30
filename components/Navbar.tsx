import { Button, Flex, useColorModeValue, Image } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Router from "next/router";
import { useAccount } from "wagmi";

export default function Navbar() {
  const { push } = Router;
  const { isConnected } = useAccount();

  const formBackground = useColorModeValue("gray.100", "gray.700");
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      background={formBackground}
      borderRadius="2xl"
      p="22px"
      m={2}
    >
      <Flex gap={["5px", "10px", "20px", "20px", "20px", "20px"]}>
        <Button onClick={() => push("/")}>Home</Button>
        <Button onClick={() => push("/mint")}>Mint</Button>
        <Button disabled={isConnected ? false : true} onClick={() => push("/game")}>
          Game
        </Button>
      </Flex>
      <Image src="/DAOScape.png" width={{ sm: "0px", md: "200px", lg: "300px" }} />
      <ConnectButton />
    </Flex>
  );
}
