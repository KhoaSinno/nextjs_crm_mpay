"use client";

// LISK SDK integration
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider, createConfig } from "wagmi";
import { sepolia, liskSepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { useState } from "react";

const config = createConfig({
  ssr: true,
  chains: [sepolia, liskSepolia], // Hỗ trợ cả Ethereum Sepolia và Lisk Sepolia
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(), // Ethereum Sepolia
    [liskSepolia.id]: http(), // Lisk Sepolia
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
