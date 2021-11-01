import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { store } from "../app/store";
import { Provider } from "react-redux";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
