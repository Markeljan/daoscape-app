import { Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import ToggleTheme from "../components/ToggleTheme";

export default function GatedPage() {
  const formBackground = useColorModeValue("gray.100", "gray.700");

  return (
    <>
      <Navbar />
      <Flex direction="column" justifyContent="center" alignItems="center" height="80vh">
        <Flex padding={[50, 100, 150, 200, 250, 300]} background={formBackground}>
          <Text fontSize="5xl">Gated Content</Text>
        </Flex>
      </Flex>
      <ToggleTheme />
    </>
  );
}
