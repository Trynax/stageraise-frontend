"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { SetupMilestoneVoteModal } from "@/components/project/SetupMilestoneVoteModal"

interface ProofDocument {
  cid: string
  url: string
  filename: string
}

interface Milestone {
  id: string
  stage: number
  title: string
  description: string
  deliverables?: string | string[]
  proofDocuments?: ProofDocument[]
}

interface MilestoneTabProps {
  milestones: Milestone[]
  currentMilestone: number
  projectId?: string | number
  contractProjectId?: number
  projectTitle?: string
  failedVotingCount?: number
  isFundingPhase?: boolean
  isCreator?: boolean
  activeVotingStage?: number | null
  onVoteSetupSuccess?: () => void
}

export function MilestoneTab({
  milestones,
  currentMilestone,
  projectId,
  contractProjectId,
  projectTitle,
  failedVotingCount = 0,
  isFundingPhase = false,
  isCreator = false,
  activeVotingStage = null,
  onVoteSetupSuccess,
}: MilestoneTabProps) {
  const [selectedMilestoneForVote, setSelectedMilestoneForVote] = useState<Milestone | null>(null)

  if (!milestones || milestones.length === 0) {
    return (
      <div className="bg-white border-2 border-dark rounded-2xl p-12 text-center">
        <p className="text-xl font-semibold text-gray-600">No milestones defined</p>
      </div>
    )
  }

  const getMilestoneStatus = (stage: number) => {

    if (isFundingPhase) {
      return { text: "", color: "bg-[#EAECF0] text-dark border border-dark" }
    }

    if (activeVotingStage !== null && stage === activeVotingStage) {
      return { text: "In Voting", color: "bg-[#FEF0C7] text-[#B54708] border border-[#F79009]" }
    }
    

    if (failedVotingCount >= 3 && stage === currentMilestone) {
      return { text: "Failed", color: "bg-red-100 text-red-700 border border-red-500" }
    }

    if (stage < currentMilestone) {
      return { text: "Completed", color: "bg-[#3A9E1B]/10 text-[#3A9E1B] border border-[#3A9E1B]" }
    } else if (stage === currentMilestone) {
      return { text: "In Progress", color: "bg-[#DC6803]/10 text-[#DC6803] border border-[#DC6803]" }
    }
    return { text: "", color: "bg-[#EAECF0] text-dark border border-dark" }
  }

  return (
    <>
    <div className="space-y-4">
      {milestones.map((milestone) => {
        const status = getMilestoneStatus(milestone.stage)
        const totalMilestones = milestones.length
        const isCompleted = status.text === "Completed"
        const isInProgress = status.text === "In Progress"
        const isInVoting = status.text === "In Voting"
        const shouldShowSetupButton = isCreator && !isCompleted
        const canSetupVote = isInProgress && !isInVoting

        return (
          <div key={milestone.id} className="bg-white border-2 border-dark rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-3">
              <h3 className="text-xl font-bold">{milestone.title || projectTitle}</h3>
              <span className={`px-3 py-1 ${status.color} rounded-full text-sm font-medium whitespace-nowrap`}>
                {milestone.stage}/{totalMilestones} Milestone {status.text}
              </span>
            </div>

            <p className="text-dark text-sm leading-relaxed mb-4">
              {milestone.description}
            </p>

            {milestone.proofDocuments && milestone.proofDocuments.length > 0 && (
              <div className="flex gap-2 mb-4">
                {milestone.proofDocuments.slice(0, 3).map((doc, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={doc.url}
                      alt={doc.filename}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {milestone.proofDocuments.length > 3 && (
                  <div className="w-20 h-20 rounded-xl border-2 border-gray-300 flex items-center justify-center text-gray-500 font-semibold text-sm flex-shrink-0">
                    +{milestone.proofDocuments.length - 3}
                  </div>
                )}
              </div>
            )}

            {shouldShowSetupButton ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectId ? (
                  <Link
                    href={`/projects/${projectId}/milestones/${milestone.stage}?from=project`}
                    className="block w-full py-3 border border-dark rounded-xl hover:bg-gray-50 transition-colors text-center"
                  >
                    View Details
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 border border-dark rounded-xl opacity-50 cursor-not-allowed"
                  >
                    View Details
                  </button>
                )}
                <button
                  type="button"
                  disabled={!canSetupVote || !contractProjectId}
                  onClick={() => setSelectedMilestoneForVote(milestone)}
                  className={`w-full py-3 border border-dark rounded-xl font-semibold transition-colors ${
                    canSetupVote && contractProjectId
                      ? "bg-secondary text-dark hover:bg-secondary/80"
                      : "bg-[#E5FBDD] text-[#98A2B3] cursor-not-allowed"
                  }`}
                >
                  Set up Vote
                </button>
              </div>
            ) : projectId ? (
              <Link
                href={`/projects/${projectId}/milestones/${milestone.stage}?from=project`}
                className="block w-full py-3 border border-dark rounded-xl hover:bg-gray-50 transition-colors text-center"
              >
                View Details
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-3 border border-dark rounded-xl opacity-50 cursor-not-allowed"
              >
                View Details
              </button>
            )}
          </div>
        )
      })}
    </div>
    {selectedMilestoneForVote && contractProjectId && (
      <SetupMilestoneVoteModal
        isOpen={Boolean(selectedMilestoneForVote)}
        onClose={() => setSelectedMilestoneForVote(null)}
        projectId={contractProjectId}
        milestoneOptions={[
          { stage: selectedMilestoneForVote.stage, title: selectedMilestoneForVote.title || `Milestone ${selectedMilestoneForVote.stage}` },
        ]}
        defaultMilestoneStage={selectedMilestoneForVote.stage}
        lockMilestone
        onSuccess={onVoteSetupSuccess}
      />
    )}
    </>
  )
}
