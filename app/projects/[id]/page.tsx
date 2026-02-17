"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams } from "next/navigation"
import { useAccount, useChainId } from "wagmi"
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
import { CreatorWithdrawCard } from "@/components/project/CreatorWithdrawCard"
import Link from "next/link"
import { useProjectBalance } from "@/lib/contracts/hooks"
import { formatUnits } from "viem"

export default function ProjectDetailPage() {
    const params = useParams()
    const projectId = params.id
    const { address } = useAccount()
    const chainId = useChainId()
    const [activeTab, setActiveTab] = useState<'about' | 'milestone' | 'voting'>('about')
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [project, setProject] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const resolvedProjectId = typeof project?.projectId === 'number' ? project.projectId : 0
    const {
        balance: onchainProjectBalance,
        refetch: refetchOnchainProjectBalance
    } = useProjectBalance(resolvedProjectId, chainId, resolvedProjectId > 0)

    const fetchProject = useCallback(async () => {
        try {
            const voterQuery = address ? `?voter=${address}` : ""
            const response = await fetch(`/api/projects/${projectId}${voterQuery}`, { cache: 'no-store' })
            const data = await response.json()
            if (data.success) {
                setProject(data.project)
            }
        } catch (error) {
            console.error('Error fetching project:', error)
        } finally {
            setLoading(false)
        }
    }, [projectId, address])

    useEffect(() => {
        if (projectId) {
            void fetchProject()
        }
    }, [projectId, fetchProject])

    // Dynamic countdown timer
    useEffect(() => {
        if (!project?.fundingDeadline) return

        const calculateTimeLeft = () => {
            const now = new Date().getTime()
            const deadline = new Date(project.fundingDeadline).getTime()
            const difference = deadline - now

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                })
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [project?.fundingDeadline])


    const userContribution = useMemo(() => {
        if (!address || !project?.contributions) return 0
        return project.contributions
            .filter((c: any) => c.contributor.toLowerCase() === address.toLowerCase())
            .reduce((sum: number, c: any) => sum + (c.amount || 0), 0)
    }, [address, project?.contributions])

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
    const parsedOnchainBalance = onchainProjectBalance !== undefined
        ? Number.parseFloat(formatUnits(onchainProjectBalance, token?.decimals || 18))
        : Number.NaN
    const displayProjectBalance = Number.isFinite(parsedOnchainBalance)
        ? parsedOnchainBalance
        : (project.cachedRaisedAmount || 0)
    
    const amountRaisedPercent = project.fundingTarget > 0 
        ? Math.round((project.cachedRaisedAmount / project.fundingTarget) * 100) 
        : 0

    // Determine if we're still in funding phase (deadline not passed)
    const isFundingPhase = new Date(project.fundingDeadline) > new Date()
    // Determine if milestone phase has started (funding ended and milestone-based)
    const isMilestonePhase = !isFundingPhase && project.milestones?.length > 0
    const isMilestoneBasedProject =
        project?.milestoneBased === true || (project?.milestones?.length || 0) > 0

    const userContributionPercent = project.cachedRaisedAmount > 0 
        ? Math.round((userContribution / project.cachedRaisedAmount) * 100) 
        : 0

    const isCreator = Boolean(
        address &&
        project?.ownerAddress &&
        address.toLowerCase() === project.ownerAddress.toLowerCase()
    )

    // Format time left display
    const formatTimeLeft = () => {
        if (timeLeft.days > 0) {
            return `${timeLeft.days}D : ${timeLeft.hours}H : ${timeLeft.minutes}M`
        } else if (timeLeft.hours > 0) {
            return `${timeLeft.hours}H : ${timeLeft.minutes}M : ${timeLeft.seconds}S`
        } else if (timeLeft.minutes > 0) {
            return `${timeLeft.minutes}M : ${timeLeft.seconds}S`
        } else if (timeLeft.seconds > 0) {
            return `${timeLeft.seconds}S`
        }
        return 'Ended'
    }

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
                    <div className="border-2 border-dark px-4 py-3 rounded-xl mt-6 flex flex-col md:flex-row gap-4 md:gap-6">
                        <div className="flex gap-3 flex-col min-w-0 md:flex-[38%]">
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 w-full min-w-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    {project.logoUrl ? (
                                        <Image src={project.logoUrl} alt={project.name || "Project Logo"} width={50} height={50} className="rounded-full shrink-0" />
                                    ) : (
                                        <div className="w-[50px] h-[50px] rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                            <span className="text-xl font-bold text-gray-500">{project.name?.charAt(0) || 'P'}</span>
                                        </div>
                                    )}
                                     <h1 className="text-xl font-bold truncate">{project.name}</h1>
                                </div>
                               
                                <div className="flex items-center gap-3 border-l border-gray-300 pl-3 shrink-0">
                                    {project.discordUrl && (
                                    <Link href={project.discordUrl} className="hover:opacity-70 transition-opacity">
                                    <Image src="/icons/discord-black.svg" alt="Discord" width={20} height={20} />
                                    </Link>
                                    )}
                                    {project.twitterUrl && (
                                    <Link href={project.twitterUrl} className="hover:opacity-70 transition-opacity">
                                    <Image src="/icons/X-black.svg" alt="Twitter" width={20} height={20} />
                                    </Link>
                                    )}
                                    {project.websiteUrl && (
                                    <Link href={project.websiteUrl} className="hover:opacity-70 transition-opacity">
                                    <Image src="/icons/website-black.svg" alt="Website" width={20} height={20} />
                                    </Link>
                                    )}
                                    <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="hover:opacity-70 transition-opacity">
                                    <Image src="/icons/share-black.svg" alt="Share" width={20} height={20} />
                                    </button>

                                </div>

                            </div>

                            <div className ="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center bg-deepGreen text-[#CBF5BD] px-2 py-1 border border-dark rounded-full">
                                    <Image src={"/icons/squaresnew.svg"} alt="milestones" width={14} height={14}></Image>
                                    {
                                        project.currentMilestone > 0 ? (
                                            <span className="ml-2 text-xs font-semibold whitespace-nowrap">{project.currentMilestone}/{project.milestones.length} Milestones</span>
                                        ) : (
                                            <span className="ml-2 text-xs font-semibold whitespace-nowrap">{project.milestones.length} Milestones</span>
                                        )
                                    }
                                </div>
                                <div className="flex items-center bg-deepGreen text-[#CBF5BD] px-2 py-1 border border-dark rounded-full">
                                     <Image src={"/icons/clocknew.svg"} alt="milestones" width={14} height={14}></Image>
                                     <span className="ml-2 text-xs font-semibold whitespace-nowrap">Voting Period ({project.votingPeriodDays}D)</span>

                                </div>
                                    <span className="bg-deepGreen text-[#CBF5BD] px-2 py-1 border border-dark rounded-full text-xs font-semibold whitespace-nowrap">Created On {new Date(project.createdAt).toLocaleDateString()}</span>

                            </div>

                        </div>

                        <div className="w-full md:flex-[62%] md:border-gray-300 md:pl-6 mt-4">
                            <div className="flex  md:gap-10 md:justify-between overflow-x-auto md:overflow-visible pb-1">

                            <div className="flex flex-col items-center gap-4 shrink-0 min-w-[140px] md:min-w-0 md:flex-1">
                                <span className="text-sm text-gray-500 whitespace-nowrap">Amount Raised</span>
                                <span className="whitespace-nowrap font-semibold">
                                    {project.cachedRaisedAmount?.toLocaleString() || 0} {token?.symbol || 'BUSD'}
                                    {isFundingPhase && ` (${amountRaisedPercent}%)`}
                                </span>
                            </div>
                            {isFundingPhase ? (
                                <div className="flex flex-col items-center gap-4 shrink-0 min-w-[140px] md:min-w-0 md:flex-1">
                                    <span className="text-sm text-gray-500 whitespace-nowrap">Time Left</span>
                                    <span className="font-mono whitespace-nowrap font-semibold">{formatTimeLeft()}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4 shrink-0 min-w-[140px] md:min-w-0 md:flex-1">
                                    <span className="text-sm text-gray-500 whitespace-nowrap">Project Balance</span>
                                    <span className="whitespace-nowrap font-semibold">{displayProjectBalance.toLocaleString() || 0} {token?.symbol || 'BUSD'}</span>
                                </div>
                            )}
                            <div className="flex flex-col items-center gap-4 shrink-0 min-w-[120px] md:min-w-0 md:flex-1">
                                <span className="text-sm text-gray-500 whitespace-nowrap">Funders</span>
                                <span className="whitespace-nowrap font-semibold">{project.cachedTotalContributors || 0}</span>
                            </div>
                            <div className="flex flex-col items-center gap-4 shrink-0 min-w-[170px] md:min-w-0 md:flex-1">
                                <span className="text-sm text-gray-500 whitespace-nowrap">Fundraising Target</span>
                                <span className="whitespace-nowrap font-semibold">{project.fundingTarget?.toLocaleString() || 0} {token?.symbol || 'BUSD'}</span>
                            </div>
                            {isMilestoneBasedProject && (
                                <div className="flex flex-col items-center gap-4 shrink-0 min-w-[120px] md:min-w-0 md:flex-1">
                                    <span className="text-sm text-gray-500 whitespace-nowrap">Failed Votes</span>
                                    <span className="whitespace-nowrap font-semibold">{project.failedVotingCount || 0}/3</span>
                                </div>
                            )}



                            </div>
                        </div>

                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 mt-8">
                      
                        <div className="lg:col-span-2 order-2 lg:order-1">
                       
                            <div className="flex gap-0 mb-6 bg-white border-2 border-dark rounded-2xl p-px">
                                <button
                                    onClick={() => setActiveTab('about')}
                                    className={`flex-1 text-sm px-1 py-2 font-semibold transition-all rounded-xl ${
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
                                    className={`flex-1 text-sm px-2 py-2 font-semibold transition-all rounded-xl ${
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
                                    className={`flex-1 text-sm px-2 py-2 font-semibold transition-all rounded-xl ${
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
                                    currentMilestone={project.currentMilestone || 1}
                                    projectId={projectId as string}
                                    contractProjectId={project.projectId}
                                    projectTitle={project.name}
                                    failedVotingCount={project.failedVotingCount || 0}
                                    isFundingPhase={isFundingPhase}
                                    isCreator={isCreator}
                                    activeVotingStage={project.activeVoting?.stage ?? null}
                                    onVoteSetupSuccess={fetchProject}
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
                                    projectId={project.projectId}
                                />
                            )}
                        </div>

                  
                        <div className="space-y-6 order-1 lg:order-2">
                            {isCreator ? (
                                <CreatorWithdrawCard
                                    projectId={project.projectId}
                                    token={token}
                                    fallbackProjectBalance={project.cachedRaisedAmount || 0}
                                    onWithdrawSuccess={() => {
                                        void fetchProject()
                                        void refetchOnchainProjectBalance()
                                    }}
                                />
                            ) : (
                                <>
                                    {/* Show FundingCard if funding deadline hasn't passed */}
                                    {isFundingPhase && project.status !== 'completed' && project.status !== 'refundable' && (
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


                                    {project.activeVoting && project.status !== 'completed' && project.status !== 'refundable' && (
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

                                    {/* Show ContributionDetailsCard during milestone phase (not during funding, not during voting) */}
                                    {isMilestonePhase && !project.activeVoting && project.status !== 'completed' && project.status !== 'refundable' && userContribution > 0 && (
                                        <ContributionDetailsCard
                                            token={token}
                                            userContribution={userContribution}
                                            contributionPercentage={userContributionPercent}
                                            currentMilestone={project.currentMilestone}
                                            totalMilestones={project.milestones?.length || 0}
                                            cachedRaisedAmount={project.cachedRaisedAmount}
                                        />
                                    )}
                                </>
                            )}

                            <FundersList 
                                contributions={project.contributions || []}
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
