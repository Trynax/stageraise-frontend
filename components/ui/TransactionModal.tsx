"use client"

import { useEffect } from "react"
import Image from "next/image"

export type TransactionType = 
  | 'creating' 
  | 'funding' 
  | 'voting' 
  | 'withdraw' 
  | 'refund'
  | 'approve'

export type TransactionStatus = 
  | 'pending'      // Waiting for user to sign
  | 'confirming'   // Transaction submitted, waiting for confirmation
  | 'success'      // Transaction confirmed
  | 'error'        // Transaction failed

interface TransactionModalProps {
  isOpen: boolean
  type: TransactionType
  status: TransactionStatus
  hash?: string
  error?: string
  onClose?: () => void
  chainId?: number
}

const TRANSACTION_CONFIG = {
  creating: {
    title: 'Creating Project',
    pendingMessage: 'Please confirm the transaction in your wallet...',
    confirmingMessage: 'Your project is being created on the blockchain...',
    successMessage: 'Project created successfully!',
    icon: '🚀'
  },
  funding: {
    title: 'Funding Project',
    pendingMessage: 'Please confirm the transaction in your wallet...',
    confirmingMessage: 'Your contribution is being processed...',
    successMessage: 'Contribution successful!',
    icon: '💰'
  },
  voting: {
    title: 'Submitting Vote',
    pendingMessage: 'Please confirm the transaction in your wallet...',
    confirmingMessage: 'Your vote is being recorded...',
    successMessage: 'Vote submitted successfully!',
    icon: '🗳️'
  },
  withdraw: {
    title: 'Withdrawing Funds',
    pendingMessage: 'Please confirm the transaction in your wallet...',
    confirmingMessage: 'Your withdrawal is being processed...',
    successMessage: 'Withdrawal successful!',
    icon: '💸'
  },
  refund: {
    title: 'Requesting Refund',
    pendingMessage: 'Please confirm the transaction in your wallet...',
    confirmingMessage: 'Your refund is being processed...',
    successMessage: 'Refund successful!',
    icon: '↩️'
  },
  approve: {
    title: 'Approving Token',
    pendingMessage: 'Please approve token spending in your wallet...',
    confirmingMessage: 'Approval is being confirmed...',
    successMessage: 'Token approved!',
    icon: '✅'
  }
}

const EXPLORER_URLS: Record<number, string> = {
  97: 'https://testnet.bscscan.com/tx/',
  56: 'https://bscscan.com/tx/',
  1: 'https://etherscan.io/tx/',
  11155111: 'https://sepolia.etherscan.io/tx/'
}

export default function TransactionModal({ 
  isOpen, 
  type, 
  status, 
  hash, 
  error,
  onClose,
  chainId = 97
}: TransactionModalProps) {
  const config = TRANSACTION_CONFIG[type]
  const explorerUrl = hash ? `${EXPLORER_URLS[chainId] || EXPLORER_URLS[97]}${hash}` : null

  // Auto-close on success after 3 seconds
  useEffect(() => {
    if (status === 'success' && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [status, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50"
        onClick={status === 'success' || status === 'error' ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-dark">
          {/* Close button - only show when not pending/confirming */}
          {(status === 'success' || status === 'error') && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border-2 border-dark hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl">&times;</span>
            </button>
          )}

          {/* Icon/Animation */}
          <div className="flex justify-center mb-6">
            {status === 'pending' || status === 'confirming' ? (
              <div className="relative w-20 h-20">
                {/* Spinning circle */}
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                {/* Icon in center */}
                <div className="absolute inset-0 flex items-center justify-center text-3xl">
                  {config.icon}
                </div>
              </div>
            ) : status === 'success' ? (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-center mb-2">
            {status === 'success' ? 'Success!' : status === 'error' ? 'Transaction Failed' : config.title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            {status === 'pending' && config.pendingMessage}
            {status === 'confirming' && config.confirmingMessage}
            {status === 'success' && config.successMessage}
            {status === 'error' && (error || 'Something went wrong. Please try again.')}
          </p>

          {/* Transaction hash link */}
          {hash && status !== 'pending' && (
            <div className="mb-6">
              <a
                href={explorerUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-deepGreen hover:underline"
              >
                <span>View on Explorer</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* Progress steps for pending/confirming */}
          {(status === 'pending' || status === 'confirming') && (
            <div className="flex justify-center gap-4 mb-6">
              <div className={`flex items-center gap-2 ${status === 'pending' ? 'text-secondary' : 'text-gray-400'}`}>
                <div className={`w-3 h-3 rounded-full ${status === 'pending' ? 'bg-secondary animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-sm font-medium">Sign</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-gray-300"></div>
              </div>
              <div className={`flex items-center gap-2 ${status === 'confirming' ? 'text-secondary' : 'text-gray-400'}`}>
                <div className={`w-3 h-3 rounded-full ${status === 'confirming' ? 'bg-secondary animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-sm font-medium">Confirm</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {status === 'error' && onClose && (
            <button
              onClick={onClose}
              className="w-full py-3 bg-deepGreen text-white rounded-xl font-semibold hover:bg-deepGreen/90 transition-colors"
            >
              Close
            </button>
          )}

          {status === 'success' && onClose && (
            <button
              onClick={onClose}
              className="w-full py-3 bg-deepGreen text-white rounded-xl font-semibold hover:bg-deepGreen/90 transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </>
  )
}

// Hook for managing transaction modal state
import { useState, useCallback } from 'react'

export function useTransactionModal() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    type: TransactionType
    status: TransactionStatus
    hash?: string
    error?: string
  }>({
    isOpen: false,
    type: 'creating',
    status: 'pending',
    hash: undefined,
    error: undefined
  })

  const openModal = useCallback((type: TransactionType) => {
    setModalState({
      isOpen: true,
      type,
      status: 'pending',
      hash: undefined,
      error: undefined
    })
  }, [])

  const setConfirming = useCallback((hash: string) => {
    setModalState(prev => ({
      ...prev,
      status: 'confirming',
      hash
    }))
  }, [])

  const setSuccess = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      status: 'success'
    }))
  }, [])

  const setError = useCallback((error: string) => {
    setModalState(prev => ({
      ...prev,
      status: 'error',
      error
    }))
  }, [])

  const closeModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }))
  }, [])

  return {
    modalState,
    openModal,
    setConfirming,
    setSuccess,
    setError,
    closeModal
  }
}
