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
import { liskSepolia } from "wagmi/chains";
import type { Connector } from "wagmi";
import type { Eip1193Provider } from "ethers";

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
      <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
      <div style="opacity: 0.9;">${description}</div>
    `;
    document.body.appendChild(toastEl);
    setTimeout(() => {
      document.body.removeChild(toastEl);
    }, 3000);
  };

  return { toast };
};

export function WalletSelector({ className = "" }) {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get balance
  const { data: balance } = useBalance({
    address: address,
    chainId: liskSepolia.id,
  });

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

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
        description: "Failed to copy wallet address.",
      });
    }
  }, [address, toast]);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          <User className="w-5 h-5" />
          <div className="flex flex-col items-start">
            <span className="text-sm">{truncateAddress(address)}</span>
            {balance && (
              <span className="text-xs opacity-80">
                {Number(balance.formatted).toFixed(4)} {balance.symbol}
              </span>
            )}
          </div>
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 bg-transparent z-[998]"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[999] min-w-[200px] py-2">
              {/* Network Info */}
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="text-xs text-gray-500">Network</div>
                <div className="text-sm font-medium">
                  {chain?.name || "Unknown"}
                </div>
                {balance && (
                  <div className="text-xs text-gray-600">
                    Balance: {Number(balance.formatted).toFixed(4)}{" "}
                    {balance.symbol}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  copyAddress();
                  setDropdownOpen(false);
                }}
                className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left bg-transparent border-none cursor-pointer hover:bg-gray-50"
              >
                <Copy className="w-4 h-4" />
                Copy address
              </button>

              <button
                onClick={() => {
                  disconnect();
                  setDropdownOpen(false);
                }}
                className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left bg-transparent border-none cursor-pointer hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <WalletIcon className="w-4 h-4" /> Connect Wallet
      </button>

      {isDialogOpen && <ConnectWalletDialog close={closeDialog} />}
    </>
  );
}

function ConnectWalletDialog({ close }: { close: () => void }) {
  const { connect, connectors, isPending } = useConnect();
  const { switchChain } = useSwitchChain();

  const handleConnect = async (connector: Connector) => {
    try {
      await connect({ connector });

      // Try to switch to Lisk Sepolia after connection
      setTimeout(async () => {
        try {
          await switchChain({ chainId: liskSepolia.id });
        } catch (error) {
          // If network doesn't exist, add it
          if (window.ethereum) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: `0x${liskSepolia.id.toString(16)}`,
                    chainName: liskSepolia.name,
                    nativeCurrency: liskSepolia.nativeCurrency,
                    rpcUrls: ["https://rpc.sepolia-api.lisk.com"],
                    blockExplorerUrls: ["https://sepolia-blockscout.lisk.com"],
                  },
                ],
              });
            } catch (addError) {
              console.error("Error adding Lisk Sepolia network:", addError);
            }
          }
        }
      }, 1000);

      close();
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] flex items-center justify-center"
        onClick={close}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 max-w-lg w-[90%] max-h-[80vh] overflow-y-auto z-[9999] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 className="m-0 text-2xl font-semibold leading-tight text-indigo-500">
            Connect to Lisk Sepolia
          </h2>
        </div>

        {connectors.length > 0 ? (
          <div className="flex flex-col gap-3">
            {connectors.map((connector) => (
              <WalletRow
                key={connector.uid}
                connector={connector}
                onConnect={() => handleConnect(connector)}
                isPending={isPending}
              />
            ))}
          </div>
        ) : (
          <div className="p-5 text-center text-gray-500">
            <p>No wallets available</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>
              Install MetaMask or another Web3 wallet to connect
            </p>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            ℹ️ After connecting, we&apos;ll automatically add Lisk Sepolia
            network to your wallet.
          </p>
        </div>
      </div>
    </>
  );
}

function WalletRow({
  connector,
  onConnect,
  isPending,
}: {
  connector: Connector;
  onConnect: () => void;
  isPending: boolean;
}) {
  return (
    <div className="flex items-center justify-between w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
          {connector.name.charAt(0)}
        </div>
        <span className="font-medium">{connector.name}</span>
      </div>

      <button
        onClick={onConnect}
        disabled={isPending}
        className="px-4 py-2 text-sm bg-indigo-500 text-white border-none rounded-md cursor-pointer hover:bg-indigo-600 disabled:opacity-50"
      >
        {isPending ? "Connecting..." : "Connect"}
      </button>
    </div>
  );
}

// Add type declaration for window.ethereum
// Fix here
declare global {
  interface Window {
    ethereum?: Window["ethereum"] & Eip1193Provider;
  }
}
