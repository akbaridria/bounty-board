import { useUpProvider } from "@/context/UpProvider";
import { Profile, ProfileQueryResponse } from "@/types";
import { QUERY_PROFILE_BY_ADDRESS, queryUP } from "@/utils/query";
import Avatar from "boring-avatars";
import { useEffect, useState } from "react";

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
    <div>
      <div className="relative">
        <div className="aspect-[3/1] bg-slate-100 border-b-4 border-white rounded-bl-lg rounded-br-lg" />
        <Avatar
          name="boring-avatar"
          variant="beam"
          className="absolute left-1/2 bottom-2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center border-4 border-white"
        />
      </div>
      <div className="py-4 mt-4 text-center font-bold">{profile?.fullName}</div>
    </div>
  );
};

export default Header;
