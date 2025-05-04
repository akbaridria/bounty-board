import { AwardIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { cn, getOrdinalParts } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { useParams } from "react-router-dom";
import { useSmartContract } from "@/hooks/useSmartContract";
import { useCallback, useEffect, useState } from "react";
import { IBountySubmission } from "@/hooks/type";
import Avatar from "boring-avatars";
import useProfiles from "@/hooks/use-profiles";
import { toast } from "sonner";

interface IAccountSubmissionProps {
  selected: boolean;
  data: IBountySubmission;
  callback: (name: string) => void;
}
const AccountSubmission: React.FC<IAccountSubmissionProps> = ({
  selected,
  data,
  callback,
}) => {
  const { profile } = useProfiles(data.participant.toLowerCase());
  return (
    <li
      className={cn(
        "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors",
        "hover:bg-muted/50",
        selected ? "bg-muted border-l-4 border-primary" : ""
      )}
      onClick={() => callback(profile?.fullName || "-")}
    >
      <Avatar
        name={profile?.fullName || "boring avatar"}
        variant="beam"
        className="w-8 h-8"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{profile?.fullName || "-"}</p>
        <p className="text-muted-foreground text-xs truncate">
          {data.participant}
        </p>
      </div>
    </li>
  );
};

interface IDialogSelectWinnersProps {
  totalWinners: number;
}

const DialogSelectWinners: React.FC<IDialogSelectWinnersProps> = ({
  totalWinners,
}) => {
  const { id } = useParams();
  const { getBountySubmissionById, selectWinners } = useSmartContract();
  const [ListSubmissions, setListSubmissions] = useState<IBountySubmission[]>(
    []
  );
  const [selectedWinners, setSelectedWinners] = useState<
    { participant: string; name: string }[]
  >([]);

  useEffect(() => {
    if (id) {
      (async () => {
        const bountySubmissions = await getBountySubmissionById(Number(id));
        setListSubmissions(bountySubmissions || []);
      })();
    }
  }, [getBountySubmissionById, id]);

  const handleSelectWiners = useCallback(() => {
    toast.promise(
      selectWinners(
        Number(id),
        selectedWinners.map((item) => item.participant)
      ),
      {
        loading: "Selecting winners...",
        success: () => {
          toast.success("Winners selected successfully");
          return "Winners selected successfully";
        },
        error: (err) => {
          console.error(err);
          return "Failed to select winners";
        },
      }
    );
  }, [id, selectWinners, selectedWinners]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <div className="flex items-center gap-2">
            <AwardIcon size={14} />
            <div>Select Winners</div>
          </div>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="w-[85%] max-w-[450px] !p-0 rounded-lg !gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Select Winners</DialogTitle>
          <DialogDescription className="mt-2">
            Choose winners for this bounty
          </DialogDescription>
          <div className="mt-4">
            {selectedWinners.map((winner, index) => (
              <div key={index + 1} className="flex items-center gap-2 mt-4">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                  <span>
                    {getOrdinalParts(index + 1).num}
                    <sup className="text-[0.6em] font-medium">
                      {getOrdinalParts(index + 1).suffix}
                    </sup>
                  </span>
                </div>
                <div>{winner.name}</div>
              </div>
            ))}
          </div>
        </DialogHeader>
        <ScrollArea className="p-2 max-h-[300px]">
          <ul>
            {ListSubmissions.map((submission: IBountySubmission, index) => (
              <AccountSubmission
                key={`${submission.cid}-${index}`}
                selected={selectedWinners.some(
                  (winner) => winner.participant === submission.participant
                )}
                data={submission}
                callback={(name: string) => {
                  setSelectedWinners((prev) => {
                    const isAlreadySelected = prev.some(
                      (winner) => winner.participant === submission.participant
                    );

                    if (isAlreadySelected) {
                      return prev.filter(
                        (winner) =>
                          winner.participant !== submission.participant
                      );
                    }

                    if (prev.length >= totalWinners) {
                      return prev;
                    }

                    return [
                      ...prev,
                      { participant: submission.participant, name: name },
                    ];
                  });
                }}
              />
            ))}
          </ul>
        </ScrollArea>
        <DialogFooter className="!p-2 border-t">
          <Button
            type="button"
            onClick={handleSelectWiners}
            disabled={totalWinners !== selectedWinners.length}
          >
            Select Winners
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSelectWinners;
