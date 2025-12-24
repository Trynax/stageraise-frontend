"use client"

import { useState } from "react"
import Image from "next/image"

interface ProjectTypeStepProps {
    formData: any
    updateFormData: (data: any) => void
    nextStep: () => void
    currentStep: number
}

export default function ProjectTypeStep({ formData, updateFormData, nextStep, currentStep }: ProjectTypeStepProps) {
    const [selectedType, setSelectedType] = useState(formData.projectType || '')

    const handleContinue = () => {
        if (selectedType) {
            updateFormData({ projectType: selectedType })
            nextStep()
        }
    }

    return (
        <section className="bg-primary relative">
    
            <div className="bg-[#CBF5BD] py-12">
                <h1 className=" text-3xl md:text-5xl font-bold text-center text-dark">Create a project</h1>
            </div>


            <div className="px-4 md:px-32 py-16">
                <div className="hidden md:flex justify-between items-start mb-20">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Project Type</h2>
                        <p className="text-gray-600">Select the type of project you want to create</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-lg font-semibold self-end">{currentStep}/4</span>
                        <button
                            onClick={handleContinue}
                            disabled={!selectedType}
                            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                                selectedType 
                                    ? 'bg-deepGreen text-secondary hover:bg-deepGreen/80' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Continue
                        </button>
                    </div>
                </div>

                {/* Mobile View */}
                <div className="flex flex-col md:hidden justify-between items-start gap-4 mb-10 md:mb-20">
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-3xl font-bold">Project Type</h2>
                    <span className="text-lg">{currentStep}/4</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-600">Select the type of project you want to create</p>    
                    </div>
                    <button
                            onClick={handleContinue}
                            disabled={!selectedType}
                            className={`w-full px-6 py-2 rounded-xl font-semibold transition-all  ${
                                selectedType 
                                    ? 'bg-deepGreen text-secondary hover:bg-deepGreen/80' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Continue
                    </button>
                </div>
                <div className="absolute hidden lg:block top-74 right-0 left-0  h-0.5 bg-dark"></div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <button
                        onClick={() => setSelectedType('milestone')}
                        className={`border-2 rounded-2xl p-4 md:p-6 transition-all text-left flex gap-3 md:gap-4 items-center ${
                            selectedType === 'milestone'
                                ? 'border-secondary bg-secondary/10'
                                : 'border-dark hover:border-secondary/50'
                        }`}
                    >
                        <div className="flex-shrink-0 w-20 md:w-32">
                            <Image src="/images/milestone.svg" alt="Milestone" width={300} height={150} className="w-full h-auto" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">Milestone base</h3>
                            <p className="text-sm md:text-base text-gray-600">
                                Raise funds in stages. Unlock capital only when your community confirms real progress.
                            </p>
                        </div>
                    </button>

                    <button
                        onClick={() => setSelectedType('traditional')}
                        className={`border-2 rounded-2xl p-4 md:p-6 transition-all text-left flex gap-3 md:gap-4 items-center ${
                            selectedType === 'traditional'
                                ? 'border-secondary bg-secondary/10'
                                : 'border-dark hover:border-secondary/50'
                        }`}
                    >
                        <div className="flex-shrink-0 w-20 md:w-32">
                            <Image src="/images/traditional.svg" alt="Traditional" width={300} height={150} className="w-full h-auto" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">Traditional base</h3>
                            <p className="text-sm md:text-base text-gray-600">
                                Raise funds in one round. Receive the full amount after the funding deadline or your goal is met.
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </section>
    )
}
                    