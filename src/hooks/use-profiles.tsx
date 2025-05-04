import { useUpProvider } from "@/context/UpProvider";
import { Profile, ProfileQueryResponse } from "@/types";
import { QUERY_PROFILE_BY_ADDRESS, queryUP } from "@/utils/query";
import { useEffect, useState } from "react";

const useProfiles = (address = '') => {
  const { contextAccounts } = useUpProvider();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (contextAccounts.length > 0) {
      queryUP<ProfileQueryResponse>(QUERY_PROFILE_BY_ADDRESS, {
        id: (address || contextAccounts[0])?.toLowerCase(),
      }).then((res) => {
        console.log(res);
        setProfile(res?.profile);
      });
    }
    setLoading(false);
  }, [contextAccounts, address]);

  return {
    loading,
    profile,
  };
};

export default useProfiles;
