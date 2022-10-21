import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../src/theme";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, useSigner, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { defaultChains } from "../src/chains";
import { ThirdwebSDKProvider } from "@thirdweb-dev/react";

//rainbowkit + wagmi
const { chains, provider } = configureChains(defaultChains, [publicProvider()]);
const { connectors } = getDefaultWallets({
  appName: "DAOScape",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function ThirdwebProvider({ wagmiClient, children }: any) {
  const { data: signer } = useSigner();

  return (
    <ThirdwebSDKProvider
      desiredChainId={1666700000}
      signer={signer as any}
      provider={wagmiClient.provider}
      queryClient={wagmiClient.queryClient as any}
      authConfig={{
        authUrl: "/api/auth",
        domain: "daoscape.one",
        loginRedirect: "/login",
      }}
    >
      {children}
    </ThirdwebSDKProvider>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} showRecentTransactions={true} coolMode>
          <ThirdwebProvider wagmiClient={wagmiClient}>
            <Component {...pageProps} />
          </ThirdwebProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
