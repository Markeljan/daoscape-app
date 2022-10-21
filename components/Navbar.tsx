import { Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Router from "next/router";

export default function Navbar() {
  const { push } = Router;
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
      <Flex gap={["5px", "5px", "10px", "10px", "20px", "20px"]}>
        <Button onClick={() => push("/")}>Home</Button>
        <Button onClick={() => push("/mint")}>Mint</Button>
        <Button onClick={() => push("/gated")}>Gated</Button>
      </Flex>
      <ConnectButton />
    </Flex>
  );
}
