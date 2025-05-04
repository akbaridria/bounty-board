import { useSmartContract } from "@/hooks/useSmartContract";
import Bounty from "./bounty";
import { useEffect, useState } from "react";
import { useUpProvider } from "@/context/UpProvider";
import EmptyBounties from "./empty-bounties";

const ListBounties = () => {
  const { contextAccounts } = useUpProvider();
  const { getUserBounties } = useSmartContract();
  const [listBounties, setListBounties] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true)
      if (contextAccounts.length > 0) {
        const bounties = await getUserBounties(contextAccounts[0]);
        setListBounties(bounties || []);
      }
      setLoading(false);
    })();
  }, [contextAccounts, getUserBounties]);

  return (
    <div className="grid grid-cols-1 gap-4 p-2">
      {listBounties.length === 0 && !loading && <EmptyBounties />}
      {listBounties.map((bountyId, index) => (
        <Bounty key={bountyId} index={index} bountyId={bountyId} />
      ))}
    </div>
  );
};

export default ListBounties;
