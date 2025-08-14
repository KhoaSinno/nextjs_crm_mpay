// import { NextResponse } from "next/server";
// import { ethers } from "ethers";

// const RPC_URL = "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID";
// const CONTRACT_ADDRESS = "0xYourContractAddress";
// const CONTRACT_ABI = [
//   "function balanceOf(address owner) view returns (uint256)"
// ];

// export async function GET(request: Request) {
//   const provider = new ethers.JsonRpcProvider(RPC_URL);
//   const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

//   const { searchParams } = new URL(request.url);
//   const address = searchParams.get("address");

//   if (!address) {
//     return NextResponse.json({ error: "Missing address" }, { status: 400 });
//   }

//   const balance = await contract.balanceOf(address);
//   return NextResponse.json({ balance: balance.toString() });
// }