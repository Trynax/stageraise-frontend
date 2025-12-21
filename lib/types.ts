export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  type: string;
  raised: number;
  goal: number;
  milestones: number;
  funders: number;
  communityVote: boolean;
  refundable: boolean;
  endDate: string;
  status: 'ongoing' | 'ended';
}

export interface Vote {
  id: string;
  title: string;
  description: string;
  image: string;
  milestone: number;
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  milestones: number;
  funders: number;
  communityVote: boolean;
  refundable: boolean;
  endDate: string;
  status: 'ongoing' | 'ended';
}
