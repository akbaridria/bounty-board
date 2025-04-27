import { useUpProvider } from "@/context/UpProvider";
import { Profile, ProfileQueryResponse } from "@/types";
import { QUERY_PROFILE_BY_ADDRESS, queryUP } from "@/utils/query";
import Avatar from "boring-avatars";
import { useEffect, useState } from "react";
import { FlickeringGrid } from "./magicui/flickering-grid";

const Header = () => {
  const { accounts } = useUpProvider();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // if (accounts.length > 0) {
    queryUP<ProfileQueryResponse>(QUERY_PROFILE_BY_ADDRESS, {
      id:
        accounts[0] ||
        "0x81524BEa776f425F571037927FC387120c04722A".toLowerCase(),
    }).then((res) => {
      setProfile(res?.profile);
    });
    // }
  }, [accounts]);

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
          name="boring-avatar"
          variant="beam"
          className="absolute left-1/2 bottom-2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full bg-blue-400 flex items-center justify-center border-4 border-white"
        />
      </div>
      <div className="p-4 mt-6">
        <div className="mb-1 text-center font-bold">{profile?.fullName || '-'}</div>
        <div className="text-sm text-center text-muted-foreground max-w-md m-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          convallis, arcu in tincidunt hendrerit.
        </div>
      </div>
    </div>
  );
};

export default Header;
