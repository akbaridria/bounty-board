import Avatar from "boring-avatars";
import { FlickeringGrid } from "./magicui/flickering-grid";
import useProfiles from "@/hooks/use-profiles";

const Header = () => {
  const { profile } = useProfiles();

  return (
    <div className="mb-4 sticky -top-28 z-10 bg-white">
      <div className="relative">
        <div className="h-48 bg-slate-100 rounded-bl-lg rounded-br-lg">
          <FlickeringGrid
            className="absolute inset-x-1 inset-y-2 z-0 size-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.5}
            flickerChance={0.1}
          />
        </div>
        <Avatar
          name={profile?.fullName || "boring-avatar"}
          variant="beam"
          className="absolute left-1/2 bottom-2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full bg-blue-400 flex items-center justify-center border-4 border-white"
        />
      </div>
      <div className="p-4 mt-6">
        <div className="mb-1 text-center font-bold">
          {profile?.fullName || "-"}
        </div>
        <div className="text-sm text-center text-muted-foreground max-w-md m-auto">
          {profile?.description || "No description available."}
        </div>
      </div>
    </div>
  );
};

export default Header;
