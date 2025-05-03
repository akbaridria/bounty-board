import BackButton from "@/components/back-button";
import PageWrapper from "@/components/page-wrapper";
import Submission from "@/components/submission";
import TipTapEditor from "@/components/tiptap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSmartContract } from "@/hooks/useSmartContract";
import { getFileFromIPFS } from "@/lib/pinata";
import { formatUnixTimestampToRelativeTime } from "@/lib/utils";
import Avatar from "boring-avatars";
import { ethers } from "ethers";
import { TimerIcon, TrophyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import FormSubmission from "@/components/form-submission";

const BountyDetail = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<{
    title: string;
    content: string;
    relativeTime: string;
    totalPrize: string;
    editable?: boolean;
  }>({ content: "", relativeTime: "", title: "", totalPrize: "" });
  const { id } = useParams();

  const { getBountyDetailById } = useSmartContract();

  useEffect(() => {
    if (id) {
      (async () => {
        const res = await getBountyDetailById(Number(id));
        if (res) {
          const dataContent = await getFileFromIPFS(res.cid);
          setData({
            title: dataContent?.data?.title || "",
            content: dataContent?.data?.content || "",
            relativeTime: formatUnixTimestampToRelativeTime(
              Number(res.deadline)
            ),
            totalPrize: ethers.formatEther(
              res.prizes.reduce((sum, prize) => sum + prize, BigInt(0))
            ),
            editable: Number(res.bountyType) === 0,
          });
        }
      })();
    }
  }, [getBountyDetailById, id]);

  return (
    <PageWrapper>
      <div className="p-4">
        <BackButton />
        <div className="space-y-6">
          <div className="text-[1.5rem] font-bold">{data.title || "-"}</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                name="boring-avatar"
                variant="beam"
                className="w-10 h-10"
              />
              <div className="text-xl text-muted-foreground font-semibold">
                Akbar Idria
              </div>
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
            {data.editable && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="mb-4"
                onClick={() => navigate("/edit/" + id)}
              >
                <Button variant="outline" className="text-sm !h-8">
                  Edit
                </Button>
              </motion.button>
            )}
          </div>
          <TipTapEditor
            key={data.content}
            customContent={data.content || "loading..."}
            editable={false}
            maxHeight={9999}
          />
          <div className="space-y-6">
            <div className="text-lg font-semibold">Submissions</div>
            <div className="space-y-2">
              <FormSubmission />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, index) => (
                <Submission key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default BountyDetail;
