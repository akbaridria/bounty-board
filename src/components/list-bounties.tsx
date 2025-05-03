import { useSmartContract } from "@/hooks/useSmartContract";
import Bounty from "./bounty";
import { useEffect, useState } from "react";
import { useUpProvider } from "@/context/UpProvider";

const ListBounties = () => {
  const { contextAccounts } = useUpProvider();
  const { getUserBounties } = useSmartContract();
  const [listBounties, setListBounties] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      if (contextAccounts.length > 0) {
        const bounties = await getUserBounties(contextAccounts[0]);
        setListBounties(bounties || []);
      }
    })();
  }, [contextAccounts, getUserBounties]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
      {listBounties.map((bountyId, index) => (
        <Bounty key={bountyId} index={index} bountyId={bountyId} />
      ))}
    </div>
  );
};

export default ListBounties;
