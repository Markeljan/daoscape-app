import { Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import ToggleTheme from "../components/ToggleTheme";

export default function GatedPage() {
  const formBackground = useColorModeValue("gray.100", "gray.700");

  return (
    <>
      <Navbar />
      <Flex direction="column" justifyContent="center" alignItems="center" mt={10}>
        <Flex
          padding={["15vw", "15vw", "20vw", "20vw", "25vw", "25vw"]}
          background={formBackground}
          borderRadius="2xl"
        >
          <Text fontSize="5xl">Gated Content</Text>
        </Flex>
      </Flex>
      <ToggleTheme />
    </>
  );
}
