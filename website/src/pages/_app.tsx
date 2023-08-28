import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

import theme from "../components/theme";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider resetCSS theme={theme}>
    <Component {...pageProps} />
  </ChakraProvider>
);

export default MyApp;
