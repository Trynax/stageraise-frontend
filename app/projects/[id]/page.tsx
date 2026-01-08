"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/sections/footer"
import { getTokenByAddress } from "@/lib/constants/tokens"
import { FundingCard } from "@/components/project/FundingCard"
import { FundersList } from "@/components/project/FundersList"
import { MilestoneTab } from "@/components/project/MilestoneTab"
import { VotingTab } from "@/components/project/VotingTab"
import { ContributionDetailsCard } from "@/components/project/ContributionDetailsCard"
import { LiveVotingCard } from "@/components/project/LiveVotingCard"
import { RefundCard } from "@/components/project/RefundCard"
import Link from "next/link"

export default function ProjectDetailPage() {
    const params = useParams()
    const projectId = params.id
    const [activeTab, setActiveTab] = useState<'about' | 'milestone' | 'voting'>('about')
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [project, setProject] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (projectId && ['1', '2', '3', '4'].includes(projectId as string)) {
                    const { getMockProject } = await import('@/lib/mockProjectDetail')
                    const scenarios = {
                        '1': 'funding',
                        '2': 'completed',
                        '3': 'withVotingHistory',
                        '4': 'failedRefund'
                    } as const
                    const mockData = getMockProject(scenarios[projectId as '1' | '2' | '3' | '4'])
                    setProject(mockData)
                    setLoading(false)
                    return
                }

                // Fetch real data for other project IDs
                const response = await fetch(`/api/projects/${projectId}`)
                const data = await response.json()
                if (data.success) {
                    setProject(data.project)
                }
            } catch (error) {
                console.error('Error fetching project:', error)
            } finally {
                setLoading(false)
            }
        }

        if (projectId) {
            fetchProject()
        }
    }, [projectId])

    if (loading) {
        return (
            <>
                <Header />
                <div className="pt-16 bg-primary min-h-screen flex items-center justify-center">
                    <p className="text-2xl font-semibold">Loading...</p>
                </div>
                <Footer />
            </>
        )
    }

    if (!project) {
        return (
            <>
                <Header />
                <div className="pt-16 bg-primary min-h-screen flex items-center justify-center">
                    <p className="text-2xl font-semibold">Project not found</p>
                </div>
                <Footer />
            </>
        )
    }

    const images = [project.coverImageUrl, ...(project.galleryImageUrls || [])].filter(Boolean)
    const token = getTokenByAddress(project.paymentToken)
    const fundingDeadline = new Date(project.fundingDeadline)
    const now = new Date()
    const daysLeft = Math.max(0, Math.ceil((fundingDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    
    const amountRaisedPercent = project.fundingTarget > 0 
        ? Math.round((project.cachedRaisedAmount / project.fundingTarget) * 100) 
        : 0

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <>
            <Header />
            <div className="pt-16 bg-primary min-h-screen">
                
                <div className=" px-4 md:px-32 py-12">
                    <div className="relative w-full h-[300px] md:h-[300px] rounded-3xl overflow-hidden">
                        {images.length > 0 && (
                            <Image
                                src={images[currentImageIndex]}
                                alt={project.name}
                                fill
                                quality={95}
                                className="object-fit object-center "
                            />
                        )}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all"
                                >
                                    <Image src="/icons/back.svg" alt="Previous" width={24} height={24} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all"
                                >
                                    <Image src="/icons/back.svg" alt="Next" width={24} height={24} className="rotate-180" />
                                </button>
                            </>
                        )}
                    </div>
                    <div className="border-2 border-dark px-4 py-2 rounded-xl mt-6 flex gap-8">
                        <div className="flex gap-3 flex-col flex-[40%]">
                            <div className="flex gap-16 items-center w-full">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Image src={project.logoUrl || "#"} alt={project.name || "Project Logo"} width={50} height={50} className="rounded-full flex-shrink-0" />
                                     <h1 className="text-xl font-bold truncate">{project.name}</h1>
                                </div>
                               
                                <div className="flex gap-3 border-l border-gray-300 pl-3 flex-shrink-0">
                                    <Link href={project.discordUrl || "#"} className="hover:opacity-70 transition-opacity">
                                    <Image src="/icons/discord-black.svg" alt="Discord" width={20} height={20} />
                                    </Link>
                                    <Link href={project.twitterUrl || "#"} className="hover:opacity-70 transition-opacity">
                                    <Image src="/icons/X-black.svg" alt="Twitter" width={20} height={20} />
                                    </Link>
                                    <Link href={project.websiteUrl || "#"} className="hover:opacity-70 transition-opacity">
                                    <Image src="/icons/website-black.svg" alt="Website" width={20} height={20} />
                                    </Link>
                                    <Link href={project.websiteUrl || "#"} className="hover:opacity-70 transition-opacity">
                                    <Image src="/icons/share-black.svg" alt="Share" width={20} height={20} />
                                    </Link>

                                </div>
                                
                            </div>

                            <div className ="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center bg-secondary px-2 py-1 border border-dark rounded-full">
                                    <Image src={"/icons/squares.svg"} alt="milestones" width={14} height={14}></Image>
                                    {
                                        project.currentMilestone > 0 ? (
                                            <span className="ml-2 text-xs font-semibold whitespace-nowrap">{project.currentMilestone}/{project.milestones.length} Milestones</span>
                                        ) : (
                                            <span className="ml-2 text-xs font-semibold whitespace-nowrap">{project.milestones.length} Milestones</span>
                                        )
                                    }
                                </div>
                                <div className="flex items-center bg-secondary px-2 py-1 border border-dark rounded-full">
                                     <Image src={"/icons/clock.svg"} alt="milestones" width={14} height={14}></Image>
                                     <span className="ml-2 text-xs font-semibold whitespace-nowrap">Voting Period ({project.votingPeriodDays}D)</span>

                                </div>
                                    <span className="bg-secondary px-2 py-1 border border-dark rounded-full text-xs font-semibold whitespace-nowrap">Created On {new Date(project.createdAt).toLocaleDateString()}</span>

                            </div>

                        </div>

                        <div className="flex gap-2 flex-[40%] justify-between">

                            <div className="flex flex-col items-center gap-3 flex-1">
                                <span className="text-sm text-gray-500">Amount Raised</span>
                                <span>{project.cachedRaisedAmount}({amountRaisedPercent}%)</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 flex-1">
                                <span className="text-sm text-gray-500">Time Left</span>
                                <span>{daysLeft}D</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 flex-1">
                                <span className="text-sm text-gray-500">Funders</span>
                                <span>{project.cachedTotalContributors}</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 flex-1">
                                <span className="text-sm text-gray-500">Fundraising Target</span>
                                <span>{project.fundingTarget}</span>
                            </div>



                        </div>

                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 mt-8">
                      
                        <div className="lg:col-span-2">
                       
                            <div className="flex gap-0 mb-6 bg-white border-2 border-dark rounded-2xl p-0.5">
                                <button
                                    onClick={() => setActiveTab('about')}
                                    className={`flex-1 px-2 py-1 font-semibold transition-all rounded-xl ${
                                        activeTab === 'about'
                                            ? 'bg-secondary text-dark'
                                            : 'bg-white text-dark hover:bg-gray-50'
                                    }`}
                                >
                                    About project
                                </button>
                                {(activeTab !== 'about' && activeTab !== 'milestone') && (
                                    <div className="w-[0.5px] bg-gray-300 self-center h-8 z-10"></div>
                                )}
                                <button
                                    onClick={() => setActiveTab('milestone')}
                                    className={`flex-1 px-2 py-1 font-semibold transition-all rounded-xl ${
                                        activeTab === 'milestone'
                                            ? 'bg-secondary text-dark'
                                            : 'bg-white text-dark hover:bg-gray-50'
                                    }`}
                                >
                                    Milestone
                                </button>
                                {(activeTab !== 'milestone' && activeTab !== 'voting') && (
                                    <div className="w-[0.5px] bg-gray-300 self-center h-8 z-10"></div>
                                )}
                                <button
                                    onClick={() => setActiveTab('voting')}
                                    className={`flex-1 px-2 py-1 font-semibold transition-all rounded-xl ${
                                        activeTab === 'voting'
                                            ? 'bg-secondary text-dark'
                                            : 'bg-white text-dark hover:bg-gray-50'
                                    }`}
                                >
                                    Voting
                                </button>
                            </div>

                      
                            {activeTab === 'about' && (
                                <div className="">
                                    <h2 className="text-sm font-semibold mb-3">Tag line</h2>
                                    <div className="flex gap-2 mb-6">
                                        {project.tags && project.tags.map((tag: string) => (
                                            <span key={tag} className="px-2 py-1  border border-dark rounded-sm text-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="text-dark whitespace-pre-line leading-relaxed">
                                        {project.description}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'milestone' && (
                                <MilestoneTab 
                                    milestones={project.milestones || []} 
                                    currentMilestone={project.currentMilestone || 0}
                                    projectTitle={project.name}
                                    failedVotingCount={project.failedVotingCount || 0}
                                />
                            )}

                            {activeTab === 'voting' && (
                                <VotingTab 
                                    votingHistory={project.votingHistory || []}
                                    projectTitle={project.tagline}
                                    projectImage={project.logoUrl}
                                    projectDescription={project.description}
                                    totalMilestones={project.milestones?.length || 0}
                                    totalFunders={project.cachedTotalContributors || 0}
                                    failedVotingCount={project.failedVotingCount || 0}
                                    status={project.status}
                                    projectId={project.id}
                                />
                            )}
                        </div>

                  
                        <div className="space-y-6">
                           
                            {/* Show FundingCard if funding is ongoing (currentMilestone === 0) */}
                            {project.currentMilestone === 0 && !project.status && (
                                <FundingCard 
                                    projectId={project.projectId}
                                    token={token}
                                    fundingTarget={project.fundingTarget}
                                    cachedRaisedAmount={project.cachedRaisedAmount}
                                    amountRaisedPercent={amountRaisedPercent}
                                    minContribution={project.minContribution}
                                    maxContribution={project.maxContribution}
                                />
                            )}


                            {project.status === 'refundable' && (
                                <RefundCard
                                    projectId={project.projectId}
                                    failedAtMilestone={project.currentMilestone}
                                    refundableAmount={project.userContribution || 0}
                                    token={token}
                                />
                            )}


                            {project.activeVoting && !project.status && (
                                <LiveVotingCard
                                    projectId={project.projectId}
                                    milestoneStage={project.activeVoting.stage}
                                    milestoneTitle={project.activeVoting.title}
                                    yesVotes={project.activeVoting.yesVotes || 0}
                                    noVotes={project.activeVoting.noVotes || 0}
                                    totalVotes={(project.activeVoting.yesVotes || 0) + (project.activeVoting.noVotes || 0)}
                                    votingEndTime={new Date(project.activeVoting.votingEndTime)}
                                    userVote={project.activeVoting.userVote}
                                />
                            )}

                            {project.currentMilestone > 0 && !project.activeVoting && !project.status && (
                                <ContributionDetailsCard
                                    token={token}
                                    userContribution={project.userContribution || 100}
                                    contributionPercentage={project.userContributionPercent || 10}
                                    currentMilestone={project.currentMilestone}
                                    totalMilestones={project.milestones?.length || 0}
                                    cachedRaisedAmount={project.cachedRaisedAmount}
                                    fundingTarget={project.fundingTarget}
                                    amountRaisedPercent={amountRaisedPercent}
                                />
                            )}

                            <FundersList 
                                contributions={project.recentContributions || []}
                                token={token}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
