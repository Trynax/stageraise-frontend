"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/sections/footer"
import { useAccount, useChainId } from "wagmi"
import { useVoteWithSync, useContributorAmount, useHasVoted } from "@/lib/contracts/hooks"
import TransactionModal, { TransactionStatus } from "@/components/ui/TransactionModal"

type VoteResult = "ongoing" | "passed" | "failed"

interface ProofMediaItem {
  url: string
  filename?: string
  mediaType: "image" | "video"
}

interface ApiVotingHistoryItem {
  stage: number
  result: VoteResult
  yesVotes: number
  noVotes: number
  totalVoters: number
  votingStarted?: string | null
  votingEnded?: string | null
  isActive?: boolean
  proofSummary?: string | null
  proofDocuments?: ProofMediaItem[]
  userHasVoted?: boolean
  userVote?: "yes" | "no" | null
}

interface ApiMilestone {
  stage: number
  title: string
  description: string
  deliverables?: string | string[] | null
  proofDocuments?: Array<string | { url?: string }> | null
}

interface ApiProject {
  name: string
  logoUrl?: string | null
  projectId: number
  milestones?: ApiMilestone[]
  votingHistory?: ApiVotingHistoryItem[]
  cachedTotalContributors?: number | null
  failedVotingCount?: number | null
  status?: string | null
}

interface ApiActiveVotingResponse {
  success?: boolean
  isOpen?: boolean
  voting?: {
    milestoneStage: number
    votingEndTime: string
    votesForYes: string
    votesForNo: string
    totalVoters: number
    proofSummary?: string | null
    proofDocuments?: ProofMediaItem[]
    voters?: Array<{
      address: string
      voteYes: boolean
    }>
  }
}

interface VoteDetailMilestone {
  stage: number
  title: string
  description: string
  deliverables: string
  proofDocuments: string[]
}

interface VoteDetail {
  stage: number
  result: VoteResult
  yesVotes: number
  noVotes: number
  totalVoters: number
  votingEnded: string
  proofSummary?: string | null
  proofDocuments: ProofMediaItem[]
  milestone: VoteDetailMilestone
  projectTitle: string
  projectImage: string
  projectId: number
  totalMilestones: number
  totalFunders: number
  failedVotingCount: number
  status: string | null
}

function normalizeProofDocuments(
  proofDocuments?: Array<string | { url?: string }> | null
): string[] {
  if (!proofDocuments || proofDocuments.length === 0) return []

  return proofDocuments
    .map((doc) => {
      if (typeof doc === "string") return doc
      if (typeof doc?.url === "string") return doc.url
      return ""
    })
    .filter((doc): doc is string => Boolean(doc))
}

function normalizeVoteProofDocuments(
  proofDocuments?: ProofMediaItem[] | null
): ProofMediaItem[] {
  if (!proofDocuments || proofDocuments.length === 0) return []

  return proofDocuments
    .filter((doc) => doc && typeof doc.url === "string" && doc.url.length > 0)
    .map((doc) => ({
      url: doc.url,
      filename: doc.filename || "proof",
      mediaType: doc.mediaType === "video" ? "video" : "image",
    }))
}

function normalizeDeliverables(deliverables?: string | string[] | null): string {
  if (!deliverables) return ""
  if (Array.isArray(deliverables)) return deliverables.join(", ")
  return deliverables
}

export default function VoteDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { address } = useAccount()
  const connectedAddress = address as `0x${string}` | undefined
  const chainId = useChainId()
  const voteId = params.id as string // Format: "projectId-milestoneStage" e.g., "3-2"
  const [voteData, setVoteData] = useState<VoteDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [userVote, setUserVote] = useState<'yes' | 'no' | null>(null)
  const [showTxModal, setShowTxModal] = useState(false)
  const [txError, setTxError] = useState<string | undefined>()
  const [pendingVoteChoice, setPendingVoteChoice] = useState<'yes' | 'no' | null>(null)
  const processedHashRef = useRef<string | null>(null)
  const { vote: submitVote, isPending, isConfirming, isSuccess, hash, error, syncVote } = useVoteWithSync()
  const { hasVoted } = useHasVoted(voteData?.projectId ?? 0, connectedAddress, chainId)
  const { contributorAmount } = useContributorAmount(
    voteData?.projectId ?? 0,
    connectedAddress,
    chainId
  )
  const hasContributorAmount = typeof contributorAmount === "bigint"
  const isNonFunder = Boolean(address) && hasContributorAmount && contributorAmount <= BigInt(0)
  const hasVotedOnChain = Boolean(hasVoted)
  const voteDisabledReason = !address
    ? "Connect wallet to vote."
    : isNonFunder
      ? "You are not a funder of this project and cannot vote."
      : hasVotedOnChain
        ? "You already voted in this round."
      : undefined
  const isVoteInteractionDisabled = isPending || isConfirming || hasVotedOnChain || Boolean(voteDisabledReason)
  const hookErrorMessage =
    typeof (error as { shortMessage?: string } | undefined)?.shortMessage === "string"
      ? (error as { shortMessage: string }).shortMessage
      : error?.message
  const resolvedTxError = txError || hookErrorMessage
  const txStatus: TransactionStatus = resolvedTxError
    ? "error"
    : isSuccess
      ? "success"
      : isConfirming
        ? "confirming"
        : "pending"
  
  // Get referrer from URL params (from=project or from=explore)
  const fromPage = searchParams.get('from') || 'project'

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        setUserVote(null)
     
        const [projectId, milestoneStage] = voteId.split('-')
        
        if (projectId && milestoneStage) {
          // Fetch project from API
          const voterQuery = address ? `?voter=${address}` : ""
          const response = await fetch(`/api/projects/${projectId}${voterQuery}`, { cache: 'no-store' })
          const data = (await response.json()) as { success?: boolean; project?: ApiProject }
          
          if (data.success && data.project) {
            const project = data.project
            const parsedStage = parseInt(milestoneStage, 10)
            
            // Find the specific vote from voting history
            const stageVotes = (project.votingHistory || []).filter(
              (v) => v.stage === parsedStage
            )
            const vote = stageVotes.find((v) => v.result === "ongoing" || v.isActive) || stageVotes[0]
            
            // Find the milestone details
            const milestone = project.milestones?.find(
              (m) => m.stage === parsedStage
            )
            
            if (vote && milestone) {
              if (vote.userVote === "yes" || vote.userVote === "no") {
                setUserVote(vote.userVote)
              }
              setVoteData({
                ...vote,
                votingEnded: vote.votingEnded || vote.votingStarted || new Date().toISOString(),
                proofSummary: vote.proofSummary || null,
                proofDocuments: normalizeVoteProofDocuments(vote.proofDocuments),
                milestone: {
                  ...milestone,
                  deliverables: normalizeDeliverables(milestone.deliverables),
                  proofDocuments: normalizeProofDocuments(milestone.proofDocuments),
                },
                projectTitle: project.name,
                projectImage: project.logoUrl || "",
                projectId: project.projectId,
                totalMilestones: project.milestones?.length || 0,
                totalFunders: project.cachedTotalContributors || 0,
                failedVotingCount: project.failedVotingCount || 0,
                status: project.status || null,
              })
              setLoading(false)
              return
            }

            // Fallback for currently active votes that may not yet exist in votingHistory.
            const activeVotingResponse = await fetch(`/api/projects/${projectId}/voting/active`, { cache: 'no-store' })
            const activeVotingData = (await activeVotingResponse.json()) as ApiActiveVotingResponse

            if (
              activeVotingData.success &&
              activeVotingData.isOpen &&
              activeVotingData.voting &&
              activeVotingData.voting.milestoneStage === parsedStage &&
              milestone
            ) {
              const normalizedAddress = address?.toLowerCase()
              const persistedVote = normalizedAddress
                ? activeVotingData.voting.voters?.find((entry) => entry.address.toLowerCase() === normalizedAddress)
                : undefined
              if (persistedVote) {
                setUserVote(persistedVote.voteYes ? "yes" : "no")
              }
              const yesVotes = Number(activeVotingData.voting.votesForYes || 0)
              const noVotes = Number(activeVotingData.voting.votesForNo || 0)

              setVoteData({
                stage: parsedStage,
                result: "ongoing",
                yesVotes,
                noVotes,
                totalVoters: yesVotes + noVotes,
                votingEnded: activeVotingData.voting.votingEndTime,
                proofSummary: activeVotingData.voting.proofSummary || null,
                proofDocuments: normalizeVoteProofDocuments(activeVotingData.voting.proofDocuments),
                milestone: {
                  ...milestone,
                  deliverables: normalizeDeliverables(milestone.deliverables),
                  proofDocuments: normalizeProofDocuments(milestone.proofDocuments),
                },
                projectTitle: project.name,
                projectImage: project.logoUrl || "",
                projectId: project.projectId,
                totalMilestones: project.milestones?.length || 0,
                totalFunders: project.cachedTotalContributors || 0,
                failedVotingCount: project.failedVotingCount || 0,
                status: project.status || null,
              })
              setLoading(false)
              return
            }
          }
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching vote data:', error)
        setLoading(false)
      }
    }

    fetchVoteData()
  }, [voteId, address])

  const handleVote = (voteChoice: 'yes' | 'no') => {
    if (!voteData || !address || isNonFunder || hasVotedOnChain) return

    try {
      setPendingVoteChoice(voteChoice)
      setTxError(undefined)
      setShowTxModal(true)
      submitVote(voteData.projectId, voteChoice === "yes", chainId)
    } catch (submitError: unknown) {
      const message =
        submitError && typeof submitError === "object" && "message" in submitError
          ? String((submitError as { message?: string }).message)
          : "Failed to submit vote"
      setTxError(message)
      setShowTxModal(true)
    }
  }

  useEffect(() => {
    if (!isSuccess || !hash) return
    if (processedHashRef.current === hash) return
    processedHashRef.current = hash

    if (pendingVoteChoice) {
      setTimeout(() => {
        setUserVote(pendingVoteChoice)
        setVoteData((prev) => {
          if (!prev) return prev
          const yesIncrement = pendingVoteChoice === "yes" ? 1 : 0
          const noIncrement = pendingVoteChoice === "no" ? 1 : 0
          return {
            ...prev,
            yesVotes: prev.yesVotes + yesIncrement,
            noVotes: prev.noVotes + noIncrement,
            totalVoters: prev.totalVoters + 1,
          }
        })
        setPendingVoteChoice(null)
      }, 0)
    }

    void (async () => {
      try {
        await syncVote(hash, chainId)
      } catch (syncError) {
        console.error("Failed to sync vote:", syncError)
      }
    })()
  }, [isSuccess, hash, pendingVoteChoice, syncVote, chainId])

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-primary">
          {/* Breadcrumb */}
          <div className="bg-secondary py-3 px-6 mt-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 text-sm">
                <Link
                  href={fromPage === 'explore' ? '/votes' : '/projects'} 
                  className="hover:underline"
                >
                  {fromPage === 'explore' ? 'Explore page' : 'Project page'}
                </Link>
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
                <Link
                  href={fromPage === 'explore' ? '/votes' : '/projects'} 
                  className="hover:underline"
                >
                  {fromPage === 'explore' ? 'Explore page' : 'Project page'}
                </Link>
                <span>›</span>
                <span className="font-semibold">Voting details</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600 mb-4">Vote not found</p>
              <Link href="/votes" className="text-deepGreen hover:underline">
                Back to voting page
              </Link>
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-primary">
        <div className="bg-secondary py-4 px-4 md:px-32 mt-18">
          <div className="mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Link
                href={fromPage === 'explore' ? '/votes' : `/projects/${voteData?.projectId}`} 
                className="text-[#475467] text-xs"
              >
                {fromPage === 'explore' ? 'Explore page' : 'Project page'}
              </Link>
              <span>›</span>
              <span className="text-sm">Voting details</span>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-32 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
            <div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
              <div className="border-2 border-dark rounded-2xl">
               <div className="px-3 py-2 bg-secondary rounded-t-2xl">
                 <h2 className="text-lg font-semibold">Milestone Objective</h2>
               </div>
                
                <div className="px-3 py-4">
                  <div className="flex items-start gap-3">
                  <h3 className="text-xl font-bold mb-2">{voteData.projectTitle}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    voteData.result === 'passed' ? 'bg-[#3A9E1B]/10 text-[#3A9E1B] border border-[#3A9E1B]' :
                    voteData.result === 'failed' ? 'bg-red-100 text-red-700 border border-red-500' :
                    'bg-[#DC6803]/10 text-[#DC6803] border border-[#DC6803]'
                  }`}>
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {voteData.milestone.proofDocuments.slice(0, 3).map((doc: string, idx: number) => (
                      <div key={idx} className="relative aspect-square w-full rounded-xl overflow-hidden border-2 border-dark">
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
                  {voteData.proofSummary || voteData.milestone.deliverables || 'No proof summary provided'}
                </p>
                {voteData.proofDocuments && voteData.proofDocuments.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {voteData.proofDocuments.map((doc, idx) => (
                      <div key={`${doc.url}-${idx}`} className="relative aspect-square w-full rounded-xl overflow-hidden border-2 border-dark">
                        {doc.mediaType === "video" ? (
                          <video
                            src={doc.url}
                            controls
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Image
                            src={doc.url}
                            alt={doc.filename || `Proof ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  voteData.milestone.proofDocuments && voteData.milestone.proofDocuments.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {voteData.milestone.proofDocuments.map((doc: string, idx: number) => (
                        <div key={idx} className="relative aspect-square w-full rounded-xl overflow-hidden border-2 border-dark">
                          <Image
                            src={doc}
                            alt={`Proof ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )
                )}
               </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-1">
              <div className="space-y-4 lg:sticky lg:top-6">
                <div className="bg-white border-2 border-dark rounded-2xl p-6">

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
                  userVote || hasVotedOnChain ? (
                    <div className={`w-full py-4 rounded-xl font-semibold text-center mb-4 ${
                      userVote === 'yes' 
                        ? 'bg-green-500 text-white' 
                        : userVote === 'no'
                          ? 'bg-red-500 text-white'
                          : 'bg-[#EAECF0] text-dark border border-dark'
                    }`}>
                      {userVote ? `You voted ${userVote === 'yes' ? 'YES' : 'NO'}` : 'You have already voted'}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div title={voteDisabledReason}>
                        <button
                          onClick={() => handleVote('no')}
                          disabled={isVoteInteractionDisabled}
                          className="py-3 border bg-[#FEE4E2] border-[#D92D20] rounded-lg font-semibold text-[#D92D20] w-full"
                        >
                          {!address ? "Connect Wallet" : "No"}
                        </button>
                      </div>
                      <div title={voteDisabledReason}>
                        <button
                          onClick={() => handleVote('yes')}
                          disabled={isVoteInteractionDisabled}
                          className="py-3 border bg-[#E5FBDD] border-[#3A9E1B] rounded-lg font-semibold text-[#3A9E1B] w-full"
                        >
                          {!address ? "Connect Wallet" : "Yes"}
                        </button>
                      </div>
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
                <p className="p-2 bg-[#FFFAEB] border border-[#DC6803] text-[#DC6803] rounded-lg text-left text-sm">
                  Note: This vote governs the continuation of the project and the release of locked funds.
                  We recommend reviewing the milestone objectives, expected achievements, and submitted proof before participating.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TransactionModal
        isOpen={showTxModal}
        type="voting"
        status={txStatus}
        hash={hash}
        error={resolvedTxError}
        onClose={() => {
          setShowTxModal(false)
          setTxError(undefined)
        }}
        chainId={chainId}
      />
      <Footer />
    </>
  )
}
