

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import VoteCard from "@/components/projects/votecard"

export function VoteSection(){
    const [votes, setVotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveVotes = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/votes/active?limit=6');
                const data = await response.json();
                if (data.success) {
                    setVotes(data.activeVotes || []);
                }
            } catch (error) {
                console.error('Error fetching active votes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchActiveVotes();
    }, []);

    const filteredVotes = votes;

    return (
        <section className="py-10 bg-primary">
            <h1 className="text-4xl md:text-5xl font-bold text-center">Live Voting Rounds <span className="text-secondary" style={{ 
                            WebkitTextStroke: '2px black',
                            paintOrder: 'stroke fill'
            }}>Powered by the Community</span></h1>

            {loading ? (
                <div className="mt-12 flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
                </div>
            ) : filteredVotes.length > 0 ? (
                <>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-8 lg:px-32">
                        {filteredVotes.slice(0, 6).map((vote) => (
                            <VoteCard key={`${vote.projectId}-${vote.milestoneStage}`} vote={vote} fromPage="explore" />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/votes" className="inline-flex items-center gap-2 text-lg font-semibold hover:gap-4 transition-all">
                            Explore all votes 
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </>
            ) : (
                <div className="mt-12 max-w-2xl mx-auto">
                    <div className="bg-primary rounded-3xl p-12 text-center">
                        <div className="mb-6">
                            <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">No Active Voting Sessions</h3>
                        <p className="text-gray-600 mb-6">
                            There are currently no milestone voting rounds in progress. Project creators must submit proof of milestone completion to initiate voting.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link 
                                href="/projects" 
                                className="inline-block bg-secondary text-dark font-semibold px-6 py-3 rounded-2xl hover:scale-105 transition-transform"
                            >
                                Browse Projects
                            </Link>
                            <Link 
                                href="/votes" 
                                className="inline-block bg-white text-dark font-semibold px-6 py-3 rounded-2xl border border-dark hover:bg-gray-50 transition-colors"
                            >
                                Past Votes
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}