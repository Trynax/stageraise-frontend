'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from "next/image";
import VoteCard from "@/components/projects/votecard";
import VotesFilter, { VotesFilterState } from '../filters/VotesFilter';

interface ActiveVoteItem {
    projectId: number
    milestoneStage: number
    projectName?: string
    description?: string
    votingEndTime?: string
    [key: string]: unknown
}

export function VotesList() {
    const [votes, setVotes] = useState<ActiveVoteItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('new');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Fetch active votes from API
    useEffect(() => {
        const fetchVotes = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/votes/active', { cache: 'no-store' });
                const data = await response.json();
                if (data.success) {
                    setVotes(data.activeVotes || []);
                }
            } catch (error) {
                console.error('Error fetching votes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVotes();
    }, []);

    const filteredVotes = useMemo(() => {
        let filtered = [...votes];

        if (searchQuery) {
            filtered = filtered.filter(vote =>
                vote.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vote.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.votingEndTime || 0).getTime();
            const dateB = new Date(b.votingEndTime || 0).getTime();
            return sortOrder === 'new' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [votes, searchQuery, sortOrder]);

    const handleApplyFilters = (filters: VotesFilterState) => {
        void filters
    };

    return (
        <section className="mx-auto px-4 md:px-32 py-10 bg-primary min-h-screen">
            <div className="flex items-center gap-4 mb-8 mx-auto">
               
                <button 
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 px-3 md:px-6 py-3 bg-primary border-2 border-gray-800 rounded-xl hover:bg-gray-100 transition-colors"
                >
                <Image src="/icons/filter.svg" alt="Filter Icon" width={20} height={20} />
                    <span className="font-semibold hidden md:block">Filter</span>
                </button>


                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search Projects"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    />
                </div>

       
                <div className="relative">
                    <button 
                        className="flex items-center gap-3 px-3 md:px-6 py-3 bg-white border-2 border-gray-800 rounded-xl hover:bg-gray-50 transition-colors md:min-w-[180px] justify-between"
                        onClick={() => setSortOrder(sortOrder === 'new' ? 'old' : 'new')}
                    >
                        <span className="font-semibold hidden md:block">
                            {sortOrder === 'new' ? 'New to Old' : 'Old to New'}
                        </span>
                        <Image src="/icons/sort.svg" alt="Sort Icon" width={20} height={20} />
                    </button>
                </div>
            </div>

            {searchQuery && (
                <div className="">
                    <p className="text-dark text-lg">
                        {filteredVotes.length} Result{filteredVotes.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
                    </p>
                </div>
            )}

            {loading ? (
                <div className="mt-12 flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
                </div>
            ) : (
                <>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mx-auto">
                        {filteredVotes.length > 0 ? (
                            filteredVotes.map((vote) => (
                                <VoteCard
                                    key={`${vote.projectId}-${vote.milestoneStage}`}
                                    vote={{
                                        ...vote,
                                        id: `${vote.projectId}-${vote.milestoneStage}`,
                                    }}
                                    fromPage="explore"
                                />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20">
                                <Image src="/images/notfound.svg" alt="No results found" width={200} height={200} className="mb-6 opacity-60" />
                                <h3 className="text-2xl font-semibold mb-2">No Active Votes</h3>
                                <p className="text-gray-600">Check back later for new voting sessions</p>
                            </div>
                        )}
                    </div>

                    {filteredVotes.length > 0 && (
                        <div className="text-center mt-12">
                            <button className="inline-flex items-center justify-center gap-2 text-lg font-semibold group">
                                Load More
                                <svg className="w-5 h-5 translate-y-1 transition-transform group-hover:translate-y-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 2l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </>
            )}

           <VotesFilter 
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleApplyFilters}
           />
        </section>
    );
}
