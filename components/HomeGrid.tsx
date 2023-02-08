import { Flex, Heading, Text, Button, SimpleGrid, Link } from "@chakra-ui/react";
import { SiGitbook, SiGithub, SiLinkedin, SiTelegram, SiTwitter } from "react-icons/si";
import NewsLetterSignUpForm from "./NewsLetterSignUpForm";

export default function HomeGrid({ formBackground, containerBackground }: any) {
  return (
    <SimpleGrid columns={[1, 1, 2, 2, 3, 4]} spacing={12}>
      <Flex
        justifyContent={"center"}
        direction="column"
        background={formBackground}
        p={12}
        rounded={6}
        height={"300px"}
        width={"300px"}
      >
        <Heading mb={2}>Sign up</Heading>
        <Text fontSize="sm" mb={6}>
          Dev updates and minting details.
        </Text>
        <Flex direction={"column"} height={"100%"} justifyContent={"center"}>
          <NewsLetterSignUpForm />
        </Flex>
      </Flex>

      <Flex
        direction="column"
        background={formBackground}
        p={12}
        rounded={6}
        height={"300px"}
        width={"300px"}
      >
        <Heading mb={2}>Docs</Heading>
        <Text fontSize="sm" mb={6}>
          Read the Whitepaper / docs.
        </Text>
        <Flex direction={"column"} height={"100%"} justifyContent={"center"}>
          <Link href="https://docs.daoscape.one" target="_blank">
            <Button colorScheme="teal" width={"100%"}>
              <SiGitbook size={30} />
            </Button>
          </Link>
        </Flex>
      </Flex>

      <Flex
        justifyContent={"center"}
        direction="column"
        background={formBackground}
        p={12}
        rounded={6}
        height={"300px"}
        width={"300px"}
      >
        <Heading mb={2}>Connect</Heading>
        <Text fontSize="sm" mb={6}>
          Connect with us!
        </Text>
        <Flex direction={"column"} height={"100%"} justifyContent={"center"}>
          <SimpleGrid columns={3} spacing={"3vh"}>
            <Link href="https://twitter.com/daoscape_" target="_blank">
              <Button colorScheme="teal">
                <SiTwitter size={20} />
              </Button>
            </Link>
            <Link href="https://t.me/DAOScape" target="_blank">
              <Button colorScheme="teal">
                <SiTelegram size={20} />
              </Button>
            </Link>
            <Link href="https://linkedin.com/in/markeljan" target="_blank">
              <Button colorScheme="teal">
                <SiLinkedin size={19} />
              </Button>
            </Link>
          </SimpleGrid>
        </Flex>
      </Flex>
      <Flex
        justifyContent={"center"}
        direction="column"
        background={formBackground}
        p={12}
        rounded={6}
        height={"300px"}
        width={"300px"}
      >
        <Heading mb={2}>Github</Heading>
        <Text fontSize="sm" mb={6}>
          Explore the open-source repo.
        </Text>
        <Flex direction={"column"} height={"100%"} justifyContent={"center"}>
          <Link href="https://github.com/Markeljan/daoscape-app" target="_blank">
            <Button colorScheme="teal" width={"100%"}>
              <SiGithub size={25} />
            </Button>
          </Link>
        </Flex>
      </Flex>
    </SimpleGrid>
  );
}
