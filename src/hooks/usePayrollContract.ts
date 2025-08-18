import { parseEther } from "ethers";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PAYROLL_CONTRACT } from "../../constants/app-contract";

/** 1) Deposit ETH into contract */
export const useDeposit = () => {
  const { data: txHash, error, isPending, writeContract } = useWriteContract();

  return { txHash, error, isPending, writeContract };
};

/** 2) Withdraw ETH from contract */
export const useWithdraw = () => {
  const { data: txHash, error, isPending, writeContract } = useWriteContract();

  return { txHash, error, isPending, writeContract };
};

/** 3) Register a new employee */
export const useRegisterEmployee = () => {
  const { data: txHash, error, isPending, writeContract } = useWriteContract();

  const registerEmployee = (address: string, rateETH: string | number) => {
    // Valid data
    if (!address || !rateETH) {
      throw new Error("Invalid address or rateETH");
    }
    // Parse rateETH
    const parsedRate = parseEther(rateETH.toString());
    // Call writeContract
    writeContract({
      ...PAYROLL_CONTRACT,
      address: PAYROLL_CONTRACT.address as `0x${string}`,
      functionName: "registerEmployee",
      args: [address as `0x${string}`, parsedRate],
    });
    // return
  };

  const {
    data,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  return {
    txHash,
    error,
    isPending,
    writeContract,
    registerEmployee,
    data,
    isConfirming,
    isConfirmed,
  };
};

/** 4) Pay for employee */
export const usePayEmployee = () => {
  const { data: txHash, error, isPending, writeContract } = useWriteContract();

  return { txHash, error, isPending, writeContract };
};

/** 4) Run payroll */
export const useRunPayroll = () => {
  const { data: txHash, error, isPending, writeContract } = useWriteContract();

  return { txHash, error, isPending, writeContract };
};
