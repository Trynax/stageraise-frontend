'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project | any; // Allow both mock and real project types
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Handle both mock data format and database format
  // Use projectId (numeric, for contract) for URL routing, not database UUID
  const projectId = project.projectId || project.id;
  const title = project.title || project.name || 'Untitled Project';
  const description = project.description || project.detailedDescription || '';
  const image = project.image || project.coverImageUrl || project.logoUrl || '/placeholder.jpg';
  const raised = project.raised || parseFloat(project.cachedRaisedAmount || '0');
  const goal = project.goal || parseFloat(project.targetAmount || '0');
  const funders = project.funders || project.cachedTotalContributors || 0;
  const endDate = project.endDate || project.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const status = project.status || (project.cachedIsActive ? 'ongoing' : 'ended');
  const milestoneCount = project.milestones?.length || project.milestones || 0;
  const type = project.type || (milestoneCount > 0 ? 'Milestone Based' : 'Regular');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endDate) - +new Date();
      
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
  }, [endDate]);

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
              <span className="font-semibold">{funders} funders</span>
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


          <div className="text-center mb-4 mt-auto">
            <p className="text-gray-600 text-xs mb-1">Funding ends in</p>
            <p className="text-base font-semibold">
              {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}sec
            </p>
          </div>

          <button className="w-full bg-secondary font-semibold text-dark text-base py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl border border-dark hover:scale-102">
            Fund project
          </button>
        </div>
      </div>
    </Link>
  );
}