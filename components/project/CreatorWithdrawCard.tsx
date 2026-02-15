"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { formatUnits } from "viem"
import { useAccount, useChainId } from "wagmi"
import { Token } from "@/lib/constants/tokens"
import { useProjectBalance, useWithdraw, useWithdrawableAmount } from "@/lib/contracts/hooks"

interface CreatorWithdrawCardProps {
  projectId: number
  token: Token | undefined
  fallbackProjectBalance?: number
  onWithdrawSuccess?: () => void
}

const EXPLORER_URLS: Record<number, string> = {
  97: "https://testnet.bscscan.com/tx/",
  56: "https://bscscan.com/tx/",
  1: "https://etherscan.io/tx/",
  11155111: "https://sepolia.etherscan.io/tx/",
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

function isValidEvmAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim())
}

export function CreatorWithdrawCard({
  projectId,
  token,
  fallbackProjectBalance = 0,
  onWithdrawSuccess,
}: CreatorWithdrawCardProps) {
  const { address } = useAccount()
  const chainId = useChainId()
  const tokenDecimals = token?.decimals || 18

  const { balance, refetch: refetchBalance } = useProjectBalance(projectId, chainId)
  const { withdrawableAmount, refetch: refetchWithdrawable } = useWithdrawableAmount(projectId, chainId)
  const { withdrawFunds, isPending, isConfirming, isSuccess, hash, error } = useWithdraw()

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [withdrawAddress, setWithdrawAddress] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [submittedWithdrawal, setSubmittedWithdrawal] = useState<{
    amount: number
    toAddress: string
  } | null>(null)
  const [successDismissed, setSuccessDismissed] = useState(false)
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

  const presetAmounts = [10, 50, 100, 1000]
  const isProcessing = isPending || isConfirming
  const canOpenWithdrawModal = Boolean(address) && withdrawableBalance > 0
  const parsedWithdrawAmount = Number.parseFloat(withdrawAmount)
  const isAmountValid =
    Number.isFinite(parsedWithdrawAmount) &&
    parsedWithdrawAmount > 0 &&
    parsedWithdrawAmount <= withdrawableBalance
  const isAddressValid = isValidEvmAddress(withdrawAddress)
  const canSubmitWithdraw = canOpenWithdrawModal && isAmountValid && isAddressValid && !isProcessing
  const txError = manualError || getErrorMessage(error)
  const txStatus = txError
    ? "error"
    : isSuccess
      ? "success"
      : isConfirming
        ? "confirming"
        : "pending"
  const shouldShowSuccessModal =
    isWithdrawModalOpen && Boolean(submittedWithdrawal) && isSuccess && !successDismissed
  const explorerUrl = hash ? `${EXPLORER_URLS[chainId] || EXPLORER_URLS[97]}${hash}` : null

  const resetWithdrawFlow = () => {
    setIsWithdrawModalOpen(false)
    setWithdrawAddress("")
    setWithdrawAmount("")
    setSubmittedWithdrawal(null)
    setSuccessDismissed(false)
    setManualError(undefined)
  }

  const handleOpenWithdrawModal = () => {
    if (!canOpenWithdrawModal || !address) return
    setWithdrawAddress(address)
    setWithdrawAmount("")
    setSubmittedWithdrawal(null)
    setSuccessDismissed(false)
    setManualError(undefined)
    setIsWithdrawModalOpen(true)
  }

  const handleSetMax = () => {
    setWithdrawAmount(withdrawableBalance.toString())
  }

  const handlePresetClick = (amount: number) => {
    if (amount > withdrawableBalance) return
    setWithdrawAmount(amount.toString())
  }

  const handleWithdrawSubmit = async () => {
    if (!canSubmitWithdraw) return

    try {
      setManualError(undefined)
      setSubmittedWithdrawal({
        amount: parsedWithdrawAmount,
        toAddress: withdrawAddress,
      })
      withdrawFunds(
        parsedWithdrawAmount.toString(),
        projectId,
        withdrawAddress as `0x${string}`,
        tokenDecimals,
        chainId
      )
    } catch (withdrawError: unknown) {
      setManualError(getErrorMessage(withdrawError) || "Failed to withdraw funds")
      setSubmittedWithdrawal(null)
    }
  }

  useEffect(() => {
    if (!isSuccess || !hash || !submittedWithdrawal || syncedHashRef.current === hash) return
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
      } finally {
        refetchBalance()
        refetchWithdrawable()
        onWithdrawSuccess?.()
      }
    }

    void syncWithdrawal()
  }, [isSuccess, hash, chainId, projectId, submittedWithdrawal, refetchBalance, refetchWithdrawable, onWithdrawSuccess])

  return (
    <>
    <div className="bg-white border-2 border-dark rounded-2xl p-4">
      <div className="bg-[#E5FBDD] border border-dark rounded-2xl p-4">
        <p className="text-3xl md:text-[40px] leading-none font-bold text-[#3A9E1B] mb-4">
          {formatAmount(projectBalance)} {token?.symbol || "BUSD"}
        </p>

        <p className="text-base mb-5">
          Withdrawable Balance:{" "}
          <span className="font-semibold">
            {formatAmount(withdrawableBalance)} {token?.symbol || "BUSD"}
          </span>
        </p>

        <button
          onClick={handleOpenWithdrawModal}
          disabled={!canOpenWithdrawModal}
          className={`w-full py-3 rounded-xl border border-dark font-semibold flex items-center justify-center gap-1 transition-colors ${
            canOpenWithdrawModal
              ? "bg-secondary hover:bg-secondary/80 text-dark"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Image src="/icons/wallet.svg" alt="Withdraw" width={18} height={18} />
          Withdraw funds
        </button>
      </div>
    </div>

    {isWithdrawModalOpen && (
      <>
        <div
          className="fixed inset-0 bg-dark/60 z-40"
          onClick={!isProcessing ? resetWithdrawFlow : undefined}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {!shouldShowSuccessModal ? (
            <div className="w-full max-w-[420px] bg-white border-2 border-dark rounded-2xl px-4 py-2 relative">
            
             <div className="flex justify-between">
               <h3 className="text-2xl font-bold mb-4">Withdraw funds</h3>
                <button
                onClick={resetWithdrawFlow}
                className="w-8 h-8 border-2 border-dark rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Close"
                disabled={isProcessing}
              >
                x
              </button>

             </div>

              <div className="border border-dark rounded-xl p-4 mb-4 space-y-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Wallet address</label>
                  <input
                    value={withdrawAddress}
                    onChange={(event) => setWithdrawAddress(event.target.value)}
                    placeholder="0x..."
                    disabled={isProcessing}
                    className="w-full border-2 border-dark rounded-xl px-3 py-2"
                  />
                </div>

                <div className="w-full bg-[#E5FBDD] text-[#3C6B5B] text-center py-1.5 text-md rounded">
                  Balance : {formatAmount(withdrawableBalance)} {token?.symbol || "BUSD"}
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Amount to withdraw</label>
                  <div className="relative">
                    <input
                      value={withdrawAmount}
                      onChange={(event) => setWithdrawAmount(event.target.value)}
                      placeholder={`10 ${token?.symbol || "BUSD"}`}
                      disabled={isProcessing}
                      className="w-full border-2 border-dark rounded-xl px-3 py-2 pr-20"
                    />
                    <button
                      type="button"
                      onClick={handleSetMax}
                      disabled={isProcessing}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-0.5 border border-dark rounded-full text-sm bg-secondary hover:bg-secondary/80 disabled:opacity-50"
                    >
                      Max
                    </button>
                  </div>
                </div>

                <p className="text-sm text-[#344054]">
                  Withdrawable amount : {formatAmount(withdrawableBalance)} {token?.symbol || "BUSD"}
                </p>

                <div className="flex flex-wrap gap-2">
                  {presetAmounts.map((amount) => {
                    const disabled = amount > withdrawableBalance || isProcessing
                    return (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handlePresetClick(amount)}
                        disabled={disabled}
                        className={`px-4 py-2 rounded-xl border border-dark text-sm transition-colors ${
                          withdrawAmount === amount.toString()
                            ? "bg-secondary"
                            : "bg-white hover:bg-gray-50"
                        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        {amount} {token?.symbol || "BUSD"}
                      </button>
                    )
                  })}
                </div>

                {txError && (
                  <p className="text-sm text-red-600">{txError}</p>
                )}
              </div>

              <button
                onClick={handleWithdrawSubmit}
                disabled={!canSubmitWithdraw}
                className={`w-full py-3 rounded-xl border border-dark font-semibold flex items-center justify-center gap-2 transition-colors ${
                  canSubmitWithdraw
                    ? "bg-secondary text-dark hover:bg-secondary/80"
                    : "bg-[#E5FBDD] text-[#98A2B3] cursor-not-allowed"
                }`}
              >
                <Image src="/icons/wallet.svg" alt="Withdraw" width={18} height={18} />
                {txStatus === "pending" && submittedWithdrawal
                  ? "Confirm in wallet..."
                  : txStatus === "confirming"
                    ? "Processing..."
                    : "Withdraw funds"}
              </button>
            </div>
          ) : (
            <div className="w-full max-w-[520px] bg-white border border-dark rounded-2xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <Image src="/images/sucess.svg" alt="Success" width={100} height={100} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Withdraw successful</h3>
              <p className="text-sm text-gray-700 mb-6">
                {formatAmount(submittedWithdrawal?.amount || 0)} {token?.symbol || "BUSD"} has been withdrawn to{" "}
                {submittedWithdrawal
                  ? `${submittedWithdrawal.toAddress.slice(0, 6)}...${submittedWithdrawal.toAddress.slice(-4)}`
                  : "your wallet"}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={explorerUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-3 rounded-xl border border-dark font-semibold ${
                    explorerUrl
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gray-100 text-gray-400 pointer-events-none"
                  }`}
                >
                  View transaction
                </a>
                <button
                  onClick={resetWithdrawFlow}
                  className="py-3 rounded-xl border border-dark font-semibold bg-secondary hover:bg-secondary/80"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    )}
    </>
  )
}
