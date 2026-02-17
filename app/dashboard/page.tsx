"use client"

import { useState, useEffect } from "react"
import { useAccount, useDisconnect, useReconnect } from "wagmi"
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
    const { reconnectAsync, isPending: isReconnectPending } = useReconnect()
    const { disconnect } = useDisconnect()
    const router = useRouter()
    const [authChecked, setAuthChecked] = useState(false)
    const [activeTab, setActiveTab] = useState<TabType>('activity')
    const [stats, setStats] = useState({
        fundingReceived: 0,
        amountFunded: 0,
        projectsFunded: 0,
        projectsCreated: 0
    })
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        let cancelled = false

        const runReconnectCheck = async () => {
            try {
                await reconnectAsync()
            } catch {
                // Ignore reconnect errors and fall back to redirect logic.
            } finally {
                if (!cancelled) setAuthChecked(true)
            }
        }

        runReconnectCheck()

        return () => {
            cancelled = true
        }
    }, [reconnectAsync])

    useEffect(() => {
        if (!authChecked) return
        if (!isConnecting && !isReconnecting && !isReconnectPending && !isConnected) {
            router.replace('/')
        }
    }, [authChecked, isConnected, isConnecting, isReconnecting, isReconnectPending, router])

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

    if (!authChecked || isConnecting || isReconnecting || isReconnectPending) {
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
                        <div className="flex flex-col gap-2 lg:gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="w-full flex flex-nowrap items-center gap-2 sm:gap-3 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                                    <Image src="/icons/profile.svg" alt="Profile" width={48} height={48} />
                                </div>
                                <span className="font-mono text-base sm:text-lg font-semibold">{formatAddress(address)}</span>
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
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-dark rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <span className="hidden sm:inline text-sm">Disconnect</span>
                                    <Image src="/icons/disconnect.svg" alt="Disconnect" width={16} height={16} />
                                </button>
                            </div>

  
                            <div className="w-full flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                <div className="text-center min-w-[150px] shrink-0">
                                    <p className="text-sm text-gray-500">Funding Received</p>
                                    <p className="text-xl font-bold">{formatCurrency(stats.fundingReceived)}</p>
                                </div>
                                <div className="text-center min-w-[150px] shrink-0">
                                    <p className="text-sm text-gray-500">Amount Funded</p>
                                    <p className="text-xl font-bold">{formatCurrency(stats.amountFunded)}</p>
                                </div>
                                <div className="text-center min-w-[150px] shrink-0">
                                    <p className="text-sm text-gray-500">Project Funded</p>
                                    <p className="text-xl font-bold">{stats.projectsFunded}</p>
                                </div>
                                <div className="text-center min-w-[150px] shrink-0">
                                    <p className="text-sm text-gray-500">Project Created</p>
                                    <p className="text-xl font-bold">{stats.projectsCreated}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 bg-white border border-dark rounded-xl p-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <div className="flex w-max min-w-full gap-1 md:gap-0">
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`shrink-0 whitespace-nowrap px-3 py-2 text-sm md:text-base font-semibold transition-all rounded-xl md:flex-1 ${
                                activeTab === 'activity'
                                    ? 'bg-secondary text-dark'
                                    : 'bg-white text-dark hover:bg-gray-50'
                            }`}
                        >
                            Activity
                        </button>
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`shrink-0 whitespace-nowrap px-3 py-2 text-sm md:text-base font-semibold transition-all rounded-xl md:flex-1 ${
                                activeTab === 'projects'
                                    ? 'bg-secondary text-dark'
                                    : 'bg-white text-dark hover:bg-gray-50'
                            }`}
                        >
                            Projects created
                        </button>
                        <button
                            onClick={() => setActiveTab('voting')}
                            className={`shrink-0 whitespace-nowrap px-3 py-2 text-sm md:text-base font-semibold transition-all rounded-xl md:flex-1 ${
                                activeTab === 'voting'
                                    ? 'bg-secondary text-dark'
                                    : 'bg-white text-dark hover:bg-gray-50'
                            }`}
                        >
                            Voting
                        </button>
                        <button
                            onClick={() => setActiveTab('contributions')}
                            className={`shrink-0 whitespace-nowrap px-3 py-2 text-sm md:text-base font-semibold transition-all rounded-xl md:flex-1 ${
                                activeTab === 'contributions'
                                    ? 'bg-secondary text-dark'
                                    : 'bg-white text-dark hover:bg-gray-50'
                            }`}
                        >
                            Contributions
                        </button>
                        </div>
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
