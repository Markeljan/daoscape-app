import { Button, Flex, Text } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function GatedPage() {
  return (
    <div>
      <Navbar />
      <Flex direction="column" justifyContent="center" alignItems="center" height="80vh">
        <Text fontSize={"6xl"}>Gated Content</Text>
      </Flex>
    </div>
  );
}
