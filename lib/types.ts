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
  startDate: string;
  endDate: string;
  status: 'ongoing' | 'ended';
}

export interface Vote {
  id: string;
  projectId?: number;
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
  result?: 'passed' | 'failed' | 'ongoing';
  startDate: string;
  endDate: string;
  status: 'ongoing' | 'ended';
}
