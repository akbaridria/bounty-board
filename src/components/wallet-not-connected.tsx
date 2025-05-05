"use client";

import { UnplugIcon } from "lucide-react";

const WalletNotConnected = () => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <UnplugIcon className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="mt-2 text-lg font-semibold">Wallet Not Connected</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Please connect your wallet for better user experience. You can create
          bounties, view your profile, and more.
        </p>
      </div>
    </div>
  );
};

export default WalletNotConnected;
