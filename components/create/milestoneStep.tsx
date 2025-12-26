"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface MilestoneStepProps {
    formData: any
    updateFormData: (data: any) => void
    nextStep: () => void
    prevStep: () => void
    currentStep: number
}

interface Milestone {
    title: string
    description: string
    amount: string
    image: File | null
}

export default function MilestoneStep({ formData, updateFormData, nextStep, prevStep, currentStep }: MilestoneStepProps) {
    const [milestones, setMilestones] = useState<Milestone[]>([])
    const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([])

    useEffect(() => {
        const numMilestones = parseInt(formData.numberOfMilestones) || 1
        const totalAmount = parseFloat(formData.fundraisingTarget) || 0
        const amountPerMilestone = (totalAmount / numMilestones).toFixed(2)

        if (formData.milestones && formData.milestones.length === numMilestones) {
            setMilestones(formData.milestones)
            setImagePreviews(formData.milestones.map(() => null))
        } else {
            const initialMilestones = Array.from({ length: numMilestones }, (_, i) => ({
                title: '',
                description: '',
                amount: amountPerMilestone,
                image: null
            }))
            setMilestones(initialMilestones)
            setImagePreviews(Array(numMilestones).fill(null))
        }
    }, [formData.numberOfMilestones, formData.fundraisingTarget])

    const handleMilestoneChange = (index: number, field: keyof Milestone, value: string) => {
        const updated = [...milestones]
        updated[index] = { ...updated[index], [field]: value }
        setMilestones(updated)
        updateFormData({ milestones: updated })
    }

    const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const updated = [...milestones]
            updated[index] = { ...updated[index], image: file }
            setMilestones(updated)
            updateFormData({ milestones: updated })

            const previews = [...imagePreviews]
            previews[index] = URL.createObjectURL(file)
            setImagePreviews(previews)
        }
    }

    const handleDeleteMilestone = (index: number) => {
        if (milestones.length > 1) {
            const updated = milestones.filter((_, i) => i !== index)
            
  
            const totalAmount = parseFloat(formData.fundraisingTarget) || 0
            const amountPerMilestone = (totalAmount / updated.length).toFixed(2)
            const redistributed = updated.map(m => ({
                ...m,
                amount: amountPerMilestone
            }))
            
            setMilestones(redistributed)
            updateFormData({ milestones: redistributed, numberOfMilestones: redistributed.length.toString() })

            const previews = imagePreviews.filter((_, i) => i !== index)
            setImagePreviews(previews)
        }
    }

    const handleAddMilestone = () => {
        const totalAmount = parseFloat(formData.fundraisingTarget) || 0
        const newMilestoneCount = milestones.length + 1
        const amountPerMilestone = (totalAmount / newMilestoneCount).toFixed(2)

        const updated = milestones.map(m => ({
            ...m,
            amount: amountPerMilestone
        }))
        
        updated.push({
            title: '',
            description: '',
            amount: amountPerMilestone,
            image: null
        })
        
        setMilestones(updated)
        setImagePreviews([...imagePreviews, null])
        updateFormData({ milestones: updated, numberOfMilestones: updated.length.toString() })
    }

    const calculatePercentage = (index: number) => {
        const percentage = (100 / milestones.length).toFixed(2)
        return percentage
    }

    const formatAmount = (amount: string) => {
        const num = parseFloat(amount) || 0
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    return (
        <section className="bg-primary relative">
       
            <div className="bg-[#CBF5BD] py-12">
                <h1 className="text-3xl md:text-5xl font-bold text-center text-dark">Create a project</h1>
            </div>

            <div className="px-4 md:px-32 py-12">
                <div>
                    <div className="hidden md:flex justify-between items-start mb-20">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Milestone Details</h2>
                            <p className="text-gray-600">Explain what you're building, how much you need, and how you'll deliver.</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-lg font-semibold self-end">{currentStep}/5</span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-2 border-2 border-dark rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    <Image src="/icons/back.svg" alt="Back" width={24} height={24} />
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2 rounded-xl font-semibold transition-all bg-deepGreen text-secondary hover:bg-deepGreen/80"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:hidden justify-between items-start gap-4 mb-10">
                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-3xl font-bold">Milestone Details</h2>
                            <span className="text-lg">{currentStep}/5</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-gray-600">Explain what you're building, how much you need, and how you'll deliver.</p>    
                        </div>
                        <div className="flex gap-2 w-full">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-6 py-2 border-2 border-dark rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                            >
                                <Image src="/icons/back.svg" alt="Back" width={24} height={24} />
                            </button>
                            <button
                                onClick={nextStep}
                                className="flex-1 px-6 py-2 rounded-xl font-semibold transition-all bg-deepGreen text-secondary hover:bg-deepGreen/80"
                            >
                                Continue
                            </button>
                        </div>
                    </div>

                    <div className="absolute hidden top-74 lg:block right-0 left-0 h-0.5 bg-dark"></div>

                    <div className="space-y-6">
                        {milestones.map((milestone, index) => (
                            <div key={index} className="bg-primary border rounded-2xl relative">
                                <div className="flex justify-between items-center mb-4 px-4 py-2 rounded-t-2xl bg-secondary">
                                    <div className="flex flex-col gap-2">
                                        <span className="bg-secondary text-dark  rounded-full font-semibold flex items-center gap-1">
                                            Milestone <div className=" h-4 w-4 rounded-full border text-sm flex items-center justify-center">{index + 1}</div>
                                        </span>
                                        <span className="text-sm text-dark">
                                            {calculatePercentage(index)}% Funds will be released for this milestone - ${formatAmount(milestone.amount)}
                                        </span>
                                    </div>
                                    {milestones.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteMilestone(index)}
                                            className="p-2 bg-primary rounded-lg transition-colors"
                                        >
                                            <Image src="/icons/delete.svg" alt="Delete" width={20} height={20} />
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4 px-4 pb-10">
                                    <div>
                                        <label className="block font-semibold mb-2">Milestone title</label>
                                        <input
                                            type="text"
                                            value={milestone.title}
                                            onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                                            placeholder="Enter title"
                                            className="w-full px-4 py-3 border-2 border-dark rounded-xl focus:border-secondary focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold mb-2">Milestone description</label>
                                        <textarea
                                            value={milestone.description}
                                            onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                                            placeholder="Text placeholder"
                                            rows={6}
                                            className="w-full px-4 py-3 border-2 border-dark rounded-xl focus:border-secondary focus:outline-none resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold mb-2">Add more image or video (Optional)</label>
                                        <label className="block border-2 border border-dark rounded-xl p-12 text-center hover:border-secondary cursor-pointer transition-colors bg-white">
                                            <input
                                                type="file"
                                                accept="image/*,video/*"
                                                onChange={(e) => handleImageUpload(index, e)}
                                                className="hidden"
                                            />
                                            {imagePreviews[index] ? (
                                                <img src={imagePreviews[index]!} alt={`Milestone ${index + 1} preview`} className="max-h-64 mx-auto" />
                                            ) : (
                                                <>
                                                    <Image src="/icons/upload.svg" alt="Upload" width={48} height={48} className="mx-auto mb-4" />
                                                    <p className="font-semibold">Click to upload</p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleAddMilestone}
                                className="px-4 py-3 border border-dark rounded-xl font-semibold hover:bg-gray-100 transition-colors text-center text-dark"
                            >
                                Add More Milestone
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
