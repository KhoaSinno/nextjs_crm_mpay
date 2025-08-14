"use client";

import { Copy, LogOut, User, Wallet as WalletIcon } from "lucide-react";
import { useCallback, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useSwitchChain,
} from "wagmi";
import { liskSepolia, sepolia } from "wagmi/chains";
import type { Connector } from "wagmi";
import { WalletError, WalletErrorCodes } from "@/types/wallet";

// Simple toast hook replacement
const useToast = () => {
  const toast = ({
    title,
    description,
    variant = "default",
  }: {
    title: string;
    description: string;
    variant?: "default" | "destructive";
  }) => {
    const toastEl = document.createElement("div");
    toastEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 9999;
      min-width: 300px;
      ${
        variant === "destructive"
          ? "background-color: #ef4444;"
          : "background-color: #22c55e;"
      }
    `;
    toastEl.innerHTML = `
      <div style="font-size: 14px; margin-bottom: 4px;">${title}</div>
      <div style="font-size: 12px; opacity: 0.9;">${description}</div>
    `;
    document.body.appendChild(toastEl);
    setTimeout(() => {
      document.body.removeChild(toastEl);
    }, 3000);
  };
  return { toast };
};

export function WalletSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const { address, isConnected, chain } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const { data: balance } = useBalance({
    address,
  });

  // Add Lisk Sepolia network to wallet if not exists
  const addLiskSepoliaNetwork = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${liskSepolia.id.toString(16)}`,
              chainName: liskSepolia.name,
              rpcUrls: [liskSepolia.rpcUrls.default.http[0]],
              nativeCurrency: liskSepolia.nativeCurrency,
              blockExplorerUrls: liskSepolia.blockExplorers
                ? [liskSepolia.blockExplorers.default.url]
                : [],
            },
          ],
        });
        return true;
      } catch (error: unknown) {
        console.error("Error adding Lisk Sepolia network:", error);
        const walletError = error as WalletError;
        if (walletError.code === WalletErrorCodes.USER_REJECTED_REQUEST) {
          toast({
            variant: "destructive",
            title: "Network Addition Cancelled",
            description: "You cancelled the network addition request.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Failed to Add Network",
            description: "Could not add Lisk Sepolia network to your wallet.",
          });
        }
        return false;
      }
    }
    return false;
  }, [toast]);

  // Switch to Lisk Sepolia network
  const switchToLiskSepolia = useCallback(async () => {
    if (!switchChain) return;

    try {
      await switchChain({ chainId: liskSepolia.id });
      toast({
        title: "Network Switched",
        description: "Successfully switched to Lisk Sepolia network.",
      });
    } catch (error: unknown) {
      console.error("Error switching to Lisk Sepolia:", error);
      const walletError = error as WalletError;
      if (walletError.code === WalletErrorCodes.UNRECOGNIZED_CHAIN_ID) {
        // Network not added to wallet, try to add it
        const networkAdded = await addLiskSepoliaNetwork();
        if (networkAdded) {
          // Try switching again after adding network
          try {
            await switchChain({ chainId: liskSepolia.id });
            toast({
              title: "Network Switched",
              description: "Successfully switched to Lisk Sepolia network.",
            });
          } catch (switchError: unknown) {
            console.error("Error switching after adding network:", switchError);
            toast({
              variant: "destructive",
              title: "Switch Failed",
              description: "Failed to switch to Lisk Sepolia network.",
            });
          }
        }
      } else if (walletError.code === WalletErrorCodes.USER_REJECTED_REQUEST) {
        toast({
          variant: "destructive",
          title: "Network Switch Cancelled",
          description: "You cancelled the network switch request.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Switch Failed",
          description: "Failed to switch to Lisk Sepolia network.",
        });
      }
    }
  }, [switchChain, toast, addLiskSepoliaNetwork]);

  // Switch to Ethereum Sepolia network
  const switchToEthereumSepolia = useCallback(async () => {
    if (!switchChain) return;

    try {
      await switchChain({ chainId: sepolia.id });
      toast({
        title: "Network Switched",
        description: "Successfully switched to Ethereum Sepolia network.",
      });
    } catch (error: unknown) {
      console.error("Error switching to Ethereum Sepolia:", error);
      const walletError = error as WalletError;
      if (walletError.code === WalletErrorCodes.USER_REJECTED_REQUEST) {
        toast({
          variant: "destructive",
          title: "Network Switch Cancelled",
          description: "You cancelled the network switch request.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Switch Failed",
          description: "Failed to switch to Ethereum Sepolia network.",
        });
      }
    }
  }, [switchChain, toast]);

  const copyAddress = useCallback(async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Success",
        description: "Copied wallet address to clipboard.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy address to clipboard.",
      });
    }
  }, [address, toast]);

  const handleConnect = (connector: Connector) => {
    connect({ connector });
    setIsOpen(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <WalletIcon className="w-4 h-4" />
          <span className="hidden sm:block">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Wallet</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Network Info */}
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="text-xs text-gray-500">Network</div>
                <div className="text-sm font-medium">
                  {chain?.name || "Unknown"}
                </div>

                {/* Network Switch Buttons */}
                {isConnected && (
                  <div className="mt-2 space-y-2">
                    <button
                      onClick={switchToEthereumSepolia}
                      className={`w-full px-3 py-2 text-xs rounded-md border transition-colors ${
                        chain?.id === sepolia.id
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Switch to Ethereum Sepolia
                    </button>
                    <button
                      onClick={switchToLiskSepolia}
                      className={`w-full px-3 py-2 text-xs rounded-md border transition-colors ${
                        chain?.id === liskSepolia.id
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Switch to Lisk Sepolia
                    </button>
                  </div>
                )}
              </div>

              {/* Balance */}
              {balance && (
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-xs text-gray-500">Balance</div>
                  <div className="text-sm font-medium">
                    {balance.formatted} {balance.symbol}
                  </div>
                </div>
              )}

              {/* Account Info */}
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Address</div>
                    <div className="text-sm font-mono">
                      {address.slice(0, 8)}...{address.slice(-8)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 py-2 space-y-2">
                <button
                  onClick={copyAddress}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Address</span>
                </button>
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <WalletIcon className="w-4 h-4" />
        <span>Connect Wallet</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Connect Wallet
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => handleConnect(connector)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  <WalletIcon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{connector.name}</div>
                    <div className="text-xs text-gray-500">
                      Connect using {connector.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
