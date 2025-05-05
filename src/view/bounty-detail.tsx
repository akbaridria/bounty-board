import BackButton from "@/components/back-button";
import PageWrapper from "@/components/page-wrapper";
import TipTapEditor from "@/components/tiptap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSmartContract } from "@/hooks/useSmartContract";
import { getFileFromIPFS } from "@/lib/pinata";
import { getLatstDeadline } from "@/lib/utils";
import Avatar from "boring-avatars";
import { ethers } from "ethers";
import { Edit3Icon, EllipsisIcon, TimerIcon, TrophyIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import FormSubmission from "@/components/form-submission";
import FullLoader from "@/components/full-loader";
import useProfiles from "@/hooks/use-profiles";
import { useUpProvider } from "@/context/UpProvider";
import ListSubmissions from "@/components/list-submissions";
import BadgeStatus from "@/components/badge-status";
import BountyAlert from "@/components/bounty-alert-cancel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DialogSelectWinners from "@/components/dialog-select-winners";

const BountyDetail = () => {
  const navigate = useNavigate();
  const { contextAccounts, accounts } = useUpProvider();
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const [data, setData] = useState<{
    title: string;
    content: string;
    relativeTime: string;
    totalPrize: string;
    deadline?: bigint;
    resultDeadline?: bigint;
    editable?: boolean;
    isActive: boolean;
    totalwinners?: number;
  }>({
    content: "",
    relativeTime: "",
    title: "",
    totalPrize: "",
    isActive: false,
  });
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isParticipant, setIsParticipant] = useState(true);

  const { getBountyDetailById, isParticipantOfBounty } = useSmartContract();
  const { profile } = useProfiles();

  useEffect(() => {
    if (data?.resultDeadline) {
      const currentTime = Math.floor(Date.now() / 1000);
      setIsAlertVisible(data?.isActive && currentTime > Number(data.deadline));
    }
  }, [data]);

  const getParticipantOfBounty = useCallback(async () => {
    const res = await isParticipantOfBounty(
      Number(id),
      accounts[0] as `0x${string}`
    );
    setIsParticipant(res);
  }, [accounts, id, isParticipantOfBounty]);

  useEffect(() => {
    if (accounts?.[0]) {
      getParticipantOfBounty();
    }
  }, [accounts, getParticipantOfBounty, id]);

  const isSubmissionAllowed = useMemo(() => {
    if (contextAccounts?.[0] && accounts?.[0])
      return (
        contextAccounts[0]?.toLowerCase() !== accounts[0]?.toLowerCase() &&
        data.isActive
      );
    return false;
  }, [contextAccounts, accounts, data.isActive]);

  const getBountyDetail = useCallback(async () => {
    setLoading(true);
    const res = await getBountyDetailById(Number(id));
    if (res) {
      const dataContent = await getFileFromIPFS(res.cid);
      setData({
        isActive: res.isActive,
        title: dataContent?.data?.title || "",
        content: dataContent?.data?.content || "",
        relativeTime: getLatstDeadline(
          Number(res.deadline),
          Number(res.resultDeadline)
        ),
        totalPrize: ethers.formatEther(
          res.prizes.reduce((sum, prize) => sum + prize, BigInt(0))
        ),
        editable:
          Number(res.bountyType) === 0 &&
          res.creator?.toLowerCase() === accounts?.[0]?.toLowerCase() &&
          res.isActive,
        deadline: res.deadline,
        resultDeadline: res.resultDeadline,
        totalwinners: Number(res.totalWinners),
      });
    }
    setLoading(false);
  }, [accounts, getBountyDetailById, id]);

  useEffect(() => {
    if (id) {
      getBountyDetail();
    }
  }, [getBountyDetail, id]);

  const isInReview = useMemo(() => {
    if (data?.resultDeadline) {
      const currentTime = Math.floor(Date.now() / 1000);
      return (
        data?.isActive &&
        currentTime > Number(data.resultDeadline) &&
        currentTime < Number(data.deadline)
      );
    }
    return false;
  }, [data]);

  if (loading) return <FullLoader />;

  return (
    <PageWrapper>
      <BountyAlert isVisible={isAlertVisible} />
      <div className="p-4">
        <BackButton />
        <div className="space-y-4">
          <div className="text-[1.5rem] font-bold">{data.title || "-"}</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                name={profile?.fullName || "boring-avatar"}
                variant="beam"
                className="w-10 h-10"
              />
              <div className="text-lg text-muted-foreground font-semibold">
                {profile?.fullName || "-"}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {(data.editable || isInReview) && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="mb-4"
                    onClick={() => navigate("/edit/" + id)}
                  >
                    <Button variant="ghost" size="icon">
                      <EllipsisIcon />
                    </Button>
                  </motion.button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {data.editable && (
                  <DropdownMenuItem onClick={() => navigate("/edit/" + id)}>
                    <div className="flex items-center gap-2">
                      <Edit3Icon size={14} />
                      <div>Edit</div>
                    </div>
                  </DropdownMenuItem>
                )}
                {isInReview && (
                  <DialogSelectWinners totalWinners={data.totalwinners || -1} />
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <BadgeStatus
              deadline={data.deadline}
              resultDeadline={data.resultDeadline}
            />
            <Badge
              variant="outline"
              className="bg-muted text-muted-foreground text-xs flex items-center gap-1"
            >
              <TimerIcon className="w-3 h-3" strokeWidth={2} />
              {data.relativeTime}
            </Badge>
            <Badge className="text-xs flex items-center gap-1">
              <TrophyIcon className="w-3 h-3" strokeWidth={2} />
              {data.totalPrize} LYX
            </Badge>
          </div>
          <div className="border rounded-md p-4">
            <TipTapEditor
              key={data.content}
              customContent={data.content || "loading..."}
              editable={false}
              maxHeight={9999}
            />
          </div>
          <div className="space-y-6">
            <div className="text-lg font-semibold">Submissions</div>
            <div className="space-y-2">
              {isSubmissionAllowed && !isParticipant && (
                <FormSubmission
                  callback={() => {
                    getBountyDetail();
                    getParticipantOfBounty();
                  }}
                />
              )}
            </div>
            <div className="space-y-3">
              <ListSubmissions />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default BountyDetail;
