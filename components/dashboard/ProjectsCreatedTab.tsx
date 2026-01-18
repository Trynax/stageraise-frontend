"use client"

import { useState, useEffect } from "react"
import ProjectCard from "@/components/projects/projectcard"

interface ProjectsCreatedTabProps {
    address: string
}

export function ProjectsCreatedTab({ address }: ProjectsCreatedTabProps) {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/dashboard/projects?address=${address}&page=${page}&limit=9`)
                const data = await response.json()

                if (data.success) {
                    setProjects(data.projects)
                    setTotalPages(data.pagination.totalPages)
                }
            } catch (error) {
                console.error('Error fetching projects:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [address, page])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deepGreen"></div>
            </div>
        )
    }

    if (projects.length === 0) {
        return null // Parent will show EmptyState
    }

    return (
        <div className="w-full">
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <ProjectCard 
                        key={project.id} 
                        project={{
                            ...project,
                            communityVote: true,
                            refundable: true
                        }} 
                        variant="created" 
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-8">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-dark rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`w-10 h-10 rounded-lg border transition-colors ${
                                        page === pageNum
                                            ? 'border-deepGreen bg-deepGreen/10'
                                            : 'border-dark hover:bg-gray-50'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            )
                        })}
                    </div>

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-dark rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}
