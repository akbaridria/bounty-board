"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSmartContract } from "@/hooks/useSmartContract";
import { useCallback } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

interface BountyAlertProps {
  isVisible: boolean;
}

const BountyAlert: React.FC<BountyAlertProps> = ({ isVisible }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cancelBounty } = useSmartContract();

  const handleCancelBounty = useCallback(() => {
    toast.promise(cancelBounty(Number(id)), {
      loading: "Cancelling bounty...",
      success: () => {
        toast.success("Bounty cancelled successfully");
        navigate("/", { replace: true });
        return "Bounty cancelled successfully";
      },
      error: (err) => {
        console.error(err);
        return "Failed to cancel bounty";
      },
    });
  }, [cancelBounty, id, navigate]);

  if (!isVisible) return null;

  return (
    <Alert
      variant="destructive"
      className="relative flex items-center border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-200"
    >
      <AlertCircle className="h-5 w-5" />
      <div className="ml-3 flex-1">
        <AlertTitle className="text-base font-medium">
          Low Participation Alert
        </AlertTitle>
        <AlertDescription className="mt-1 text-sm">
          This bounty has insufficient participants/submissions. You may want to
          extend the deadline or cancel it.
        </AlertDescription>
      </div>
      <Button
        variant="destructive"
        size="sm"
        className="whitespace-nowrap"
        onClick={handleCancelBounty}
      >
        Cancel Bounty
      </Button>
    </Alert>
  );
};

export default BountyAlert;
