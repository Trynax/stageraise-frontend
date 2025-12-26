

"use client"

import { useState } from "react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/sections/footer"
import ProjectTypeStep from "@/components/create/ProjectTypeStep"
import ProjectDetailsStep from "@/components/create/ProjectDetailsStep"
import MediaStep from "@/components/create/MediaStep"
import ReviewStep from "@/components/create/ReviewStep"
import SuccessStep from "@/components/create/SuccessStep"
import MilestoneStep from "@/components/create/milestoneStep"

export default function CreateProjectPage() {
    const [currentStep, setCurrentStep] = useState(3)
    const [formData, setFormData] = useState({
        projectType: '',
        projectName: '',
        tagline: '',
        description: '',
        fundraisingTarget: '',
        fundingDeadline: '',
        minContribution: '',
        maxContribution: '',
        numberOfMilestones: '',
        votingPeriod: '',
        walletAddress: '',
        website: '',
        twitter: '',
        discord: '',
        telegram: '',
        coverImage: null as File | null,
        additionalImages: [] as File[]
    })

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...data }))
    }

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    return (
        <>
            <Header />
            <div className="pt-16">
                {currentStep === 1 && (
                    <ProjectTypeStep 
                        formData={formData} 
                        updateFormData={updateFormData} 
                        nextStep={nextStep}
                        currentStep={currentStep}
                    />
                )}
                {currentStep === 2 && (
                    <ProjectDetailsStep 
                        formData={formData} 
                        updateFormData={updateFormData} 
                        nextStep={nextStep}
                        prevStep={prevStep}
                        currentStep={currentStep}
                    />
                )}
                {currentStep === 3 && (
                    <MilestoneStep 
                        formData={formData} 
                        updateFormData={updateFormData} 
                        nextStep={nextStep}
                        prevStep={prevStep}
                        currentStep={currentStep}
                    />
                )}
                {currentStep === 4 && (
                    <MediaStep 
                        formData={formData} 
                        updateFormData={updateFormData} 
                        nextStep={nextStep}
                        prevStep={prevStep}
                        currentStep={currentStep}
                    />
                )}
                {currentStep === 5 && (
                    <ReviewStep 
                        formData={formData}
                        updateFormData={updateFormData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        currentStep={currentStep}
                    />
                )}
                {currentStep === 6 && <SuccessStep />}
            </div>
            <Footer />
        </>
    )
}