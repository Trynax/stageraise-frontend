"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/sections/footer"
import { getTokenByAddress } from "@/lib/constants/tokens"
import Link from "next/link"

export default function ProjectDetailPage() {
    const params = useParams()
    const projectId = params.id
    const [activeTab, setActiveTab] = useState<'about' | 'milestone' | 'voting'>('about')
    const [fundAmount, setFundAmount] = useState('')
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
                                alt={project.tagline}
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
                    <div className="border-3 border-dark px-6 py-4 rounded-xl mt-6 flex gap-8">
                        <div className="flex gap-3 flex-col flex-[40%]">
                            <div className="flex gap-3 items-center justify-between w-full">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Image src={project.logoUrl || "#"} alt={project.tagline || "Project Logo"} width={50} height={50} className="rounded-full flex-shrink-0" />
                                     <h1 className="text-xl font-bold truncate">{project.tagline}</h1>
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

                    {/* Main Content */}
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

                            {/* Tab Content */}
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
                                <div className="space-y-4">
                                    {project.milestones && project.milestones.length > 0 ? (
                                        project.milestones.map((milestone: any) => (
                                            <div key={milestone.id} className="bg-white border-2 border-dark rounded-2xl p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                                            Stage {milestone.stage}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 mb-4">
                                                    {milestone.description}
                                                </p>
                                                {milestone.deliverables && (
                                                    <div className="mb-4">
                                                        <h4 className="font-semibold mb-2">Deliverables:</h4>
                                                        <p className="text-gray-700">{milestone.deliverables}</p>
                                                    </div>
                                                )}
                                                {milestone.proofDocuments && milestone.proofDocuments.length > 0 && (
                                                    <div className="flex gap-2 mb-4">
                                                        {milestone.proofDocuments.slice(0, 3).map((doc: string, idx: number) => (
                                                            <div key={idx} className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600" />
                                                        ))}
                                                        {milestone.proofDocuments.length > 3 && (
                                                            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-semibold">
                                                                +{milestone.proofDocuments.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-white border-2 border-dark rounded-2xl p-12 text-center">
                                            <p className="text-xl font-semibold text-gray-600">No milestones defined</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'voting' && (
                                <div className="bg-white border-2 border-dark rounded-2xl p-12 text-center">
                                    <div className="flex justify-center mb-6">
                                        <div className="text-6xl">📊</div>
                                    </div>
                                    <p className="text-xl font-semibold text-gray-600">No voting yet</p>
                                </div>
                            )}
                        </div>

                  
                        <div className="space-y-6">
                           
                            <div className="bg-white border-2 border-dark rounded-2xl p-6">
                                <h3 className="text-xl font-bold mb-4">Enter Fund amount</h3>
                                <div className="relative mb-4">
                                   <Image src={`/icons/${project.symbol}.svg`} alt={project.symbol} width={24} height={24} />
                                    <input
                                        type="number"
                                        value={fundAmount}
                                        onChange={(e) => setFundAmount(e.target.value)}
                                        placeholder="Min 5"
                                        className="w-full pl-14 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-secondary focus:outline-none text-lg"
                                    />
                                </div>

                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    <button 
                                        onClick={() => setFundAmount('10')}
                                        className="px-3 py-2 bg-secondary rounded-xl font-semibold whitespace-nowrap hover:bg-secondary/80 transition-all text-sm"
                                    >
                                        10{token?.symbol || 'BUSD'}
                                    </button>
                                    <button 
                                        onClick={() => setFundAmount('50')}
                                        className="px-3 py-2 bg-white border-2 border-dark rounded-xl font-semibold whitespace-nowrap hover:bg-gray-50 transition-all text-sm"
                                    >
                                        50 {token?.symbol || 'BUSD'}
                                    </button>
                                    <button 
                                        onClick={() => setFundAmount('100')}
                                        className="px-3 py-2 bg-white border-2 border-dark rounded-xl font-semibold whitespace-nowrap hover:bg-gray-50 transition-all text-sm"
                                    >
                                        100 {token?.symbol || 'BUSD'}
                                    </button>
                                    <button 
                                        onClick={() => setFundAmount('1000')}
                                        className="px-3 py-2 bg-white border-2 border-dark rounded-xl font-semibold whitespace-nowrap hover:bg-gray-50 transition-all text-sm"
                                    >
                                        1000 {token?.symbol || 'BUSD'}
                                    </button>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    <button className="flex-1 py-3 border-2 border-dark rounded-xl font-semibold hover:bg-gray-50 transition-all">
                                        Share
                                    </button>
                                    <button className="flex-[2] py-3 bg-deepGreen text-white rounded-xl font-semibold hover:bg-deepGreen/80 transition-all">
                                        Fund projector
                                    </button>
                                </div>

                                <div className="mb-2">
                                    <div className="flex justify-between text-sm font-semibold mb-2">
                                        <span>${project.cachedRaisedAmount?.toLocaleString() || 0} raised</span>
                                        <span>${project.fundingTarget?.toLocaleString() || 0}</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-green-400 to-secondary transition-all"
                                            style={{ width: `${amountRaisedPercent}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Funders List */}
                            <div className="bg-white border-2 border-dark rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold">Funders ({project.recentContributions?.length || 0})</h3>
                                    <button className="px-3 py-1 border-2 border-dark rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-1">
                                        New to Old
                                        <span className="text-xs">▼</span>
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                    {project.recentContributions && project.recentContributions.length > 0 ? (
                                        project.recentContributions.map((contribution: any, index: number) => {
                                            const timeAgo = Math.floor((Date.now() - new Date(contribution.timestamp).getTime()) / (1000 * 60))
                                            return (
                                                <div key={index} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                                                            <span className="text-lg">💰</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-1">Amount</p>
                                                            <p className="font-bold text-base">50 {token?.symbol || 'BUSD'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500 mb-1">{timeAgo} min ago</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-700 font-medium">
                                                                {contribution.contributor.slice(0, 4)}....{contribution.contributor.slice(-4)}
                                                            </span>
                                                            <a 
                                                                href={`https://testnet.bscscan.com/tx/${contribution.transactionHash}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all"
                                                            >
                                                                <span className="text-xs">👁</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <p className="text-center text-gray-500 py-8">No contributions yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
