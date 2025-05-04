import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { cn, getLatstDeadline } from "@/lib/utils";
import { InboxIcon, LockIcon, LockOpenIcon, TrophyIcon } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useSmartContract } from "@/hooks/useSmartContract";
import { getFileFromIPFS } from "@/lib/pinata";
import TipTapEditor from "./tiptap";
import { ethers } from "ethers";
import { Skeleton } from "./ui/skeleton";
import BadgeStatus from "./badge-status";

type BountyProps = {
  index: number;
  bountyId?: number;
};

const Bounty: React.FC<BountyProps> = ({ index, bountyId }) => {
  const [data, setData] = useState<{
    title: string;
    content: string;
    relativeTime: string;
    totalPrize: string;
    totalSubmissions?: number;
    editable?: boolean;
    deadline?: bigint;
    resultDeadline?: bigint;
  }>({
    title: "",
    content: "",
    relativeTime: "",
    totalPrize: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { getBountyDetailById, getBountySubmissionById } = useSmartContract();

  useEffect(() => {
    if (typeof bountyId !== "undefined") {
      (async () => {
        setLoading(true);
        const res = await getBountyDetailById(bountyId);
        if (res) {
          const dataContent = await getFileFromIPFS(res.cid);
          const dataSubmissions = await getBountySubmissionById(bountyId);
          setData({
            title: dataContent?.data?.title || "",
            content: dataContent?.data?.content || "",
            relativeTime: getLatstDeadline(Number(res.deadline), Number(res.resultDeadline)),
            totalPrize: ethers.formatEther(
              res.prizes.reduce((sum, prize) => sum + prize, BigInt(0))
            ),
            editable: Number(res.bountyType) === 0,
            totalSubmissions: dataSubmissions?.length,
            deadline: res.deadline,
            resultDeadline: res.resultDeadline,
          });
        }
        setLoading(false);
      })();
    }
  }, [bountyId, getBountyDetailById, getBountySubmissionById]);

  if (loading) return <Skeleton className="w-full h-48" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.2, duration: 0.5 },
      }}
      whileTap={{ scale: 0.98 }}
      className="border rounded-lg flex flex-col gap-2 cursor-pointer"
      onClick={() => navigate("/bounty/" + bountyId)}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-2 border-b">
        <div className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          {data.title}
        </div>
        <div className="flex items-center gap-2">
          <BadgeStatus resultDeadline={data?.resultDeadline} deadline={data?.deadline} />
          <Badge
            variant="outline"
            className={cn(
              "text-xs flex items-center gap-1",
              data.editable
                ? "bg-green-100 border-green-600 text-green-800"
                : "bg-yellow-100 border-yellow-600 text-yellow-800"
            )}
          >
            {data.editable ? (
              <LockOpenIcon className="w-3 h-3" />
            ) : (
              <LockIcon className="w-3 h-3" />
            )}
          </Badge>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {data.relativeTime}
          </span>
        </div>
      </div>
      <div className="text-sm font-medium text-muted-foreground px-4 py-2">
        <TipTapEditor
          key={data.content}
          customContent={data.content || "loading..."}
          editable={false}
          maxHeight={200}
        />
      </div>
      <div className="flex items-center justify-between border-t px-4 py-2">
        <div className="border px-2 py-1 rounded-lg bg-muted text-xs font-medium flex items-center gap-1">
          <InboxIcon className="w-4 h-4" />
          {data.totalSubmissions} Submissions
        </div>
        <div className="flex items-center gap-1">
          <TrophyIcon
            className="w-4 h-4 text-yellow-500"
            fill="yellow"
            strokeWidth={2}
          />
          <span className="text-sm font-semibold text-muted-foreground">
            {data.totalPrize} LYX
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Bounty;
