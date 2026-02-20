"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProjectCard from "@/components/projects/projectcard"

interface HomepageProject {
    projectId: number
    fundingStart?: string
    fundingDeadline?: string
    createdAt?: string
    status?: string | null
}

export function ProjectSection () {
    const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'completed'>('active');
    const [projects, setProjects] = useState<HomepageProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/projects?limit=6');
                const data = await response.json();
                if (data.success) {
                    setProjects(data.projects);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = projects
        .filter(project => {
            const fundingStart = new Date(project.fundingStart || project.createdAt || 0);
            const fundingDeadline = new Date(project.fundingDeadline || 0);
            const now = new Date();
            const isUpcoming = fundingStart > now;
            const isFundingActive = fundingDeadline > now;

            if (activeTab === 'upcoming') {
                return isUpcoming && (project.status === 'active' || !project.status);
            }
            if (activeTab === 'active') {
                return !isUpcoming && isFundingActive && (project.status === 'active' || !project.status);
            }
            return !isFundingActive || project.status === 'completed' || project.status === 'failed';
        })
        .slice(0, 6);

    return (
        <section className="py-20 bg-primary">

            <h1 className="text-4xl md:text-5xl font-bold text-center">Funds Projects That Are <span className="text-secondary" style={{ 
                            WebkitTextStroke: '2px black',
                            paintOrder: 'stroke fill'
                        }}>Built to Deliver</span></h1>


            <div className="border border-dark flex rounded-lg md:w-92 mx-auto mt-12"> 
               <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'active'
                    ? 'bg-secondary text-dark'
                    : 'text-[#9CA3AF] hover:text-gray-800'
                }`}>
            
                Active
            </button>
            <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'upcoming'
                    ? 'bg-secondary text-dark'
                    : 'text-[#9CA3AF] hover:text-gray-800'
                }`}>
            
                Upcoming
            </button>
            <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'completed'
                    ? 'bg-secondary text-dark'
                    : 'text-[#9CA3AF] hover:text-gray-800'
                }`}>
            
                Completed
             </button>
            </div>

            {loading ? (
                <div className="mt-12 flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
                </div>
            ) : filteredProjects.length > 0 ? (
                <>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-8 lg:px-32 mx-auto">
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project.projectId}
                                project={{ ...project, status: project.status ?? undefined }}
                            />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/projects" className="inline-flex items-center gap-2 text-lg font-semibold hover:gap-4 transition-all">
                            Explore projects 
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </>
            ) : (
                <div className="mt-12 max-w-2xl mx-auto">
                    <div className="bg-primary rounded-3xl border-dark p-4 md:p-12 text-center">
                        <div className="mb-6">
                            <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">
                            {activeTab === 'active'
                                ? 'No Active Projects Yet'
                                : activeTab === 'upcoming'
                                    ? 'No Upcoming Projects Yet'
                                    : 'No Completed Projects Yet'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {activeTab === 'active' 
                                ? "Be the first to launch on StageRaise — create milestone-based funding with community verification."
                                : activeTab === 'upcoming'
                                    ? "No projects are scheduled for future funding windows yet."
                                    : "No projects have completed their funding yet. Check back later!"
                            }
                        </p>
                        {(activeTab === 'active' || activeTab === 'upcoming') && (
                            <Link 
                                href="/create" 
                                className="inline-block bg-secondary text-dark font-semibold px-8 py-3 rounded-2xl  hover:scale-105 transition-transform"
                            >
                                Start a Project
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}
