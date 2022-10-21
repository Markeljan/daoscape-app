import { Button, Flex } from "@chakra-ui/react";
import { useAddress, useLogin, useUser } from "@thirdweb-dev/react";

// replace this with your contract address
const contractAddress = "0x1fCbA150F05Bbe1C9D21d3ab08E35D682a4c41bF";

export default function Login() {
  const address = useAddress();
  const login = useLogin();
  const { user } = useUser();

  return (
    <Flex direction={"column"}>
      <h1>Auth - NFT Gated Content</h1>

      <p>You cannot access the main page unless you own an NFT from our collection!</p>

      <hr />

      <>
        <p>Welcome, {address?.slice(0, 6)}...</p>

        <Button style={{ width: 256 }} onClick={() => login()}>
          Sign In
        </Button>

        <p>For demo purposes, you can claim an NFT from our collection below:</p>
      </>
    </Flex>
  );
}
