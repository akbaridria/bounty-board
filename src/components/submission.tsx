import Avatar from "boring-avatars";
import TipTapEditor from "./tiptap";
import { IBountySubmission } from "@/hooks/type";
import { useEffect, useState } from "react";
import { getFileFromIPFS } from "@/lib/pinata";
import { format, fromUnixTime } from "date-fns";
import useProfiles from "@/hooks/use-profiles";

interface SubmissionProps {
  data: IBountySubmission;
}

interface SubmissionData {
  timestamp: string;
  content: string;
}

const Submission: React.FC<SubmissionProps> = ({ data }) => {
  const [submission, setSubmission] = useState<SubmissionData>({
    timestamp: "-",
    content: "no content available",
  });

  const { profile } = useProfiles(data.participant);

  useEffect(() => {
    if (data) {
      (async () => {
        const dataContent = await getFileFromIPFS(data.cid);
        if (dataContent) {
          setSubmission((prev) => ({
            ...prev,
            content: dataContent.data.content || "no content available",
            timestamp:
              format(fromUnixTime(Number(data.timestamp)), "dd MMM yyyy") ||
              "-",
          }));
        }
      })();
    }
  }, [data]);

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div className="flex items-center gap-2">
        <Avatar
          name={profile?.fullName || "boring avatar"}
          variant="beam"
          className="w-10 h-10"
        />
        <div>
          <div className="text-sm font-semibold">
            {profile?.fullName || "-"}
          </div>
          <div className="text-xs text-muted-foreground">
            {submission?.timestamp}
          </div>
        </div>
      </div>
      <TipTapEditor
        key={submission?.content}
        customContent={submission?.content || "no content available"}
        editable={false}
        maxHeight={300}
      />
    </div>
  );
};

export default Submission;
