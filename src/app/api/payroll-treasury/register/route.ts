import { publicClient, walletClient, account } from "@/lib/viem";
import { parseEther } from "viem";
import { PAYROLL_CONTRACT } from "../../../../../constants/app-contract";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Valid
    if (!body || !body.walletAddress || !body.salary) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
      });
    }

    // Process the valid request
    const { walletAddress, salary } = body;

    const parsedWei = parseEther(salary);

    const sim = await publicClient.simulateContract({
      address: PAYROLL_CONTRACT.address as `0x${string}`,
      abi: PAYROLL_CONTRACT.abi,
      functionName: "registerEmployee",
      args: [walletAddress, parsedWei],
      account: account, // Specify the account for simulation
    });

    const hash = await walletClient.writeContract(sim.request);

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return NextResponse.json({
      ok: true,
      hash,
      blockNumber: receipt.blockNumber.toString(),
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, message: e.message ?? "error" },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: false, error: "Internal Server Error" });
  }
}
