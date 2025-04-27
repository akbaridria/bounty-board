import { useState, useEffect } from "react";
import { formatDistance, addHours } from "date-fns";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { TrophyIcon } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

type BountyProps = {
  index: number;
};

const Bounty: React.FC<BountyProps> = ({ index }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isActive] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const targetTime = addHours(new Date(), 2);
    const now = new Date();

    if (now >= targetTime) {
      setTimeLeft("");
      return;
    }

    const formattedDistance = formatDistance(now, targetTime, {
      addSuffix: false,
    });
    setTimeLeft(`${formattedDistance} left`);
  }, []);

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
      onClick={() => navigate("/bounty")}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-2 border-b">
        <div className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          Create Meme Create Meme Create Meme Create Meme Create Meme
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {isActive ? "Open" : "Closed"}
          </Badge>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {timeLeft}
          </span>
        </div>
      </div>
      <div className="text-sm font-medium text-muted-foreground px-4 py-2">
        this is the content of the bounty.
      </div>
      <div className="flex items-center justify-between border-t px-4 py-2">
        <div className="border px-4 py-1 rounded-lg bg-muted text-xs font-medium">
          14 Submissions
        </div>
        <div className="flex items-center gap-1">
          <TrophyIcon
            className="w-4 h-4 text-yellow-500"
            fill="yellow"
            strokeWidth={2}
          />
          <span className="text-sm font-semibold text-muted-foreground">
            0.5 ETH
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Bounty;
