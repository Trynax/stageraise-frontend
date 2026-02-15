"use client"

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { useChainId } from "wagmi"
import { useOpenVotingWithSync } from "@/lib/contracts/hooks"
import TransactionModal from "@/components/ui/TransactionModal"

interface MilestoneOption {
  stage: number
  title: string
}

interface UploadedProofDocument {
  url: string
  filename: string
  mediaType: "image" | "video"
}

interface SetupMilestoneVoteModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: number
  milestoneOptions: MilestoneOption[]
  defaultMilestoneStage: number
  lockMilestone?: boolean
  onSuccess?: () => void
}

const MAX_FILES = 10

function getErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined
  const maybeError = error as { shortMessage?: string; message?: string }
  return maybeError.shortMessage || maybeError.message
}

export function SetupMilestoneVoteModal({
  isOpen,
  onClose,
  projectId,
  milestoneOptions,
  defaultMilestoneStage,
  lockMilestone = true,
  onSuccess,
}: SetupMilestoneVoteModalProps) {
  const chainId = useChainId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const syncedHashRef = useRef<string | null>(null)

  const [selectedMilestone, setSelectedMilestone] = useState(defaultMilestoneStage)
  const [proofSummary, setProofSummary] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [showTxModal, setShowTxModal] = useState(false)
  const [manualError, setManualError] = useState<string | undefined>()
  const [pendingSyncData, setPendingSyncData] = useState<{
    milestoneStage: number
    proofSummary: string
    proofDocuments: UploadedProofDocument[]
  } | null>(null)

  const { openVoting, syncVotingOpen, isPending, isConfirming, isSuccess, hash, error } = useOpenVotingWithSync()

  useEffect(() => {
    if (!isOpen) return
    setSelectedMilestone(defaultMilestoneStage)
    setProofSummary("")
    setFiles([])
    setManualError(undefined)
    setPendingSyncData(null)
    syncedHashRef.current = null
  }, [isOpen, defaultMilestoneStage])

  const txError = manualError || getErrorMessage(error)
  const txStatus = txError
    ? "error"
    : isSuccess
      ? "success"
      : isConfirming
        ? "confirming"
        : "pending"

  const milestoneChoices = useMemo(() => {
    if (milestoneOptions.length > 0) return milestoneOptions
    return [{ stage: defaultMilestoneStage, title: `Milestone ${defaultMilestoneStage}` }]
  }, [milestoneOptions, defaultMilestoneStage])

  const canSubmit = proofSummary.trim().length > 0 && files.length > 0 && !isPending && !isConfirming

  const handleFilePick = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files || [])
    if (picked.length === 0) return

    const next = [...files, ...picked].slice(0, MAX_FILES)
    setFiles(next)
    event.target.value = ""
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index))
  }

  const uploadProofFiles = async (proofFiles: File[]): Promise<UploadedProofDocument[]> => {
    const formData = new FormData()
    proofFiles.forEach((file) => formData.append("files", file))

    const response = await fetch("/api/upload/batch", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to upload proof files")
    }

    return (data.uploads || []).map((upload: { url: string; name: string; type: string }) => ({
      url: upload.url,
      filename: upload.name,
      mediaType: upload.type?.startsWith("video/") ? "video" : "image",
    }))
  }

  const handleInitiateVote = async () => {
    if (!canSubmit) return

    try {
      setManualError(undefined)
      const uploadedProofDocuments = await uploadProofFiles(files)

      setPendingSyncData({
        milestoneStage: selectedMilestone,
        proofSummary: proofSummary.trim(),
        proofDocuments: uploadedProofDocuments,
      })

      setShowTxModal(true)
      openVoting(projectId, chainId)
    } catch (submitError: unknown) {
      setManualError(getErrorMessage(submitError) || "Failed to start voting")
      setShowTxModal(true)
    }
  }

  useEffect(() => {
    if (!isSuccess || !hash || syncedHashRef.current === hash || !pendingSyncData) return
    syncedHashRef.current = hash

    const runSync = async () => {
      try {
        await syncVotingOpen(projectId, chainId, pendingSyncData)
      } catch (syncError) {
        console.error("Failed to sync open vote:", syncError)
      } finally {
        onSuccess?.()
      }
    }

    void runSync()
  }, [isSuccess, hash, pendingSyncData, projectId, chainId, syncVotingOpen, onSuccess])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-dark/60 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-[520px] bg-white border-2 border-dark rounded-3xl px-6 py-3 relative max-h-[90vh] overflow-y-auto">
          

          <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-6">Set up milestone vote</h2>
           <button
            onClick={onClose}
            className="w-8 h-8 border-2 border-dark rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
          x
          </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Select Milestone</label>
              <select
                value={selectedMilestone}
                onChange={(event) => setSelectedMilestone(Number(event.target.value))}
                disabled={lockMilestone}
                className="w-full border-2 border-dark rounded-xl px-4 py-3 bg-white "
              >
                {milestoneChoices.map((option) => (
                  <option key={option.stage} value={option.stage}>
                    {`Milestone ${option.stage}: ${option.title}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Proof of work</label>
              <textarea
                value={proofSummary}
                onChange={(event) => setProofSummary(event.target.value)}
                placeholder="Provide summary of completion"
                className="w-full border-2 border-dark rounded-xl p-4 h-30 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Upload proof (Image/Video)</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full min-h-[160px] rounded-2xl border-2 border-dark flex flex-col items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors px-4 py-6"
              >
                <Image src="/icons/upload.svg" alt="Upload" width={24} height={24} />
                <p className="mt-2 text-sm font-medium">Click to Upload</p>
                <p className="text-xs text-gray-500 mt-1">
                  Up to {MAX_FILES} files. Images and videos are supported.
                </p>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleFilePick}
              />
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center justify-between border border-dark rounded-xl px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-3 text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleInitiateVote}
            disabled={!canSubmit}
            className={`w-full mt-6 py-3 rounded-xl border border-dark font-semibold transition-colors ${
              canSubmit
                ? "bg-secondary text-dark hover:bg-secondary/80"
                : "bg-[#E5FBDD] text-[#98A2B3] cursor-not-allowed"
            }`}
          >
            Initiate Vote
          </button>
        </div>
      </div>

      <TransactionModal
        isOpen={showTxModal}
        type="voting"
        status={txStatus}
        hash={hash}
        error={txError}
        onClose={() => {
          setShowTxModal(false)
          if (isSuccess) {
            onClose()
          }
        }}
        chainId={chainId}
      />
    </>
  )
}
