import { Flex, Button, useColorModeValue } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export default function ToggleTheme({ toggleColorMode }: any) {
  const toggleIcon = useColorModeValue(<MoonIcon />, <SunIcon />);
  return (
    <Flex direction="row" alignItems="center" justifyContent="left" p={6}>
      <Button onClick={toggleColorMode}>{toggleIcon}</Button>
    </Flex>
  );
}
