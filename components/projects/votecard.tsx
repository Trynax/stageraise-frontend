'use client';

import { useState, useEffect } from 'react';
import type { Vote } from '@/lib/types';

interface VoteCardProps {
  vote: Vote;
}

export default function VoteCard({ vote }: VoteCardProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(vote.endDate) - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [vote.endDate]);

  const yesPercentage = vote.totalVotes > 0 ? Math.round((vote.yesVotes / vote.totalVotes) * 100) : 0;
  const noPercentage = vote.totalVotes > 0 ? Math.round((vote.noVotes / vote.totalVotes) * 100) : 0;

  return (
    <div className="p-1">
      <div className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-dark p-4 relative hover:scale-102 transition-transform duration-300 flex flex-col">
   
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={vote.image} 
            alt={vote.title} 
            className="w-16 h-16 object-cover rounded-xl border-2 border-dark"
          />
          <h2 className="text-2xl font-bold line-clamp-1 flex-1">{vote.title}</h2>
        </div>

 
        <p className="text-gray-700 mb-4 leading-relaxed line-clamp-2 text-lg font-semibold ">
          {vote.description}
        </p>

        {/* Milestone and Status */}
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-base">Milestone {vote.milestone} Vote</span>
          <span className={`font-semibold text-sm ${
            vote.result === 'ongoing' ? 'text-[#F97316]' :
            vote.result === 'passed' ? 'text-green-600' :
            vote.result === 'failed' ? 'text-red-600' :
            vote.status === 'ongoing' ? 'text-[#F97316]' : 'text-gray-600'
          }`}>
            {vote.result === 'ongoing' || vote.status === 'ongoing' ? 'Ongoing' : 'Ended'}
          </span>
        </div>

        {/* Vote Progress Bar */}
        <div className="mb-3">
          <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300 flex">
            <div 
              className="h-full bg-linear-to-r from-green-400 to-green-500 flex items-center justify-center text-xs font-bold text-white transition-all duration-500"
              style={{ width: `${yesPercentage}%` }}
            >
              {yesPercentage > 15 && `${yesPercentage}%`}
            </div>
            <div 
              className="h-full bg-linear-to-r from-red-400 to-red-500 flex items-center justify-center text-xs font-bold text-white transition-all duration-500"
              style={{ width: `${noPercentage}%` }}
            >
              {noPercentage > 15 && `${noPercentage}%`}
            </div>
          </div>
        </div>

        {/* Vote Stats */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold">YES {yesPercentage}%</span>
          <span className="text-sm font-semibold">NO {noPercentage}%</span>
        </div>

        <div className="space-y-1 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-green-600 font-semibold">YES Vote</span>
            <span className="font-bold">{vote.yesVotes}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-600 font-semibold">NO Vote</span>
            <span className="font-bold">{vote.noVotes}</span>
          </div>
          <div className="flex justify-between border-t pt-1">
            <span className="font-semibold">Total Vote</span>
            <span className="font-bold">{vote.totalVotes}</span>
          </div>
        </div>

        {/* Milestones and Funders */}
        <div className="flex justify-between mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-semibold">{vote.milestone}/{vote.milestones} Step Milestone</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
            <span className="font-semibold">{vote.funders} funders</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 mb-4">
          {vote.communityVote && (
            <button className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 border-2 border-gray-800 rounded-full hover:bg-gray-50 transition-colors text-xs">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              </svg>
              <span className="font-semibold">Community vote</span>
            </button>
          )}
          {vote.refundable && (
            <button className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 border-2 border-gray-800 rounded-full hover:bg-gray-50 transition-colors text-xs">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
              <span className="font-semibold">Refundable</span>
            </button>
          )}
        </div>

        {/* Status Messages */}
        {vote.result === 'passed' && vote.status === 'ended' && (
          <div className="bg-white border-2 border-dark rounded-xl p-3 mb-4">
            <p className="text-sm font-semibold mb-1">Vote Ended</p>
            <p className="text-xs text-gray-700">
              This milestone met the required approval threshold. Funds have been released and project progression continues.
            </p>
          </div>
        )}

        {vote.result === 'failed' && vote.status === 'ended' && (
          <div className="bg-white border-2 border-dark rounded-xl p-3 mb-4">
            <p className="text-sm font-semibold mb-1">Vote Ended</p>
            <p className="text-xs text-gray-700">
              {vote.refundable 
                ? "After three consecutive failed attempts, the project has been marked as failed. Funders can now manually claim their proportional refunds."
                : "This milestone did not meet the required approval threshold. The creator may resubmit for another vote."
              }
            </p>
          </div>
        )}

        {/* Countdown or Vote Button */}
        {vote.result === 'ongoing' || vote.status === 'ongoing' ? (
          <>
            <div className="text-center mb-4 mt-auto">
              <p className="text-gray-600 text-xs mb-1">Vote Ends In</p>
              <p className="text-base font-semibold">
                {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}sec
              </p>
            </div>
            <button className="w-full bg-secondary font-semibold text-dark text-base py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl border border-dark hover:scale-102">
              Vote now
            </button>
          </>
        ) : (
          <button className="w-full bg-white font-semibold text-dark text-base py-3 rounded-2xl transition-all border-2 border-dark hover:bg-gray-50 mt-auto">
            View details
          </button>
        )}
      </div>
    </div>
  );
}
 