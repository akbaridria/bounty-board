import Header from "@/components/header";
import ListBounties from "@/components/list-bounties";
import PageWrapper from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import WalletNotConnected from "@/components/wallet-not-connected";
import { useUpProvider } from "@/context/UpProvider";
import { PlusIcon } from "lucide-react";
import { motion } from "motion/react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function App() {
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

  if (!walletConnected)
    return (
      <div className="flex h-screen w-screen items-center justify-center p-4">
        <WalletNotConnected />
      </div>
    );

  return (
    <PageWrapper>
      <Header />
      <ListBounties />
      <div className="fixed bottom-4 right-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => goToCreateBounty()}
        >
          <Button size="icon" className="rounded-full">
            <PlusIcon />
          </Button>
        </motion.button>
      </div>
    </PageWrapper>
  );
}

export default App;
