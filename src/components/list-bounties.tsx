import { useSmartContract } from "@/hooks/useSmartContract";
import Bounty from "./bounty";
import { useEffect } from "react";
import { useUpProvider } from "@/context/UpProvider";

const ListBounties = () => {
  const { contextAccounts } = useUpProvider();
  const { getUserBounties } = useSmartContract();

  useEffect(() => {
    (async () => {
      if (contextAccounts.length > 0) {
        const bounties = await getUserBounties(contextAccounts[0]);
        console.log(bounties);
      }
    })();
  }, [contextAccounts, getUserBounties]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
      {Array.from({ length: 10 }, (_, index) => (
        <Bounty key={index} index={index} />
      ))}
    </div>
  );
};

export default ListBounties;
