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

export interface IBountySubmission {
  cid: string;
  participant: string;
  timestamp: bigint;
}
