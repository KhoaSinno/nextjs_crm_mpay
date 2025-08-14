import {
  WalletItem,
  isInstallRequired,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { Copy, LogOut, User, Wallet as WalletIcon } from "lucide-react";
import { useCallback, useState } from "react";
import type { AdapterWallet, AdapterNotDetectedWallet } from "@aptos-labs/wallet-adapter-react";

// Simple toast hook replacement
const useToast = () => {
  const toast = ({ title, description, variant = "default" }: { title: string; description: string; variant?: "default" | "destructive" }) => {
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
  const { account, connected, disconnect } = useWallet();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const copyAddress = useCallback(async () => {
    if (!account?.address.toStringLong()) return;
    try {
      await navigator.clipboard.writeText(account.address.toStringLong());
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
  }, [account?.address, toast]);

  if (connected) {
    return (
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          <User className="w-5 h-5" />
          {account?.ansName ||
            truncateAddress(account?.address.toStringLong()) ||
            "Unknown"}
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 bg-transparent z-[998]"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[999] min-w-[200px] py-2">
              <button
                onClick={() => {
                  copyAddress();
                  setDropdownOpen(false);
                }}
                className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left bg-transparent border-none cursor-pointer"
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.backgroundColor = "transparent")
                }
              >
                <Copy className="w-4 h-4" />
                Copy address
              </button>

              <button
                onClick={() => {
                  disconnect();
                  setDropdownOpen(false);
                }}
                className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left bg-transparent border-none cursor-pointer"
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.backgroundColor = "transparent")
                }
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
  const { wallets = [] } = useWallet();
  const [showInstallable, setShowInstallable] = useState(false);

  // Filter wallets to only show installed ones
  const installedWallets = wallets.filter(
    (wallet) => !isInstallRequired(wallet)
  );
  const installableWallets = wallets.filter((wallet) =>
    isInstallRequired(wallet)
  );

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
            Connect a Wallet
          </h2>
        </div>

        {installedWallets.length > 0 ? (
          <div className="flex flex-col gap-3">
            {installedWallets.map((wallet) => (
              <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
            ))}
          </div>
        ) : (
          <div className="p-5 text-center text-gray-500">
            <p>No wallets installed</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>
              Install a wallet to connect to Aptos
            </p>
          </div>
        )}

        {installableWallets.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <button
              onClick={() => setShowInstallable(!showInstallable)}
              className="flex items-center gap-2 py-2 text-sm text-gray-500 bg-transparent border-none cursor-pointer"
            >
              Install wallets
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  transform: showInstallable
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {showInstallable && (
              <div className="flex flex-col gap-3 mt-2">
                {installableWallets.map((wallet) => (
                  <WalletRow
                    key={wallet.name}
                    wallet={wallet}
                    onConnect={close}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function WalletRow({
  wallet,
  onConnect,
}: {
  wallet: AdapterWallet | AdapterNotDetectedWallet;
  onConnect: () => void;
}) {
  return (
    <WalletItem
      wallet={wallet}
      onConnect={() => {
        onConnect();
      }}
      className="flex items-center justify-between w-full"
    >
      <div className="flex items-center gap-3">
        <WalletItem.Icon className="w-6 h-6" />
        <WalletItem.Name />
      </div>

      {isInstallRequired(wallet) ? (
        <WalletItem.InstallLink className="px-3 py-1.5 text-sm bg-transparent border border-gray-200 rounded-md cursor-pointer text-black no-underline">
          Install
        </WalletItem.InstallLink>
      ) : (
        <WalletItem.ConnectButton className="px-3 py-1.5 text-sm bg-indigo-500 text-white border-none rounded-md cursor-pointer">
          Connect
        </WalletItem.ConnectButton>
      )}
    </WalletItem>
  );
}
