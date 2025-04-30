import BackButton from "@/components/back-button";
import PageWrapper from "@/components/page-wrapper";
import Submission from "@/components/submission";
import TipTapEditor from "@/components/tiptap";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Avatar from "boring-avatars";
import { LockIcon, LockOpenIcon, TimerIcon, TrophyIcon } from "lucide-react";

const isActive = true; // This should be replaced with actual logic to determine if the bounty is active

const BountyDetail = () => {
  return (
    <PageWrapper>
      <div className="p-4">
        <BackButton />
        <div className="space-y-6">
          <div className="text-[1.5rem] font-bold">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </div>
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
                <TimerIcon className="w-3 h-3" strokeWidth={2} />9 days left
              </Badge>
              <Badge className="text-xs flex items-center gap-1">
                <TrophyIcon className="w-3 h-3" strokeWidth={2} />
                10 LYX
              </Badge>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-xs flex items-center gap-1",
                isActive
                  ? "bg-green-100 border-green-600 text-green-800"
                  : "bg-red-100 border-red-600 text-red-800"
              )}
            >
              {isActive ? (
                <>
                  <LockOpenIcon className="w-3 h-3" />
                  <div>Open</div>
                </>
              ) : (
                <>
                  <LockIcon className="w-3 h-3" />
                  <div>Closed</div>
                </>
              )}
            </Badge>
          </div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>
          <div className="space-y-6">
            <div className="text-lg font-semibold">Submissions</div>
            <div className="space-y-2">
              <TipTapEditor
                maxHeight={200}
                customContent="<p>Write your submissions..</p>"
              />
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
