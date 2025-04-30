import Avatar from "boring-avatars";
import TipTapEditor from "./tiptap";

const Submission = () => {
  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div className="flex items-center gap-2">
        <Avatar name="boring-avatar" variant="beam" className="w-10 h-10" />
        <div>
          <div className="text-sm font-semibold">Username here</div>
          <div className="text-xs text-muted-foreground">22 Jan 2025</div>
        </div>
      </div>
      <TipTapEditor editable={false} maxHeight={300} />
    </div>
  );
};

export default Submission;
