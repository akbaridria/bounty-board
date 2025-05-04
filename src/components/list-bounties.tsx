import { useSmartContract } from "@/hooks/useSmartContract";
import Bounty from "./bounty";
import { useCallback, useEffect, useState } from "react";
import { useUpProvider } from "@/context/UpProvider";
import EmptyBounties from "./empty-bounties";
import { Button } from "./ui/button";
import { RotateCwIcon } from "lucide-react";

const ListBounties = () => {
  const { contextAccounts } = useUpProvider();
  const { getUserBounties } = useSmartContract();
  const [listBounties, setListBounties] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const getBounties = useCallback(async () => {
    setLoading(true);
    if (contextAccounts.length > 0) {
      const bounties = await getUserBounties(contextAccounts[0]);
      setListBounties(bounties || []);
    }
    setLoading(false);
  }, [contextAccounts, getUserBounties]);

  useEffect(() => {
    getBounties();
  }, [getBounties]);

  return (
    <>
      <div className="flex justify-end p-2">
        <Button onClick={getBounties} disabled={loading}>
          <div className="flex items-center gap-1">
            <RotateCwIcon className={loading ? "animate-spin" : ""} />
            <div>Refresh</div>
          </div>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 p-2">
        {listBounties.length === 0 && !loading && <EmptyBounties />}
        {listBounties.map((bountyId, index) => (
          <Bounty key={bountyId} index={index} bountyId={bountyId} />
        ))}
      </div>
    </>
  );
};

export default ListBounties;
