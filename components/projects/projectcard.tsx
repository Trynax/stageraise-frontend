'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface ProjectCardProps {
  project: ProjectCardData; // Allow both mock and real project types
  variant?: 'default' | 'created' | 'contribution'; // Dashboard variants
}

interface ProjectCardData {
  id?: string | number;
  projectId?: string | number;
  title?: string;
  name?: string;
  description?: string;
  detailedDescription?: string;
  image?: string;
  coverImageUrl?: string | null;
  logoUrl?: string | null;
  raised?: number | string;
  cachedRaisedAmount?: number | string | null;
  goal?: number | string;
  fundingTarget?: number | string;
  targetAmount?: number | string;
  funders?: number | string;
  cachedTotalContributors?: number | string | null;
  endDate?: string;
  fundingEnd?: string;
  fundingDeadline?: string;
  deadline?: string;
  startDate?: string;
  fundingStart?: string;
  fundingStartDate?: string;
  createdAt?: string;
  status?: string;
  cachedIsActive?: boolean;
  milestones?: unknown[] | number;
  totalMilestones?: number;
  type?: string;
  currentMilestone?: number;
  displayStatus?: string;
  milestoneStatus?: string;
  hasActiveVoting?: boolean;
  activeVotingStage?: number;
  userHasVoted?: boolean;
  userVotedYes?: boolean;
  userContribution?: number;
  isRefundEligible?: boolean;
  statusMessage?: string;
  communityVote?: boolean;
  refundable?: boolean;
}

export default function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  const [now, setNow] = useState(() => Date.now());

  const toNumber = (value: string | number | null | undefined, fallback = 0) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return fallback;
  };

  // Handle both mock data format and database format
  // Use projectId (numeric, for contract) for URL routing, not database UUID
  const projectId = project.projectId ?? project.id ?? '';
  const title = project.title || project.name || 'Untitled Project';
  const description = project.description || project.detailedDescription || '';
  const image = project.image || project.coverImageUrl || project.logoUrl || '/placeholder.jpg';
  const raised = toNumber(project.raised, toNumber(project.cachedRaisedAmount));
  const goal = toNumber(project.goal, toNumber(project.fundingTarget, toNumber(project.targetAmount)));
  const funders = toNumber(project.funders, toNumber(project.cachedTotalContributors));
  const startDate = useMemo(() => {
    return project.startDate || project.fundingStart || project.fundingStartDate || project.createdAt || null;
  }, [project.startDate, project.fundingStart, project.fundingStartDate, project.createdAt]);
  // Memoize endDate to prevent infinite loop - use fundingDeadline from database
  const endDate = useMemo(() => {
    return project.endDate || project.fundingEnd || project.fundingDeadline || project.deadline || null;
  }, [project.endDate, project.fundingEnd, project.fundingDeadline, project.deadline]);
  const milestoneCount = Array.isArray(project.milestones)
    ? project.milestones.length
    : toNumber(project.totalMilestones, toNumber(project.milestones as number | undefined));
  const type = project.type || (milestoneCount > 0 ? 'Milestone Based' : 'Regular');

  // Dashboard-specific fields
  const currentMilestone = project.currentMilestone || 0;
  const displayStatus = project.displayStatus || 'funding';
  const milestoneStatus = project.milestoneStatus;
  const hasActiveVoting = project.hasActiveVoting;
  const activeVotingStage =
    typeof project.activeVotingStage === 'number' && Number.isFinite(project.activeVotingStage)
      ? project.activeVotingStage
      : (typeof currentMilestone === 'number' && currentMilestone > 0 ? currentMilestone : null);
  const userHasVoted = Boolean(project.userHasVoted);
  const userVotedYes = typeof project.userVotedYes === 'boolean' ? project.userVotedYes : null;
  const userContribution = project.userContribution;
  const isRefundEligible = project.isRefundEligible;
  const statusMessage = project.statusMessage;
  const votingDetailHref = activeVotingStage
    ? `/votes/${projectId}-${activeVotingStage}?from=dashboard`
    : `/projects/${projectId}?tab=voting`;

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fundingStartTimestamp = startDate ? +new Date(startDate) : Number.NaN;
  const fundingEndTimestamp = endDate ? +new Date(endDate) : Number.NaN;
  const hasFundingStart = Number.isFinite(fundingStartTimestamp);
  const hasFundingEnd = Number.isFinite(fundingEndTimestamp);
  const isFundingNotStarted = hasFundingStart && now < fundingStartTimestamp;
  const countdownTarget = isFundingNotStarted
    ? fundingStartTimestamp
    : hasFundingEnd
      ? fundingEndTimestamp
      : Number.NaN;
  const countdownDifference = Number.isFinite(countdownTarget)
    ? Math.max(0, countdownTarget - now)
    : 0;
  const timeLeft = {
    days: Math.floor(countdownDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((countdownDifference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((countdownDifference / 1000 / 60) % 60),
    seconds: Math.floor((countdownDifference / 1000) % 60)
  };
  const hasCountdown = timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0;
  const displayDate = isFundingNotStarted ? startDate : endDate;

  const percentage = goal > 0 ? (raised / goal) * 100 : 0;

  return (
    <Link href={`/projects/${projectId}`} className="p-1 block">
      <div className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-dark p-2 relative hover:scale-102 transition-transform duration-300 flex flex-col">
        <div className="relative">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover rounded-2xl"
          />
          {isFundingNotStarted && (
            <div className="absolute top-3 right-3 bg-[#DC6803] text-white px-3 py-1 rounded-full text-xs font-semibold border border-dark">
              Upcoming
            </div>
          )}
          {type === 'Milestone Based' && (
            <div className="absolute top-18 left-0 bg-linear-to-br from-deepGreen to-deepGreen text-secondary px-18 py-1 transform -rotate-35 origin-top-left -translate-x-10 translate-y-10 shadow-lg">
              <span className="text-sm font-semibold">{type}</span>
            </div>
          )}
        </div>

        <div className="p-2 flex flex-col flex-grow">
   
          <h2 className="text-2xl font-bold mb-2 line-clamp-1">{title}</h2>
          <p className="text-gray-700 mb-4 leading-relaxed line-clamp-2 text-sm">
            {description}
          </p>

          <div className="mb-4">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
              <div 
                className="h-full bg-linear-to-r from-green-400 to-green-500 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-base font-bold">${raised.toLocaleString()} raised</span>
            <span className="text-base font-semibold text-gray-600">${goal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between mb-4 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="font-semibold">{milestoneCount} Step Milestone</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
              </div>
              <span className="font-semibold">{funders} Funders</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2 mb-4">
            {project.communityVote && (
              <button className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 border-2 border-gray-800 rounded-full hover:bg-gray-50 transition-colors text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                </svg>
                <span className="font-semibold">Community vote</span>
              </button>
            )}
            {project.refundable && (
              <button className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 border-2 border-gray-800 rounded-full hover:bg-gray-50 transition-colors text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">Refundable</span>
              </button>
            )}
          </div>

          {/* Dashboard variant: Contribution info */}
          {variant === 'contribution' && userContribution !== undefined && (
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Your Contribution</span>
                <span className="font-bold">{userContribution.toLocaleString()} BUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Refund Eligible</span>
                <span className="font-bold">{isRefundEligible ? 'Yes' : 'NO'}</span>
              </div>
              {milestoneStatus && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Milestone</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                    displayStatus === 'completed'
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : displayStatus === 'failed'
                      ? 'bg-red-100 text-red-700 border-red-300'
                      : displayStatus === 'in_progress'
                      ? 'bg-[#DC6803]/10 text-[#DC6803] border-[#DC6803]'
                      : displayStatus === 'voting'
                      ? 'bg-orange-100 text-orange-700 border-orange-300'
                      : 'bg-secondary text-dark border-dark'
                  }`}>
                    {milestoneStatus}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Dashboard variant: Voting buttons for contribution */}
          {variant === 'contribution' && hasActiveVoting && !userHasVoted && (
            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-2">
                Vote on this milestone to help decide if funds should be released for next milestone
              </p>
              <div className="flex gap-2">
                <Link href={`/projects/${projectId}?tab=voting&vote=yes`} className="flex-1">
                  <button className="w-full py-2 border-2 border-green-500 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors">
                    Yes
                  </button>
                </Link>
                <Link href={`/projects/${projectId}?tab=voting&vote=no`} className="flex-1">
                  <button className="w-full py-2 border-2 border-red-500 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors">
                    No
                  </button>
                </Link>
              </div>
            </div>
          )}

          {variant === 'contribution' && hasActiveVoting && userHasVoted && (
            <div className="mb-4 border border-dark rounded-xl p-3">
              <p className="text-xs">
                {`You already voted ${userVotedYes ? 'YES' : 'NO'} on this milestone.`}
              </p>
            </div>
          )}

          {/* Dashboard variant: Status message */}
          {(variant === 'contribution' || variant === 'created') && statusMessage && !hasActiveVoting && (
            <div className=" border border-dark rounded-xl p-3 mb-4">
              <p className="text-xs ">{statusMessage}</p>
            </div>
          )}

         
          {variant === 'contribution' && isRefundEligible && (
            <div className="mb-4">
              <Link href={`/projects/${projectId}?action=refund`}>
                <button className="w-full py-1 bg-red-100 border-2 border-red-300 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-colors">
                  Request for Refund
                </button>
              </Link>
            </div>
          )}

   
          {variant === 'created' && (
            <div className="mt-auto">
              {milestoneStatus && (
                <div className="mb-2">
                  <span className={`block w-full text-center px-3 py-1 rounded-xl text-xs font-semibold border ${
                    displayStatus === 'completed'
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : displayStatus === 'failed'
                      ? 'bg-red-100 text-red-700 border-red-300'
                      : displayStatus === 'in_progress'
                      ? 'bg-[#DC6803]/10 text-[#DC6803] border-[#DC6803]'
                      : displayStatus === 'voting'
                      ? 'bg-orange-100 text-orange-700 border-orange-300'
                      : 'bg-secondary text-dark border-dark'
                  }`}>
                    {milestoneStatus}
                  </span>
                </div>
              )}
              {hasActiveVoting && (
                <div className="mb-2">
                  <span className="block w-full text-center px-3 py-1 rounded-xl text-xs font-semibold bg-orange-100 text-orange-300 border border-orange-300">
                    Ongoing Voting
                  </span>
                </div>
              )}
              {displayStatus === 'failed' && (
                <div className="mb-2">
                  <span className="block w-full text-center px-3 py-1 rounded-xl text-xs font-semibold bg-red-100 text-red-700 border border-red-300">
                    Project Failed
                  </span>
                </div>
              )}
            </div>
          )}

          {variant === 'default' && (
            <div className="text-center mb-4 mt-auto">
              {hasCountdown ? (
                <>
                  <p className="text-gray-600 text-xs mb-1">{isFundingNotStarted ? 'Funding starts in' : 'Funding ends in'}</p>
                  <p className="text-base font-semibold">
                    {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}sec
                  </p>
                </>
              ) : (
                <>
                  <p className="text-dark text-xs mb-1 font-semibold">{isFundingNotStarted ? 'Funding Not Started' : 'Funding Ended'}</p>
                  <p className="text-base font-semibold text-dark">
                    {displayDate ? new Date(displayDate).toLocaleDateString() : 'N/A'}
                  </p>
                </>
              )}
            </div>
          )}

     
          {variant === 'created' && displayStatus === 'funding' && hasCountdown && (
            <div className="text-center mb-4">
              <p className="text-gray-600 text-xs mb-1">{isFundingNotStarted ? 'Funding starts in' : 'Funding ends in'}</p>
              <p className="text-base font-semibold">
                {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}sec
              </p>
            </div>
          )}

          {/* Action buttons based on variant */}
          {variant === 'contribution' && hasActiveVoting ? (
            <div className="flex gap-2 mt-auto">
              <Link href={votingDetailHref} className="flex-1">
                <button className="w-full bg-white font-semibold text-dark text-sm py-3 rounded-2xl transition-all duration-300 border-2 border-dark hover:bg-gray-50">
                  View vote
                </button>
              </Link>
              <Link href={`/projects/${projectId}`} className="flex-1">
                <button className="w-full bg-secondary font-semibold text-dark text-sm py-3 rounded-2xl transition-all duration-300 border border-dark hover:scale-102">
                  View project
                </button>
              </Link>
            </div>
          ) : (
            <button className="w-full bg-secondary font-semibold text-dark text-base py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl border border-dark hover:scale-102 mt-auto">
              {variant === 'default' && hasCountdown
                ? (isFundingNotStarted ? 'Funding opens soon' : 'Fund project')
                : 'View project'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
