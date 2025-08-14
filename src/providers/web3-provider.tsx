"use client"

// LISK SDK integration
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider, createConfig } from "wagmi";
import { liskSepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { useState } from "react";

const config = createConfig({
  ssr: true,
  chains: [liskSepolia],
  connectors: [metaMask()],
  transports: {
    [liskSepolia.id]: http(),
  },
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
