"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAccount } from "wagmi"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/sections/footer"
import { SetupMilestoneVoteModal } from "@/components/project/SetupMilestoneVoteModal"

type ProofDocumentNormalized = {
  url: string
  filename?: string
}

function normalizeProofDocuments(input: unknown): ProofDocumentNormalized[] {
  if (!Array.isArray(input)) return []

  return input
    .map((item) => {
      if (typeof item === "string") return { url: item }
      if (item && typeof item === "object" && "url" in item) {
        const url = (item as any).url
        const filename = (item as any).filename
        if (typeof url === "string" && url.length > 0) {
          return { url, filename: typeof filename === "string" ? filename : undefined }
        }
      }
      return null
    })
    .filter((v): v is ProofDocumentNormalized => Boolean(v))
}

function formatDeliverables(deliverables: unknown): string[] {
  if (!deliverables) return []
  if (typeof deliverables === "string") return [deliverables]
  if (Array.isArray(deliverables)) return deliverables.filter((d): d is string => typeof d === "string")
  try {
    return [JSON.stringify(deliverables, null, 2)]
  } catch {
    return ["Unable to display deliverables"]
  }
}

export default function MilestoneDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { address } = useAccount()
  const projectId = params.id as string
  const stageParam = params.stage as string
  const milestoneStage = Number.parseInt(stageParam, 10)
  const from = (searchParams.get("from") || "project") as "project" | "explore" | "dashboard"

  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        const data = await response.json()
        if (data.success) setProject(data.project)
      } catch (error) {
        console.error("Error fetching project:", error)
      } finally {
        setLoading(false)
      }
    }

    if (projectId) fetchProject()
  }, [projectId])

  const milestone = useMemo(() => {
    if (!project?.milestones || !Number.isFinite(milestoneStage)) return null
    return project.milestones.find((m: any) => m.stage === milestoneStage) || null
  }, [project?.milestones, milestoneStage])

  const isFundingPhase = project?.fundingDeadline ? new Date(project.fundingDeadline) > new Date() : false

  const status = useMemo(() => {
    if (!milestone || !project) return { text: "", color: "bg-[#EAECF0] text-dark border border-dark" }
    if (isFundingPhase) return { text: "", color: "bg-[#EAECF0] text-dark border border-dark" }
    if (project.activeVoting?.stage === milestone.stage) {
      return { text: "In Voting", color: "bg-[#FEF0C7] text-[#B54708] border border-[#F79009]" }
    }
    if ((project.failedVotingCount || 0) >= 3 && milestone.stage === (project.currentMilestone || 1)) {
      return { text: "Failed", color: "bg-red-100 text-red-700 border border-red-500" }
    }
    if (milestone.stage < (project.currentMilestone || 1)) {
      return { text: "Completed", color: "bg-[#3A9E1B]/10 text-[#3A9E1B] border border-[#3A9E1B]" }
    }
    if (milestone.stage === (project.currentMilestone || 1)) {
      return { text: "In Progress", color: "bg-[#DC6803]/10 text-[#DC6803] border border-[#DC6803]" }
    }
    return { text: "", color: "bg-[#EAECF0] text-dark border border-dark" }
  }, [isFundingPhase, milestone, project])

  const proofDocuments = useMemo(
    () => normalizeProofDocuments(milestone?.proofDocuments),
    [milestone?.proofDocuments]
  )

  const proofImages = useMemo(() => {
    if (proofDocuments.length > 0) return proofDocuments

    const fallback: ProofDocumentNormalized[] = []
    if (project?.coverImageUrl) fallback.push({ url: project.coverImageUrl })
    if (Array.isArray(project?.galleryImageUrls)) {
      for (const url of project.galleryImageUrls) {
        if (typeof url === "string" && url.length > 0) fallback.push({ url })
        if (fallback.length >= 6) break
      }
    }
    return fallback
  }, [proofDocuments, project?.coverImageUrl, project?.galleryImageUrls])

  const deliverables = useMemo(() => formatDeliverables(milestone?.deliverables), [milestone?.deliverables])

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-primary pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Loading milestone...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!project || !milestone) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-primary pt-16">
          <div className="bg-secondary py-4 px-4 md:px-32">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/projects" className="hover:underline">Explore page</Link>
              <span>&gt;</span>
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <span>&gt;</span>
              <span className="font-semibold">Milestone details</span>
            </div>
          </div>
          <div className="px-4 md:px-32 py-20 text-center">
            <p className="text-2xl font-bold text-gray-600 mb-4">Milestone not found</p>
            <Link href={`/projects/${projectId}`} className="text-deepGreen hover:underline">
              Back to project
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const totalMilestones = project.milestones?.length || 0
  const isCreator = Boolean(
    address &&
    project?.ownerAddress &&
    address.toLowerCase() === project.ownerAddress.toLowerCase()
  )
  const isCompleted = status.text === "Completed"
  const isInProgress = status.text === "In Progress"
  const isInVoting = status.text === "In Voting"
  const shouldShowSetupButton = isCreator && !isCompleted
  const canSetupVote = isInProgress && !isInVoting

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary pt-16">
        <div className="bg-secondary py-4 px-4 md:px-32">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/projects" className="hover:underline">Explore page</Link>
            <span>&gt;</span>
            {from === "dashboard" ? (
              <>
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                <span>&gt;</span>
                <span className="font-semibold">Milestone {milestoneStage}</span>
              </>
            ) : (
              <>
                <Link href={`/projects/${projectId}`} className="hover:underline">Project page</Link>
                <span>&gt;</span>
                <span className="font-semibold">Milestone {milestoneStage}</span>
              </>
            )}
          </div>
        </div>

        <div className="px-4 md:px-32 py-10">
          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
              <div className="flex items-start gap-2 md:gap-6 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">{milestone.title || `Milestone ${milestoneStage}`}</h1>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-3 py-1 ${status.color} rounded-full text-sm font-medium whitespace-nowrap`}>
                    {milestone.stage}/{totalMilestones} Milestone {status.text}
                  </span>
                </div>
              </div>

              {shouldShowSetupButton && (
                <button
                  type="button"
                  onClick={() => setIsVoteModalOpen(true)}
                  disabled={!canSetupVote}
                  className={`px-8 py-2 rounded-xl border border-dark font-semibold transition-colors ${
                    canSetupVote
                      ? "bg-secondary text-dark hover:bg-secondary/80"
                      : "bg-[#E5FBDD] text-[#98A2B3] cursor-not-allowed"
                  }`}
                >
                  Set up Vote
                </button>
              )}
            </div>

            <div className="text-dark whitespace-pre-line leading-relaxed text-sm">
              {milestone.description || "No milestone description provided."}
            </div>
          </div>

          {(deliverables.length > 0 || proofImages.length > 0) && (
            <div className="mt-8">
              {deliverables.length > 0 && (
                <div className="mb-6">
                  <div className="text-dark whitespace-pre-line leading-relaxed text-sm space-y-2">
                    {deliverables.map((d, idx) => (
                      <p key={idx} className="whitespace-pre-wrap">{d}</p>
                    ))}
                  </div>
                </div>
              )}

              {proofImages.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {proofImages.map((doc, idx) => (
                    <div
                      key={`${doc.url}-${idx}`}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100"
                      title={doc.filename || `Proof ${idx + 1}`}
                    >
                      <Image
                        src={doc.url}
                        alt={doc.filename || `Proof ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No proof documents uploaded yet.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <SetupMilestoneVoteModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        projectId={project.projectId}
        milestoneOptions={[{ stage: milestone.stage, title: milestone.title || `Milestone ${milestone.stage}` }]}
        defaultMilestoneStage={milestone.stage}
        lockMilestone
      />
    </>
  )
}
