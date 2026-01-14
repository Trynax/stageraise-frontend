"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

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

function getActionButton(activity: Activity) {
    switch (activity.type) {
        case 'funded':
        case 'withdrew':
        case 'refund_requested':
            return activity.txHash ? (
                <Link
                    href={`https://testnet.bscscan.com/tx/${activity.txHash}`}
                    target="_blank"
                    className="px-4 py-2 border border-dark rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                    View Transaction
                </Link>
            ) : null
        case 'voted':
        case 'project_created':
            return activity.project ? (
                <Link
                    href={`/projects/${activity.project.id}`}
                    className="px-4 py-2 border border-dark rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
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
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Recent Activity</h2>
                    <p className="text-gray-500 text-sm">All actions associated with your wallet</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterType(filterType ? '' : 'funded')}
                        className="flex items-center gap-2 px-4 py-2 border border-dark rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Image src="/icons/filter.svg" alt="Filter" width={16} height={16} />
                        <span className="text-sm">Filter</span>
                    </button>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        className="flex items-center gap-2 px-4 py-2 border border-dark rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-sm">{sortOrder === 'desc' ? 'New to Old' : 'Old to New'}</span>
                        <Image src="/icons/sort.svg" alt="Sort" width={16} height={16} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="border border-dark rounded-xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-dark font-semibold text-sm">
                    <div className="col-span-6">Event</div>
                    <div className="col-span-3 text-center">Time</div>
                    <div className="col-span-3 text-center">Action</div>
                </div>

                {/* Table Body */}
                {activities.map((activity) => {
                    const iconConfig = typeIcons[activity.type] || { icon: '/icons/coin.svg' }
                    
                    // Build display text with amount if applicable
                    let displayText = activity.title
                    if (activity.amount && activity.tokenSymbol) {
                        displayText += ` - ${activity.amount} ${activity.tokenSymbol}`
                    }
                    
                    return (
                        <div key={activity.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 items-center">
                            <div className="col-span-6 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0`}>
                                    <Image src={iconConfig.icon} alt={activity.type} width={30} height={30} />
                                </div>
                                <span className="text-sm">{displayText}</span>
                            </div>
                            <div className="col-span-3 text-center text-sm text-gray-500">
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
                <div className="flex justify-between items-center mt-6">
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
