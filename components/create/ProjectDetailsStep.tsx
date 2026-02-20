"use client"
import Image from "next/image"
import { SUPPORTED_TOKENS } from "@/lib/constants/tokens"

interface ProjectDetailsStepProps {
    formData: any
    updateFormData: (data: any) => void
    nextStep: () => void
    prevStep: () => void
    currentStep: number
    totalSteps: number
}

export default function ProjectDetailsStep({
    formData,
    updateFormData,
    nextStep,
    prevStep,
    currentStep,
    totalSteps
}: ProjectDetailsStepProps) {
    const isMilestoneProject = formData.projectType === 'milestone'

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validate payment token is selected
        if (!formData.paymentToken) {
            alert('Please select a payment token')
            return
        }

        const fundingStartTimestamp = new Date(formData.fundingStart).getTime()
        const fundingEndTimestamp = new Date(formData.fundingEnd).getTime()

        if (!Number.isFinite(fundingStartTimestamp) || !Number.isFinite(fundingEndTimestamp)) {
            alert('Please provide valid funding start and end date/time')
            return
        }

        if (fundingEndTimestamp <= fundingStartTimestamp) {
            alert('Funding end time must be after funding start time')
            return
        }

        if (!isMilestoneProject) {
            updateFormData({
                numberOfMilestones: '0',
                votingPeriod: '7',
                milestones: []
            })
        }
        
        nextStep()
    }

    return (
        <section className="bg-primary relative">
    
            <div className="bg-[#CBF5BD] py-12">
                <h1 className="text-3xl md:text-5xl font-bold text-center text-dark">Create a project</h1>
            </div>

            <div className=" px-4   md:px-32 py-12">
                <form onSubmit={handleSubmit}>
                 
                    <div className="hidden md:block sticky top-16 z-30 bg-primary -mx-4 md:-mx-32 px-4 md:px-32 mb-20">
                        <div className="flex justify-between items-start py-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Project Details</h2>
                                <p className="text-gray-600">Explain what you're building, how much you need, and how you'll deliver.</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-lg font-semibold self-end">{currentStep}/{totalSteps}</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-6 py-2 border-2 border-dark rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                                    >
                                       <Image src="/icons/back.svg" alt="Back" width={24} height={24} />
                                    </button>
                                    <button
                                        type="submit"
                                        className={`px-6 py-2 rounded-xl font-semibold transition-all bg-deepGreen text-secondary hover:bg-deepGreen/80`}
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    <div className="border-t-2 border-dark -mx-4 md:-mx-32"></div>
                </div>
            
                    <div className="flex flex-col md:hidden sticky top-16 z-30 bg-primary py-4 -mx-4 px-4 justify-between items-start gap-4 mb-10">
                    <div className="flex justify-between items-center w-full">
                            <h2 className="text-3xl font-bold">Project Details</h2>
                            <span className="text-lg">{currentStep}/{totalSteps}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-gray-600">Explain what you're building, how much you need, and how you'll deliver.</p>    
                        </div>
                        <div className="flex gap-2 w-full">
                            <button
                                type="button"
                                onClick={prevStep}
                                className=" px-6 py-2 border-2 border-dark rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                            >
                                 <Image src="/icons/back.svg" alt="Back" width={24} height={24} />
                            </button>
                            <button
                                type="submit"
                                className={`flex-1 px-6 py-2 rounded-xl font-semibold transition-all bg-deepGreen text-secondary hover:bg-deepGreen/80`}
                            >
                                Continue
                            </button>
                        </div>
                        <div className="border-t-2 border-dark -mx-4"></div>
                    </div>

            <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold mb-2">Project name</label>
                        <input
                            type="text"
                            required
                            value={formData.projectName}
                            onChange={(e) => updateFormData({ projectName: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                            placeholder="Enter project name"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Tags</label>
                        <input
                            type="text"
                            required
                            value={formData.tags}
                            onChange={(e) => updateFormData({ tags: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                            placeholder="DeFi, Infrastructure, AI"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-semibold mb-2">Project description</label>
                    <textarea
                        required
                        value={formData.description}
                        onChange={(e) => updateFormData({ description: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none resize-none"
                        placeholder="Text placeholder"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold mb-2">Fundraising Target (USD)</label>
                        <input
                            type="number"
                            required
                            value={formData.fundraisingTarget}
                            onChange={(e) => updateFormData({ fundraisingTarget: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                            placeholder="Enter Target amount"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Funding Start</label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.fundingStart}
                            onChange={(e) => updateFormData({ fundingStart: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block font-semibold mb-2">Funding End</label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.fundingEnd}
                            onChange={(e) => updateFormData({ fundingEnd: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold mb-2">Minimum Contribution per Person (Optional)</label>
                        <input
                            type="number"
                            value={formData.minContribution}
                            onChange={(e) => updateFormData({ minContribution: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                            placeholder="Enter Minimum amount (USD)"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Maximum Contribution per Person (Optional)</label>
                        <input
                            type="number"
                            value={formData.maxContribution}
                            onChange={(e) => updateFormData({ maxContribution: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                            placeholder="Enter Maximum amount (USD)"
                        />
                    </div>
                </div>

                {isMilestoneProject && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-semibold mb-2">Number of milestone</label>
                            <select
                                required
                                value={formData.numberOfMilestones}
                                onChange={(e) => updateFormData({ numberOfMilestones: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                            >
                                <option value="">Select a value</option>
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Voting period Duration (Per ~ Day)</label>
                            <input
                                type="number"
                                required
                                value={formData.votingPeriod}
                                onChange={(e) => updateFormData({ votingPeriod: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                                placeholder="Enter voting period"
                            />
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                        <label className="block font-semibold mb-2">Select Token Type</label>
                        <div className="flex gap-2">
                            {SUPPORTED_TOKENS.map((token) => (
                                <button
                                    key={token.symbol}
                                    type="button"
                                    onClick={() => updateFormData({ paymentToken: token.address })}
                                    className={`flex-1 px-4 py-3 border-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                                        formData.paymentToken === token.address
                                            ? 'border-secondary bg-secondary text-dark'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                   <Image src={`/icons/${token.symbol}.svg`} alt={token.symbol} width={24} height={24} />
                                    {token.symbol}
                                </button>
                            ))}
                    </div>
                   </div>
                   <div>
                     <label className="block font-semibold mb-2">Project Wallet Address (Optional)</label>
                    <input
                        type="text"
                        value={formData.walletAddress}
                        onChange={(e) => updateFormData({ walletAddress: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                        placeholder="0x0e..."
                    />
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold mb-2">Website (Optional)</label>
                        <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => updateFormData({ website: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                            placeholder="HTTPS://"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">X /Twitter (Optional)</label>
                        <input
                            type="url"
                            value={formData.twitter}
                            onChange={(e) => updateFormData({ twitter: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                            placeholder="HTTPS://"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold mb-2">Discord (Optional)</label>
                        <input
                            type="url"
                            value={formData.discord}
                            onChange={(e) => updateFormData({ discord: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                            placeholder="HTTPS://"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Telegram (Optional)</label>
                        <input
                            type="url"
                            value={formData.telegram}
                            onChange={(e) => updateFormData({ telegram: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
                            placeholder="HTTPS://"
                        />
                    </div>
                </div>
            </div>
                </form>
            </div>
        </section>
    )
}
