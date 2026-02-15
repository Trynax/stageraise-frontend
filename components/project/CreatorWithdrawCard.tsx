"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { formatUnits } from "viem"
import { useAccount, useChainId } from "wagmi"
import { Token } from "@/lib/constants/tokens"
import { useProjectBalance, useWithdraw, useWithdrawableAmount } from "@/lib/contracts/hooks"
import TransactionModal from "@/components/ui/TransactionModal"

interface CreatorWithdrawCardProps {
  projectId: number
  token: Token | undefined
  fallbackProjectBalance?: number
}

function formatAmount(amount: number): string {
  if (!Number.isFinite(amount)) return "0"
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

function getErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined
  const maybeError = error as { shortMessage?: string; message?: string }
  return maybeError.shortMessage || maybeError.message
}

export function CreatorWithdrawCard({
  projectId,
  token,
  fallbackProjectBalance = 0,
}: CreatorWithdrawCardProps) {
  const { address } = useAccount()
  const chainId = useChainId()
  const tokenDecimals = token?.decimals || 18

  const { balance } = useProjectBalance(projectId, chainId)
  const { withdrawableAmount } = useWithdrawableAmount(projectId, chainId)
  const { withdrawFunds, isPending, isConfirming, isSuccess, hash, error } = useWithdraw()

  const [showTxModal, setShowTxModal] = useState(false)
  const [manualError, setManualError] = useState<string | undefined>()
  const syncedHashRef = useRef<string | null>(null)

  const projectBalance = useMemo(() => {
    if (balance !== undefined) {
      const parsed = Number.parseFloat(formatUnits(balance, tokenDecimals))
      if (Number.isFinite(parsed)) return parsed
    }
    return fallbackProjectBalance
  }, [balance, tokenDecimals, fallbackProjectBalance])

  const withdrawableBalance = useMemo(() => {
    if (withdrawableAmount === undefined) return 0
    const parsed = Number.parseFloat(formatUnits(withdrawableAmount, tokenDecimals))
    return Number.isFinite(parsed) ? parsed : 0
  }, [withdrawableAmount, tokenDecimals])

  const isProcessing = isPending || isConfirming
  const canWithdraw = Boolean(address) && withdrawableBalance > 0 && !isProcessing
  const txError = manualError || getErrorMessage(error)
  const txStatus = txError
    ? "error"
    : isSuccess
      ? "success"
      : isConfirming
        ? "confirming"
        : "pending"

  const handleWithdraw = async () => {
    if (!address || !canWithdraw) return

    try {
      setShowTxModal(true)
      setManualError(undefined)
      withdrawFunds(
        withdrawableBalance.toString(),
        projectId,
        address as `0x${string}`,
        tokenDecimals,
        chainId
      )
    } catch (withdrawError: unknown) {
      setManualError(getErrorMessage(withdrawError) || "Failed to withdraw funds")
    }
  }

  useEffect(() => {
    if (!isSuccess || !hash || syncedHashRef.current === hash) return
    syncedHashRef.current = hash

    const syncWithdrawal = async () => {
      try {
        await fetch("/api/sync/withdrawals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionHash: hash,
            chainId,
            projectId,
          }),
        })
      } catch (syncError) {
        console.error("Failed to sync withdrawal:", syncError)
      }
    }

    void syncWithdrawal()
  }, [isSuccess, hash, chainId, projectId])

  return (
    <div className="bg-white border-2 border-dark rounded-2xl p-3">
      <div className="bg-[#E5FBDD] border border-dark rounded-2xl p-4">
        <p className="text-2xl leading-none font-bold text-[#3A9E1B] mb-3">
          {formatAmount(projectBalance)} {token?.symbol || "BUSD"}
        </p>

        <p className="text-sm mb-5">
          Withdrawable Balance:{" "}
          <span className="font-semibold text-sm">
            {formatAmount(withdrawableBalance)} {token?.symbol || "BUSD"}
          </span>
        </p>

        <button
          onClick={handleWithdraw}
          disabled={!canWithdraw}
          className={`w-full py-3 rounded-xl border border-dark font-semibold flex items-center justify-center gap-1 transition-colors ${
            canWithdraw
              ? "bg-secondary hover:bg-secondary/80 text-dark"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Image src="/icons/wallet.svg" alt="Withdraw" width={18} height={18} />
          {isProcessing ? "Processing..." : "Withdraw funds"}
        </button>
      </div>

      <TransactionModal
        isOpen={showTxModal}
        type="withdraw"
        status={txStatus}
        hash={hash}
        error={txError}
        onClose={() => {
          setShowTxModal(false)
          setManualError(undefined)
        }}
        chainId={chainId}
      />
    </div>
  )
}
