import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { lisk, liskSepolia, sepolia } from "viem/chains";

export const chain = sepolia;

const RPC = process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA;

const PK = process.env.NEXT_PUBLIC_PRIVATE_KEY_SEPOLIA;

export const account = privateKeyToAccount(
  PK?.startsWith("0x") ? (PK as `0x${string}`) : `0x${PK}`
);

console.log("Account address:", account.address);

export const publicClient = createPublicClient({
  chain,
  transport: http(RPC),
});

export const walletClient = createWalletClient({
  account,
  chain,
  transport: http(RPC),
});
