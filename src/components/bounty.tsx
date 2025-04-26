import { useState, useEffect } from "react";
import { intervalToDuration, addHours } from "date-fns";

const Bounty = () => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const targetTime = addHours(new Date(), 2);
    const now = new Date();

    if (now >= targetTime) {
      setTimeLeft("Time is up");
      return;
    }

    const duration = intervalToDuration({ start: now, end: targetTime });
    const days = duration.days ?? 0;
    const hours = duration.hours ?? 0;
    const minutes = duration.minutes ?? 0;
    const seconds = duration.seconds ?? 0;

    if (days > 0) {
      setTimeLeft(`${days} days left`);
    } else if (hours > 0) {
      setTimeLeft(`${hours} hours left`);
    } else if (minutes > 0) {
      setTimeLeft(`${minutes} minutes left`);
    } else {
      setTimeLeft(`${seconds} seconds left`);
    }
  }, []);

  return (
    <div className="border p-4 rounded-lg flex flex-col gap-2 hover:bg-accent transition-all">
      <div className="flex items-center justify-between gap-4">
        <div className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          Create Meme Create Meme Create Meme Create Meme Create Meme
        </div>
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {timeLeft}
        </div>
      </div>
      <div className="text-sm font-medium text-muted-foreground line-clamp-3">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
        euismod, sapien ut interdum finibus, est metus scelerisque felis, vel
        maximus justo dui non est. Aliquam lacinia vehicula purus, nec tristique
        ipsum ultrices vel. Nulla blandit, elit at rutrum tristique, velit risus
        rutrum lorem, eu tempor urna sapien sed lacus. Vestibulum ante ipsum
        primis in faucibus orci luctus et ultrices posuere cubilia curae;
        Quisque sit amet volutpat nunc. Fusce vel hendrerit turpis. Nam maximus
        imperdiet ex, eget luctus neque iaculis superfine.
      </div>
    </div>
  );
};

export default Bounty;
