"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getExplorerTxBaseUrl } from "@/lib/contracts/network"

interface Activity {
    id: string
    type: 'funded' | 'voted' | 'withdrew' | 'refund_requested' | 'project_created'
    title: string
    amount: number | null
    tokenSymbol: string | null
    txHash: string | null
    createdAt: string
    project: {
        id: string
        name: string
        logoUrl: string | null
        projectId: number
        chainId: number
    } | null
}

interface ActivityListProps {
    address: string
}

const typeIcons: Record<string, { icon: string;}> = {
    funded: { icon: '/icons/fundedicon.svg' },
    voted: { icon: '/icons/votesicon.svg' },
    withdrew: { icon: '/icons/withdrawicon.svg' },
    refund_requested: { icon: '/icons/refundicon.svg' },
    project_created: { icon: '/icons/projectcreatedicon.svg' }
}

function formatTimeAgo(date: string): string {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}min ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return then.toLocaleDateString()
}

function formatActivityMeta(activity: Activity): string {
    if (activity.amount !== null && activity.tokenSymbol) {
        return `${formatTokenAmount(activity.amount)} ${activity.tokenSymbol}`
    }
    return activity.type.replace(/_/g, " ")
}

function formatAmountDisplay(activity: Activity): string {
    if (activity.amount !== null && activity.tokenSymbol) {
        return `${formatTokenAmount(activity.amount)} ${activity.tokenSymbol}`
    }
    return "-------------"
}

function formatActivityTitle(activity: Activity): string {
    if (activity.amount !== null && activity.tokenSymbol) {
        return `${activity.title} - ${formatTokenAmount(activity.amount)} ${activity.tokenSymbol}`
    }
    return activity.title
}

function formatTokenAmount(amount: number): string {
    if (!Number.isFinite(amount)) return "0"
    if (amount === 0) return "0"
    if (Math.abs(amount) < 0.000001) return "<0.000001"
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
        notation: "standard"
    }).format(amount)
}

function getActionButton(activity: Activity, fullWidth = false) {
    const buttonClass = `px-4 py-2 border border-dark rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium ${fullWidth ? "w-full flex justify-center" : "inline-flex"}`

    switch (activity.type) {
        case 'funded':
        case 'withdrew':
        case 'refund_requested':
            return activity.txHash ? (
                <Link
                    href={`${getExplorerTxBaseUrl(activity.project?.chainId)}${activity.txHash}`}
                    target="_blank"
                    className={buttonClass}
                >
                    View Transaction
                </Link>
            ) : null
        case 'voted':
        case 'project_created':
            return activity.project ? (
                <Link
                    href={`/projects/${activity.project.id}`}
                    className={buttonClass}
                >
                    View Project
                </Link>
            ) : null
        default:
            return null
    }
}

export function ActivityList({ address }: ActivityListProps) {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
    const [filterType, setFilterType] = useState<string>('')

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true)
            try {
                let url = `/api/dashboard/activities?address=${address}&page=${page}&limit=10&sort=${sortOrder}`
                if (filterType) url += `&type=${filterType}`
                
                const response = await fetch(url)
                const data = await response.json()
                
                if (data.success) {
                    setActivities(data.activities)
                    setTotalPages(data.pagination.totalPages)
                }
            } catch (error) {
                console.error('Error fetching activities:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchActivities()
    }, [address, page, sortOrder, filterType])

    if (loading && activities.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deepGreen"></div>
            </div>
        )
    }

    if (activities.length === 0) {
        return null 
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Recent Activity</h2>
                    <p className="text-gray-500 text-sm">All actions associated with your wallet</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setFilterType(filterType ? '' : 'funded')}
                        className="flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2 border border-dark rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                        <Image src="/icons/filter.svg" alt="Filter" width={16} height={16} />
                        <span className="text-sm">Filter</span>
                    </button>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        className="flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2 border border-dark rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                        <span className="text-sm">{sortOrder === 'desc' ? 'New to Old' : 'Old to New'}</span>
                        <Image src="/icons/sort.svg" alt="Sort" width={16} height={16} />
                    </button>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {activities.map((activity) => {
                    const iconConfig = typeIcons[activity.type] || { icon: '/icons/coin.svg' }
                    const displayText = formatActivityTitle(activity)

                    return (
                        <div key={activity.id} className="border border-dark rounded-xl bg-white p-4">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0">
                                    <Image src={iconConfig.icon} alt={activity.type} width={32} height={32} />
                                </div>
                                <p className="text-base font-semibold leading-tight">{displayText}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 mb-1">Time</p>
                                    <p className="text-sm font-semibold">{formatTimeAgo(activity.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 mb-1">Details</p>
                                    <p className="text-sm font-semibold">{formatActivityMeta(activity)}</p>
                                </div>
                            </div>

                            {getActionButton(activity, true)}
                        </div>
                    )
                })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block border border-dark rounded-xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-dark font-semibold text-sm">
                    <div className="col-span-5">Event</div>
                    <div className="col-span-2 text-center">Amount</div>
                    <div className="col-span-2 text-center">Time</div>
                    <div className="col-span-3 text-center">Action</div>
                </div>

                {/* Table Body */}
                {activities.map((activity) => {
                    const iconConfig = typeIcons[activity.type] || { icon: '/icons/coin.svg' }
                    const displayText = formatActivityTitle(activity)
                    
                    return (
                        <div key={activity.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 items-center">
                            <div className="col-span-5 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0`}>
                                    <Image src={iconConfig.icon} alt={activity.type} width={30} height={30} />
                                </div>
                                <span className="text-sm">{displayText}</span>
                            </div>
                            <div className="col-span-2 text-center text-sm">
                                {formatAmountDisplay(activity)}
                            </div>
                            <div className="col-span-2 text-center text-sm text-gray-500">
                                {formatTimeAgo(activity.createdAt)}
                            </div>
                            <div className="col-span-3 flex justify-center">
                                {getActionButton(activity)}
                            </div>
                        </div>
                    )
                })}
            </div>

           
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-full sm:w-auto px-4 py-2 border border-dark rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="w-full sm:w-auto px-4 py-2 border border-dark rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}
