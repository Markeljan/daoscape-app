import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../static/theme";
import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  getDefaultWallets,
  cssStringFromTheme,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { defaultChains } from "../static/chains";

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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={null}>
          <style
            dangerouslySetInnerHTML={{
              __html: `
            :root {
              ${cssStringFromTheme(lightTheme)}
            }

            html[data-dark] {
              ${cssStringFromTheme(darkTheme, {
                extends: lightTheme,
              })}
            }
          `,
            }}
          />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
