"use client";

import { Button } from "@/components/ui/button";
import { useUpProvider } from "@/context/UpProvider";
import { ArchiveXIcon } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EmptyBounties = () => {
  const navigate = useNavigate();
  const { accounts, contextAccounts, walletConnected } = useUpProvider();

  const goToCreateBounty = useCallback(() => {
    if (!walletConnected) {
      toast.error("Please connect your wallet");
      return;
    }
    if (contextAccounts?.[0] && accounts?.[0]) {
      if (contextAccounts[0]?.toLowerCase() === accounts[0]?.toLowerCase()) {
        navigate("/create-bounty");
      } else {
        toast.error("You are not the owner of this boar", {
          description: "Embed this mini app to your profile to create bounties",
        });
      }
    }
  }, [accounts, contextAccounts, navigate, walletConnected]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <ArchiveXIcon className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="mt-2 text-lg font-semibold">No Bounties Found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          You haven't created any bounties yet. Start by creating your first
          bounty.
        </p>
        <div className="mt-6">
          <Button onClick={goToCreateBounty}>Create Bounty</Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyBounties;
