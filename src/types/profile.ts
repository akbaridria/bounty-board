export interface Profile {
  fullName: string | null;
  description: string | null;
  name: string | null;
  id: string;
  standard: string | null;
  interfaces: string[] | null;
  blockNumber: number | null;
  links:
    | {
        title: string;
        url: string;
      }[]
    | null;
  tags: string[] | null;
  backgroundImages:
    | {
        url: string;
        height: number;
        width: number;
        verified: boolean;
        error: boolean;
      }[]
    | null;
  profileImages:
    | {
        url: string;
        width: number;
        height: number;
        verified: boolean;
        error: boolean;
      }[]
    | null;
  avatars:
    | {
        url: string;
        fileType: string;
      }[]
    | null;
  isEOA: boolean;
}

export interface ProfileQueryResponse {
  profile: Profile | null;
}
