"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/sections/footer"

export default function VoteDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const voteId = params.id as string // Format: "projectId-milestoneStage" e.g., "3-2"
  const [voteData, setVoteData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userVote, setUserVote] = useState<'yes' | 'no' | null>(null)
  
  // Get referrer from URL params (from=project or from=explore)
  const fromPage = searchParams.get('from') || 'project'

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        // Parse the composite ID
        const [projectId, milestoneStage] = voteId.split('-')
        
        // Fetch mock data for now
        if (projectId && milestoneStage) {
          const { getMockProject } = await import('@/lib/mockProjectDetail')
          
          // Determine which mock project to use based on projectId
          const scenarios: Record<string, 'funding' | 'completed' | 'withVotingHistory' | 'failedRefund'> = {
            '1': 'funding',
            '2': 'completed',
            '3': 'withVotingHistory',
            '4': 'failedRefund'
          }
          
          const project = getMockProject(scenarios[projectId] || 'withVotingHistory') as any
          
          // Find the specific vote from voting history
          const vote = project.votingHistory?.find(
            (v: any) => v.stage === parseInt(milestoneStage)
          )
          
          // Find the milestone details
          const milestone = project.milestones?.find(
            (m: any) => m.stage === parseInt(milestoneStage)
          )
          
          if (vote && milestone) {
            setVoteData({
              ...vote,
              milestone,
              projectTitle: project.tagline,
              projectImage: project.logoUrl,
              projectId: project.id,
              totalMilestones: project.milestones?.length || 0,
              totalFunders: project.cachedTotalContributors || 0,
              failedVotingCount: project.failedVotingCount || 0,
              status: project.status
            })
          }
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching vote data:', error)
        setLoading(false)
      }
    }

    fetchVoteData()
  }, [voteId])

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-primary">
          {/* Breadcrumb */}
          <div className="bg-secondary py-3 px-6 mt-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 text-sm">
                <a 
                  href={fromPage === 'explore' ? '/votes' : '/projects'} 
                  className="hover:underline"
                >
                  {fromPage === 'explore' ? 'Explore page' : 'Project page'}
                </a>
                <span>›</span>
                <span className="font-semibold">Voting details</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark mx-auto mb-4"></div>
              <p className="text-lg font-semibold">Loading vote details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!voteData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-primary">
          {/* Breadcrumb */}
          <div className="bg-secondary py-3 px-6 mt-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 text-sm">
                <a 
                  href={fromPage === 'explore' ? '/votes' : '/projects'} 
                  className="hover:underline"
                >
                  {fromPage === 'explore' ? 'Explore page' : 'Project page'}
                </a>
                <span>›</span>
                <span className="font-semibold">Voting details</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600 mb-4">Vote not found</p>
              <a href="/votes" className="text-deepGreen hover:underline">
                Back to voting page
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const isVotingLive = voteData.result === 'ongoing'
  const yesPercentage = voteData.totalVoters > 0 
    ? Math.round((voteData.yesVotes / voteData.totalVoters) * 100) 
    : 0
  const noPercentage = voteData.totalVoters > 0 
    ? Math.round((voteData.noVotes / voteData.totalVoters) * 100) 
    : 0

  const handleVote = (vote: 'yes' | 'no') => {
    // TODO: Integrate with smart contract
    setUserVote(vote)
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-primary">
        <div className="bg-secondary py-4 px-4 md:px-32 mt-18">
          <div className="mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <a 
                href={fromPage === 'explore' ? '/votes' : `/projects/${voteData?.projectId}`} 
                className="text-[#475467] text-xs"
              >
                {fromPage === 'explore' ? 'Explore page' : 'Project page'}
              </a>
              <span>›</span>
              <span className="text-sm">Voting details</span>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-32 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
            <div className="lg:col-span-2 space-y-6">
              <div className="border-2 border-dark rounded-2xl">
               <div className="px-3 py-2 bg-secondary rounded-t-2xl">
                 <h2 className="text-lg font-semibold">Milestone Objective</h2>
               </div>
                
                <div className="px-3 py-4">
                  <div className="flex items-start gap-3">
                  <h3 className="text-xl font-bold mb-2">{voteData.projectTitle}</h3>
                  <span className="px-2 py-1 bg-[#EAECF0] text-dark border border-dark rounded-full text-sm font-medium whitespace-nowrap">
                    {voteData.milestone.stage}/{voteData.totalMilestones} Milestone {
                      voteData.result === 'passed' ? 'Completed' :
                      voteData.result === 'failed' ? 'Failed' :
                      'In Progress'
                    }
                  </span>
                </div>
                <p className="text-dark text-sm leading-relaxed mb-4">
                  {voteData.milestone.description}
                </p>

          
                {voteData.milestone.proofDocuments && voteData.milestone.proofDocuments.length > 0 && (
                  <div className="flex gap-2">
                    {voteData.milestone.proofDocuments.slice(0, 3).map((doc: string, idx: number) => (
                      <div key={idx} className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0 border-2 border-dark">
                        <Image
                          src={doc}
                          alt={`Proof ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>

           
              <div className="border-2 border-dark rounded-2xl">
               <div className="px-3 py-2 bg-secondary rounded-t-2xl">
                 <h2 className="text-lg font-semibold">Proof of Achievement</h2>
               </div>
                
               <div className="px-3 py-4">
                 <p className="text-dark text-sm leading-relaxed mb-4">
                  {voteData.milestone.deliverables || 'No deliverables specified'}
                </p>
                {voteData.milestone.proofDocuments && voteData.milestone.proofDocuments.length > 0 && (
                  <div className="flex gap-2">
                    {voteData.milestone.proofDocuments.map((doc: string, idx: number) => (
                      <div key={idx} className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0 border-2 border-dark">
                        <Image
                          src={doc}
                          alt={`Proof ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
               </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-dark rounded-2xl p-6 sticky top-6">

                {isVotingLive && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      Live voting
                    </span>
                  </div>
                )}


                <div className="mb-4">
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-green-600">YES {yesPercentage}%</span>
                    <span className="text-red-600">NO {noPercentage}%</span>
                  </div>
                  
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border border-dark flex">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${yesPercentage}%` }}
                    />
                    <div 
                      className="h-full bg-red-500"
                      style={{ width: `${noPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Voting Question */}
                <p className="text-sm font-medium mb-4">
                  Do you agree with the completion of {voteData.milestone.title} for Milestone {voteData.milestone.stage} of the project
                </p>


                {isVotingLive ? (
                  userVote ? (
                    <div className={`w-full py-4 rounded-xl font-semibold text-center mb-4 ${
                      userVote === 'yes' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      You vote {userVote === 'yes' ? 'YES' : 'NO'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        onClick={() => handleVote('no')}
                        className="py-3 border-2 border-dark rounded-xl font-semibold hover:bg-red-50 transition-colors"
                      >
                        No
                      </button>
                      <button
                        onClick={() => handleVote('yes')}
                        className="py-3 bg-secondary border-2 border-dark rounded-xl font-semibold hover:bg-opacity-80 transition-colors"
                      >
                        Yes
                      </button>
                    </div>
                  )
                ) : (
                  <div className={`w-full py-4 rounded-xl font-semibold text-center mb-4 ${
                    voteData.result === 'passed' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    Vote Ended
                  </div>
                )}

          
                {!isVotingLive && (
                  <div className="bg-primary border border-dark rounded-xl p-3 mb-4">
                    <p className="text-xs text-dark leading-relaxed">
                      {voteData.result === 'passed' 
                        ? "This milestone met the required approval threshold. Funds have been released and project progression continues."
                        : voteData.failedVotingCount >= 3 && voteData.status === 'refundable'
                        ? "After three failed attempts, the project is marked as failed and remaining funds become refundable to funders"
                        : "This milestone did not meet the required approval threshold. The creator may resubmit for another vote."
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
