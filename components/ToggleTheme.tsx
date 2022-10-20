import { Flex, Button } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export default function ToggleTheme({ toggleColorMode, colorMode }: any) {
  return (
    <Flex direction="row" alignItems="center" justifyContent="left" p={6}>
      <Button onClick={toggleColorMode}>
        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      </Button>
    </Flex>
  );
}
