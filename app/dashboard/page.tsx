"use client"

import { useState, useEffect } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/sections/footer"
import { ActivityList } from "@/components/dashboard/ActivityList"
import { ProjectsCreatedTab } from "@/components/dashboard/ProjectsCreatedTab"
import { VotingTab } from "@/components/dashboard/VotingTab"
import { ContributionsTab } from "@/components/dashboard/ContributionsTab"

type TabType = 'activity' | 'projects' | 'voting' | 'contributions'

export default function DashboardPage() {
    const { address, isConnected, isConnecting, isReconnecting } = useAccount()
    const { disconnect } = useDisconnect()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<TabType>('activity')
    const [stats, setStats] = useState({
        fundingReceived: 0,
        amountFunded: 0,
        projectsFunded: 0,
        projectsCreated: 0
    })
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [mounted, setMounted] = useState(false)


    useEffect(() => {
        setMounted(true)
    }, [])

 
    useEffect(() => {
        if (mounted && !isConnecting && !isReconnecting && !isConnected) {
            router.push('/')
        }
    }, [mounted, isConnected, isConnecting, isReconnecting, router])

    useEffect(() => {
        const fetchStats = async () => {
            if (!address) return
            
            try {
                const response = await fetch(`/api/dashboard/stats?address=${address}`)
                const data = await response.json()
                if (data.success) {
                    setStats(data.stats)
                }
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [address])

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}......${addr.slice(-4)}`
    }

    const copyAddress = async () => {
        if (address) {
            await navigator.clipboard.writeText(address)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    if (!mounted || isConnecting || isReconnecting) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-[#F5F5F5] pt-16 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepGreen mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </main>
            </>
        )
    }

    if (!isConnected || !address) {
        return null
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-primary pt-16">
                <div className="bg-secondary py-4 px-4 md:px-32">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/projects" className="hover:underline">Explore page</Link>
                        <span>&gt;</span>
                        <span className="font-semibold">Dashboard</span>
                    </div>
                </div>
                <div className="px-4 md:px-32 py-8">
                    <div className="bg-primary rounded-2xl border-2 border-dark p-4 mb-6">
                        <div className="flex justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                                    <Image src="/icons/profile.svg" alt="Profile" width={48} height={48} />
                                </div>
                                <span className="font-mono text-lg font-semibold">{formatAddress(address)}</span>
                                <div className="hidden md:block w-px h-8 bg-gray-300 mx-2"></div>
                                <button 
                                    onClick={copyAddress}
                                    className={`p-2 rounded-lg transition-colors ${copied ? 'bg-green-100' : 'bg-secondary hover:bg-secondary/80'}`}
                                    title={copied ? "Copied!" : "Copy address"}
                                >
                                    <Image src="/icons/copy.svg" alt="Copy" width={20} height={20} />
                                </button>
                                <button
                                    onClick={() => disconnect()}
                                    className="flex items-center gap-2 px-4 py-2 border-2 border-dark rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <span className="text-sm">Disconnect</span>
                                    <Image src="/icons/disconnect.svg" alt="Disconnect" width={16} height={16} />
                                </button>
                            </div>

  
                            <div className="flex flex-wrap gap-4 lg:gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Funding Received</p>
                                    <p className="text-xl font-bold">{formatCurrency(stats.fundingReceived)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Amount Funded</p>
                                    <p className="text-xl font-bold">{formatCurrency(stats.amountFunded)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Project Funded</p>
                                    <p className="text-xl font-bold">{stats.projectsFunded}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Project Created</p>
                                    <p className="text-xl font-bold">{stats.projectsCreated}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-0 mb-6 bg-white border border-dark rounded-xl p-0.5">
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`flex-1 px-2 py-1 font-semibold transition-all rounded-xl ${
                                activeTab === 'activity'
                                    ? 'bg-secondary text-dark'
                                    : 'bg-white text-dark hover:bg-gray-50'
                            }`}
                        >
                            Activity
                        </button>
                        {(activeTab !== 'activity' && activeTab !== 'projects') && (
                            <div className="w-[0.5px] bg-gray-300 self-center h-8 z-10"></div>
                        )}
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`flex-1 px-2 py-1 font-semibold transition-all rounded-xl ${
                                activeTab === 'projects'
                                    ? 'bg-secondary text-dark'
                                    : 'bg-white text-dark hover:bg-gray-50'
                            }`}
                        >
                            Projects created
                        </button>
                        {(activeTab !== 'projects' && activeTab !== 'voting') && (
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
                        {(activeTab !== 'voting' && activeTab !== 'contributions') && (
                            <div className="w-[0.5px] bg-gray-300 self-center h-8 z-10"></div>
                        )}
                        <button
                            onClick={() => setActiveTab('contributions')}
                            className={`flex-1 px-2 py-1 font-semibold transition-all rounded-xl ${
                                activeTab === 'contributions'
                                    ? 'bg-secondary text-dark'
                                    : 'bg-white text-dark hover:bg-gray-50'
                            }`}
                        >
                            Contributions
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {activeTab === 'activity' && (
                            <ActivityTab address={address} />
                        )}
                        {activeTab === 'projects' && (
                            <ProjectsTab address={address} />
                        )}
                        {activeTab === 'voting' && (
                            <VotingTabWrapper address={address} />
                        )}
                        {activeTab === 'contributions' && (
                            <ContributionsTabWrapper address={address} />
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

function EmptyState({ title, buttonText, buttonHref }: { title: string; buttonText: string; buttonHref: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-6">
                <Image 
                    src="/icons/notfound.svg" 
                    alt="Empty" 
                    width={180} 
                    height={160}
                />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
            <Link
                href={buttonHref}
                className="px-6 py-3 bg-deepGreen text-white rounded-xl font-semibold hover:bg-deepGreen/80 transition-colors"
            >
                {buttonText}
            </Link>
        </div>
    )
}

function ActivityTab({ address }: { address: string }) {
    const [hasActivities, setHasActivities] = useState<boolean | null>(null)

    useEffect(() => {
        const checkActivities = async () => {
            try {
                const response = await fetch(`/api/dashboard/activities?address=${address}&limit=1`)
                const data = await response.json()
                setHasActivities(data.success && data.activities.length > 0)
            } catch {
                setHasActivities(false)
            }
        }
        checkActivities()
    }, [address])

    if (hasActivities === null) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deepGreen"></div>
            </div>
        )
    }

    if (!hasActivities) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <EmptyState 
                    title="No activity" 
                    buttonText="Explore project"
                    buttonHref="/projects"
                />
            </div>
        )
    }

    return <ActivityList address={address} />
}

function ProjectsTab({ address }: { address: string }) {
    const [hasProjects, setHasProjects] = useState<boolean | null>(null)

    useEffect(() => {
        const checkProjects = async () => {
            try {
                const response = await fetch(`/api/dashboard/projects?address=${address}&limit=1`)
                const data = await response.json()
                setHasProjects(data.success && data.projects.length > 0)
            } catch {
                setHasProjects(false)
            }
        }
        checkProjects()
    }, [address])

    if (hasProjects === null) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deepGreen"></div>
            </div>
        )
    }

    if (!hasProjects) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <EmptyState 
                    title="You haven't created any projects yet!" 
                    buttonText="Create project"
                    buttonHref="/create"
                />
            </div>
        )
    }

    return <ProjectsCreatedTab address={address} />
}

function VotingTabWrapper({ address }: { address: string }) {
    const [hasVotes, setHasVotes] = useState<boolean | null>(null)

    useEffect(() => {
        const checkVotes = async () => {
            try {
                const response = await fetch(`/api/dashboard/voting?address=${address}&limit=1`)
                const data = await response.json()
                setHasVotes(data.success && data.votes.length > 0)
            } catch {
                setHasVotes(false)
            }
        }
        checkVotes()
    }, [address])

    if (hasVotes === null) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deepGreen"></div>
            </div>
        )
    }

    if (!hasVotes) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <EmptyState 
                    title="You haven't voted on any projects yet!" 
                    buttonText="Explore voting"
                    buttonHref="/votes"
                />
            </div>
        )
    }

    return <VotingTab address={address} />
}

function ContributionsTabWrapper({ address }: { address: string }) {
    const [hasContributions, setHasContributions] = useState<boolean | null>(null)

    useEffect(() => {
        const checkContributions = async () => {
            try {
                const response = await fetch(`/api/dashboard/contributions?address=${address}&limit=1`)
                const data = await response.json()
                setHasContributions(data.success && data.contributions.length > 0)
            } catch {
                setHasContributions(false)
            }
        }
        checkContributions()
    }, [address])

    if (hasContributions === null) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deepGreen"></div>
            </div>
        )
    }

    if (!hasContributions) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <EmptyState 
                    title="You haven't contributed to any projects yet!" 
                    buttonText="Fund a project"
                    buttonHref="/projects"
                />
            </div>
        )
    }

    return <ContributionsTab address={address} />
}
