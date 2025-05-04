import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface BadgeStatusProps {
  deadline?: bigint;
  resultDeadline?: bigint;
}

type Status = "unknown" | "in-progress" | "in-review" | "completed";

const getStatus = (deadline: number, resultDeadline: number): Status => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (currentTimestamp < deadline) {
    return "in-progress";
  } else if (currentTimestamp < resultDeadline) {
    return "in-review";
  } else if (currentTimestamp > resultDeadline) {
    return "completed";
  }

  return "unknown";
};

const badgeStyles: Record<Status, { className: string; label: string }> = {
  unknown: {
    className: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    label: "Undefined",
  },
  "in-progress": {
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    label: "In Progress",
  },
  "in-review": {
    className: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    label: "In Review",
  },
  completed: {
    className: "bg-green-100 text-green-800 hover:bg-green-200",
    label: "Completed",
  },
};

const BadgeStatus: React.FC<BadgeStatusProps> = ({
  deadline,
  resultDeadline,
}) => {
  const status = getStatus(Number(deadline), Number(resultDeadline));

  return (
    <Badge className={cn(badgeStyles[status].className, "whitespace-nowrap")}>
      {badgeStyles[status].label}
    </Badge>
  );
};

export default BadgeStatus;
