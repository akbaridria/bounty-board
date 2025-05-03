import { useCallback } from "react";
import {
  BrowserProvider,
  Contract,
  ethers,
  formatEther,
  JsonRpcSigner,
} from "ethers";
import bountyBoardJson from "../json/bounty-board.json";
import { useUpProvider } from "../context/UpProvider";
import { config } from "@/config";
import { IBounty } from "./type";

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

  const getProvider = async (): Promise<BrowserProvider> => {
    if (!window.lukso) {
      throw new Error("Lukso provider is not available on window object.");
    }
    return new ethers.BrowserProvider(window.lukso);
  };

  const getSigner = useCallback(async (): Promise<JsonRpcSigner> => {
    const browserProvider = await getProvider();
    return browserProvider.getSigner();
  }, []);

  const getContractInstanceWithProvider =
    useCallback(async (): Promise<Contract> => {
      return new ethers.Contract(
        contractAddress,
        bountyBoardJson.abi,
        await getProvider()
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
        if (!client) {
          return;
        }
        const contract = await getContractInstanceWithProvider();
        const res = await contract.getUserBounties(creatorAddress);
        return (res || []) as number[];
      } catch (error) {
        console.error("Failed to fetch user bounties:", error);
        return [];
      }
    },
    [client, getContractInstanceWithProvider]
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

        await client.sendTransaction({
          account: accounts[0] as `0x${string}`,
          to: contractAddress as `0x${string}`,
          data: data,
          value: totalValue,
        });
        return true;
      } catch (error) {
        console.log("Transaction failed:", error);
        return false;
      }
    },
    [accounts, client, contractAddress, getContractInstance]
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

        await client.sendTransaction({
          account: accounts[0] as `0x${string}`,
          to: contractAddress as `0x${string}`,
          data: data,
          value: totalValue,
        });
        return true;
      } catch (error) {
        console.log("Transaction failed:", error);
        return false;
      }
    },
    [accounts, client, contractAddress, getContractInstance]
  );

  const getBountyDetailById = useCallback(
    async (id: number) => {
      try {
        const contract = await getContractInstanceWithProvider();
        const bounty = await contract.getBounty(id);
        return bounty as IBounty;
      } catch (error) {
        console.log("Failed to fetch bounty details:", error);
        return null;
      }
    },
    [getContractInstanceWithProvider]
  );

  const getBountySubmissionById = useCallback(
    async (id: number) => {
      try {
        const contract = await getContractInstanceWithProvider();
        const bounty = await contract.getBountySubmissions(id);
        return bounty;
      } catch (error) {
        console.log("Failed to fetch bounty details:", error);
        return null;
      }
    },
    [getContractInstanceWithProvider]
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
  };
};
