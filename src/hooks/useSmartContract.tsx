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

export const useSmartContract = () => {
  const { client, accounts } = useUpProvider();
  const contractAddress: `0x${string}` = config.CONTRACT_ADDRESS;
  {
    /**
       In order to send a transaction using `up-provider`, we need to target a specific function of the smart contract,
       In this case, the target is the `mint` function. The process involves encoding the required parameters for the
       function in the correct order and then sending the encoded data as part of the transaction.
      
       @params {string} contractAddress - The address of the smart contract we want to interact with.
       @params mintArgs - The arguments for the `mint` function, encoded in the proper format:
         - `contextAccounts[0]` {string}: The recipient address for the minted tokens.
         - `ethers.parseUnits(amount.toString(), "wei")` {BigNumber}: The amount to be minted, converted into the smallest
           unit (e.g., wei or equivalent).
         - `false` {boolean}: A flag indicating whether the recipient should be notified (default is false).
         - `"0x"` {string}: Optional data field, typically used for extra information (default is an empty hex string).
      
       @example
       Here's how we encode the data for the `mint` function and send the transaction:
      
       // Step 1: Encode the function data
       const data = contract.interface.encodeFunctionData("mint", [
         contextAccounts[0],
         ethers.parseUnits(amount.toString(), "wei"),
         false,
         "0x"
       ]);
            
       // Step 2: Send the transaction using the UP provider

       const txResponse = await client.sendTransaction({
         account: contextAccounts[0] as `0x${string}`, // Sender account, msg.sender
         to: contractAddress as `0x${string}`,         // Target smart contract address
         data: data,                                  // Encoded function data
       });
            
       @returns {Promise<void>} Logs the transaction response or throws an error if the transaction fails.
      */
  }

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
        if (!client || !accounts?.[0]) {
          return;
        }

        const contract = await getContractInstance(contractAddress, client);
        const data = contract.interface.encodeFunctionData("getUserBounties", [
          creatorAddress,
        ]);

        const result = await client.request({
          method: "eth_call",
          params: [
            {
              to: contractAddress,
              data: data,
            },
            "latest",
          ],
        });

        // Decode the result
        return contract.interface.decodeFunctionResult(
          "getUserBounties",
          result
        )[0];
      } catch (error) {
        console.error("Failed to fetch user bounties:", error);
      }
    },
    [client, accounts, contractAddress, getContractInstance]
  );

  // const executeFunctionWithUProvider = useCallback(async () => {
  //   try {
  //     if (!client) {
  //       return;
  //     }

  //     const contract = await getContractInstance(contractAddress, client);
  //     const data: string = contract.interface.encodeFunctionData("")

  //     const txResponse = await client.sendTransaction({
  //       account: accounts[0] as `0x${string}`,
  //       to: contractAddress as `0x${string}`,
  //       data: data,
  //     });
  //     return txResponse;
  //   } catch (error) {
  //     console.error("Transaction failed:", error);
  //     return;
  //   }
  // }, [client, chainId, getContractInstance, accounts]);

  {
    /**
   This is the method to interact with the smart contract using ethers.js. While this approach is valid,
   we recommend using the `up-provider` for interacting with the blockchain whenever possible.
  
   Why use `up-provider`?
   - Simplified integration with the Universal Profile ecosystem.
   - Enhanced security by leveraging the UP infrastructure.

   With `up-provider`, the interaction is abstracted, reducing complexity and potential errors.
   */
  }

  // const executeFunction = useCallback(
  //   async (contractAddress: string, functionName: string, params: any[]) => {
  //     try {
  //       const signer = await getSigner();
  //       const contract = await getContractInstance(contractAddress, signer);
  //       const tx = await contract[functionName](...params);
  //       await tx.wait();
  //       return tx;
  //     } catch (error) {
  //       console.error("Transaction failed:", error);
  //       return;
  //     }
  //   },
  //   [getSigner, getContractInstance]
  // );

  return {
    // executeFunction,
    // executeFunctionWithUProvider,
    getSigner,
    getContractInstance,

    getUserBounties,
    getEthBalance,
  };
};
