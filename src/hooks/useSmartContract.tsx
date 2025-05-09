import { useCallback, useMemo } from "react";
import {
  BrowserProvider,
  Contract,
  ethers,
  formatEther,
  JsonRpcProvider,
  JsonRpcSigner,
} from "ethers";
import bountyBoardJson from "../json/bounty-board.json";
import { useUpProvider } from "../context/UpProvider";
import { config } from "@/config";
import { IBounty, IBountySubmission } from "./type";
import { createPublicClient, http } from "viem";
import { luksoTestnet } from "viem/chains";

export const useSmartContract = () => {
  const { client, accounts } = useUpProvider();
  const contractAddress: `0x${string}` = config.CONTRACT_ADDRESS;

  const getContractInstance = useCallback(
    async (
      contractAddress: string,
      signer: ethers.Signer
    ): Promise<Contract> => {
      return new ethers.Contract(contractAddress, bountyBoardJson.abi, signer);
    },
    []
  );

  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: luksoTestnet,
      transport: http(config.RPC_URL),
    })
  }, [])

  const getProvider = async (): Promise<BrowserProvider> => {
    if (!window.lukso) {
      throw new Error("Lukso provider is not available on window object.");
    }
    return new ethers.BrowserProvider(window.lukso);
  };

  const getProviderRPC = async (): Promise<JsonRpcProvider> => {
    return new ethers.JsonRpcProvider(config.RPC_URL);
  };

  const getSigner = useCallback(async (): Promise<JsonRpcSigner> => {
    const browserProvider = await getProvider();
    return browserProvider.getSigner();
  }, []);

  const getContractInstanceWithRPCProvider =
    useCallback(async (): Promise<Contract> => {
      return new ethers.Contract(
        contractAddress,
        bountyBoardJson.abi,
        await getProviderRPC()
      );
    }, [contractAddress]);

  const getEthBalance = useCallback(
    async (address: string) => {
      const defaultReturn = {
        formatted: "0",
        bigNumber: BigInt(0),
        wei: "0",
      };
      try {
        if (!client) {
          return defaultReturn;
        }

        const balanceHex = await client.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        });

        const balanceBN = BigInt(balanceHex);

        return {
          formatted: formatEther(balanceBN),
          bigNumber: balanceBN,
          wei: balanceBN.toString(),
        };
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        return defaultReturn;
      }
    },
    [client]
  );

  const getUserBounties = useCallback(
    async (creatorAddress: string) => {
      try {
        const contract = await getContractInstanceWithRPCProvider();
        const res = await contract.getUserBounties(creatorAddress);
        return (res || []) as number[];
      } catch (error) {
        console.error("Failed to fetch user bounties:", error);
        return [];
      }
    },
    [getContractInstanceWithRPCProvider]
  );

  const createBounty = useCallback(
    async (
      _title: string,
      _cid: string,
      _deadline: number,
      _resultDeadline: number,
      _minParticipants: number,
      _totalWinners: number,
      _totalPrizes: number[],
      _bountyType: number
    ) => {
      try {
        if (!client) {
          return;
        }
        const contract = await getContractInstance(contractAddress, client);
        const prizesInWei = _totalPrizes.map((prize) =>
          ethers.parseEther(String(prize))
        );

        const data = contract.interface.encodeFunctionData("createBounty", [
          _cid,
          _deadline,
          _resultDeadline,
          _minParticipants,
          _totalWinners,
          prizesInWei,
          _bountyType,
        ]);

        const totalPrizeValue = prizesInWei.reduce(
          (sum, prize) => sum + prize,
          BigInt(0)
        );

        const fee = (totalPrizeValue * BigInt(5)) / BigInt(100);
        const totalValue = totalPrizeValue + fee;

        // Send the transaction and get the hash
        const txResponse = await client.sendTransaction({
          account: accounts[0] as `0x${string}`,
          to: contractAddress as `0x${string}`,
          data: data,
          value: totalValue,
        });

        console.log("Transaction sent:", txResponse);

        // Wait for the transaction to be mined
        const txReceipt = await publicClient.waitForTransactionReceipt({
          hash: txResponse,
        });

        console.log("Transaction confirmed:", txReceipt);

        // Check if the transaction was successful
        if (txReceipt.status === "success") {
          console.log("Bounty created successfully!");
          return true;
        } else {
          console.log("Bounty creation failed:", txReceipt);
          return false;
        }
      } catch (error) {
        console.log("Transaction failed:", error);
        return false;
      }
    },
    [accounts, client, contractAddress, getContractInstance, publicClient]
  );

  const editBounty = useCallback(
    async (
      _bountyId: number,
      _cid: string,
      _deadline: number,
      _resultDeadline: number,
      _minParticipants: number,
      _totalWinners: number,
      _totalPrizes: number[]
    ) => {
      try {
        if (!client) {
          return;
        }

        const contract = await getContractInstance(contractAddress, client);
        const prizesInWei = _totalPrizes.map((prize) =>
          ethers.parseEther(String(prize))
        );

        const data = contract.interface.encodeFunctionData("editBounty", [
          _bountyId,
          _cid,
          _deadline,
          _resultDeadline,
          _minParticipants,
          _totalWinners,
          prizesInWei,
        ]);

        const totalPrizeValue = prizesInWei.reduce(
          (sum, prize) => sum + prize,
          BigInt(0)
        );

        const fee = (totalPrizeValue * BigInt(5)) / BigInt(100);
        const totalValue = totalPrizeValue + fee;

        // Send the transaction and get the hash
        const txResponse = await client.sendTransaction({
          account: accounts[0] as `0x${string}`,
          to: contractAddress as `0x${string}`,
          data: data,
          value: totalValue,
        });

        console.log("Edit bounty transaction sent:", txResponse);

        // Wait for the transaction to be mined
        const txReceipt = await publicClient.waitForTransactionReceipt({
          hash: txResponse,
        });

        console.log("Edit bounty transaction confirmed:", txReceipt);

        // Check if the transaction was successful
        if (txReceipt.status === "success") {
          console.log("Bounty edited successfully!");
          return true;
        } else {
          console.log("Bounty edit failed:", txReceipt);
          return false;
        }
      } catch (error) {
        console.log("Transaction failed:", error);
        return false;
      }
    },
    [accounts, client, contractAddress, getContractInstance, publicClient]
  );
  const getBountyDetailById = useCallback(
    async (id: number) => {
      try {
        const contract = await getContractInstanceWithRPCProvider();
        const bounty = await contract.getBounty(id);
        return bounty as IBounty;
      } catch (error) {
        console.log("Failed to fetch bounty details:", error);
        return null;
      }
    },
    [getContractInstanceWithRPCProvider]
  );

  const getBountySubmissionById = useCallback(
    async (id: number) => {
      try {
        const contract = await getContractInstanceWithRPCProvider();
        const bounty = await contract.getBountySubmissions(id);
        return bounty as IBountySubmission[];
      } catch (error) {
        console.log("Failed to fetch bounty details:", error);
        return null;
      }
    },
    [getContractInstanceWithRPCProvider]
  );

  const isParticipantOfBounty = useCallback(
    async (_bountyId: number | string, _address: string) => {
      try {
        const contract = await getContractInstanceWithRPCProvider();
        const isParticipant = contract.isParticipantOfBounty(
          _bountyId,
          _address
        );
        return isParticipant;
      } catch (error) {
        console.log("Failed to check if participant of bounty:", error);
        return false;
      }
    },
    [getContractInstanceWithRPCProvider]
  );

  const createSubmission = useCallback(
    async (_bountyId: number, _cid: string) => {
      try {
        if (!client) {
          return;
        }

        const contract = await getContractInstance(contractAddress, client);

        const data = contract.interface.encodeFunctionData("createSubmission", [
          _bountyId,
          _cid,
        ]);

        // Send the transaction and get the hash
        const txResponse = await client.sendTransaction({
          account: accounts[0] as `0x${string}`,
          to: contractAddress as `0x${string}`,
          data: data,
        });

        console.log("Transaction sent:", txResponse);

        const txReceipt = await publicClient.waitForTransactionReceipt({
          hash: txResponse,
        });

        console.log("Transaction confirmed:", txReceipt);

        if (txReceipt.status === "success") {
          console.log("Transaction successful!");
          return true;
        } else {
          console.log("Transaction failed:", txReceipt);
          return false;
        }
      } catch (error) {
        console.log("Transaction failed:", error);
        return false;
      }
    },
    [accounts, client, contractAddress, getContractInstance, publicClient]
  );

  const cancelBounty = useCallback(
    async (_bountyId: number) => {
      try {
        if (!client) {
          return;
        }

        const contract = await getContractInstance(contractAddress, client);

        const data = contract.interface.encodeFunctionData("cancelBounty", [
          _bountyId,
        ]);

        await client.sendTransaction({
          account: accounts[0] as `0x${string}`,
          to: contractAddress as `0x${string}`,
          data: data,
        });
        return true;
      } catch (error) {
        console.log("Transaction failed:", error);
        return false;
      }
    },
    [accounts, client, contractAddress, getContractInstance]
  );

  const selectWinners = useCallback(
    async (_bountyId: number, winners: string[]) => {
      try {
        if (!client) {
          return;
        }

        const contract = await getContractInstance(contractAddress, client);

        const data = contract.interface.encodeFunctionData("selectWinners", [
          _bountyId,
          winners,
        ]);

        // Send the transaction and get the hash
        const txResponse = await client.sendTransaction({
          account: accounts[0] as `0x${string}`,
          to: contractAddress as `0x${string}`,
          data: data,
        });

        console.log("Select winners transaction sent:", txResponse);

        // Wait for the transaction to be mined
        const txReceipt = await publicClient.waitForTransactionReceipt({
          hash: txResponse,
        });

        console.log("Select winners transaction confirmed:", txReceipt);

        // Check if the transaction was successful
        if (txReceipt.status === "success") {
          console.log("Winners selected successfully!");
          return true;
        } else {
          console.log("Selecting winners failed:", txReceipt);
          return false;
        }
      } catch (error) {
        console.log("Transaction failed:", error);
        return false;
      }
    },
    [accounts, client, contractAddress, getContractInstance, publicClient]
  );
  return {
    getSigner,
    getContractInstance,

    getUserBounties,
    getEthBalance,
    createBounty,
    getBountyDetailById,
    getBountySubmissionById,
    editBounty,
    createSubmission,
    isParticipantOfBounty,
    cancelBounty,
    selectWinners,
  };
};
