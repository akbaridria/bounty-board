export interface IBounty {
  id: bigint;
  isActive: boolean;
  creator: string;
  cid: string;
  deadline: bigint;
  resultDeadline: bigint;
  minParticipants: bigint;
  totalWinners: bigint;
  prizes: bigint[];
  selectedWinners: bigint[];
  bountyType: bigint;
}
