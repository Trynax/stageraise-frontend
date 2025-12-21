"use client"

import { useState } from "react"
import ProjectCard from "@/components/projects/projectcard"
import { mockProjects } from "@/lib/mockData"

export function ProjectSection () {

    const [activeTab, setActiveTab] = useState<'ongoing' | 'ended'>('ongoing');

    const filteredProjects = mockProjects.filter(project => project.status === activeTab);

    return (
        <section className="py-20 px-8 bg-primary">

            <h1 className="text-5xl font-bold text-center">Funds Projects That Are <span className="text-secondary" style={{ 
                            WebkitTextStroke: '2px black',
                            paintOrder: 'stroke fill'
                        }}>Built to Deliver</span></h1>


            <div className="border border-dark flex rounded-lg w-92 mx-auto mt-12"> 
               <button
                onClick={() => setActiveTab('ongoing')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'ongoing'
                    ? 'bg-secondary text-dark'
                    : 'text-[#9CA3AF] hover:text-gray-800'
                }`}
            >
                Ongoing
            </button>
            <button
                onClick={() => setActiveTab('ended')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'ended'
                    ? 'bg-secondary text-dark'
                    : 'text-[#9CA3AF] hover:text-gray-800'
                }`}
            >
                Ended
             </button>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>

        
            <div className="text-center mt-12">
                <button className="inline-flex items-center gap-2 text-lg font-semibold hover:gap-4 transition-all">
                    Explore project 
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
            </div>
        </section>
    )
}