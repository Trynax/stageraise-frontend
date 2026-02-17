

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
    const [currentStep, setCurrentStep] = useState<number>(1)
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
        paymentToken: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', // BUSD default
        walletAddress: '',
        website: '',
        twitter: '',
        discord: '',
        telegram: '',
        coverImage: null as File | null,
        additionalImages: [] as File[]
    })
    const isMilestoneProject = formData.projectType === 'milestone'
    const totalSteps = isMilestoneProject ? 5 : 4
    const mediaStep = isMilestoneProject ? 4 : 3
    const reviewStep = isMilestoneProject ? 5 : 4
    const successStep = isMilestoneProject ? 6 : 5

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...data }))
    }

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, successStep))
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
                        totalSteps={totalSteps}
                    />
                )}
                {currentStep === 2 && (
                    <ProjectDetailsStep 
                        formData={formData} 
                        updateFormData={updateFormData} 
                        nextStep={nextStep}
                        prevStep={prevStep}
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                    />
                )}
                {isMilestoneProject && currentStep === 3 && (
                    <MilestoneStep 
                        formData={formData} 
                        updateFormData={updateFormData} 
                        nextStep={nextStep}
                        prevStep={prevStep}
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                    />
                )}
                {currentStep === mediaStep && (
                    <MediaStep 
                        formData={formData} 
                        updateFormData={updateFormData} 
                        nextStep={nextStep}
                        prevStep={prevStep}
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                    />
                )}
                {currentStep === reviewStep && (
                    <ReviewStep 
                        formData={formData}
                        updateFormData={updateFormData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                    />
                )}
                {currentStep === successStep && <SuccessStep />}
            </div>
            <Footer />
        </>
    )
}
