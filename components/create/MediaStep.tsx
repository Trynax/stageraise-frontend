"use client"

import { useState } from "react"
import Image from "next/image"

interface MediaStepProps {
    formData: any
    updateFormData: (data: any) => void
    nextStep: () => void
    prevStep: () => void
    currentStep: number
    totalSteps: number
}

const MAX_ADDITIONAL_IMAGES = 3

export default function MediaStep({
    formData,
    updateFormData,
    nextStep,
    prevStep,
    currentStep,
    totalSteps
}: MediaStepProps) {
    const [logoPreview, setLogoPreview] = useState<string | null>(formData.logoPreview || null)
    const [coverPreview, setCoverPreview] = useState<string | null>(formData.coverPreview || null)
    const [additionalPreviews, setAdditionalPreviews] = useState<string[]>(formData.additionalPreviews || [])

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const preview = URL.createObjectURL(file)
            setLogoPreview(preview)
            updateFormData({ logoImage: file, logoPreview: preview })
        }
    }

    const handleRemoveLogo = () => {
        setLogoPreview(null)
        updateFormData({ logoImage: null, logoPreview: null })
    }

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const preview = URL.createObjectURL(file)
            setCoverPreview(preview)
            updateFormData({ coverImage: file, coverPreview: preview })
        }
    }

    const handleRemoveCover = () => {
        setCoverPreview(null)
        updateFormData({ coverImage: null, coverPreview: null })
    }

    const handleAdditionalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && additionalPreviews.length < MAX_ADDITIONAL_IMAGES) {
            const preview = URL.createObjectURL(file)
            const newPreviews = [...additionalPreviews, preview]
            const newImages = [...(formData.additionalImages || []), file]
            setAdditionalPreviews(newPreviews)
            updateFormData({ additionalImages: newImages, additionalPreviews: newPreviews })
        }
    }

    const handleRemoveAdditionalImage = (index: number) => {
        const newPreviews = additionalPreviews.filter((_, i) => i !== index)
        const newImages = (formData.additionalImages || []).filter((_: any, i: number) => i !== index)
        setAdditionalPreviews(newPreviews)
        updateFormData({ additionalImages: newImages, additionalPreviews: newPreviews })
    }

    return (
        <section className="bg-primary relative">
       
            <div className="bg-[#CBF5BD] py-12">
                <h1 className="text-3xl md:text-5xl font-bold text-center text-dark">Create a project</h1>
            </div>

            <div className=" px-4  md:px-32 py-12">
                <div>
                    <div className="hidden md:block sticky top-16 z-30 bg-primary -mx-4 md:-mx-32 px-4 md:px-32 mb-20">
                        <div className="flex justify-between items-start py-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Media</h2>
                                <p className="text-gray-600">Using a bright and clear photo helps people connect to your fundraiser right away.</p>
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
                                        onClick={nextStep}
                                        className="px-6 py-2 rounded-xl font-semibold transition-all bg-deepGreen text-secondary hover:bg-deepGreen/80"
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
                            <h2 className="text-3xl font-bold">Media</h2>
                            <span className="text-lg">{currentStep}/{totalSteps}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-gray-600">Using a bright and clear photo helps people connect to your fundraiser right away.</p>    
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
                        <div className="border-t-2 border-dark -mx-4"></div>
                    </div>

            <div className="space-y-6">
                {/* Logo Upload */}
                <div>
                    <label className="block font-semibold mb-2 text-center">Logo</label>
                    <div className="flex justify-center">
                        {logoPreview ? (
                            <div className="relative w-40 h-40 border-2 border-dark rounded-xl overflow-hidden group">
                                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={handleRemoveLogo}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <label className="w-60 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-secondary cursor-pointer transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                                <Image src="/icons/upload.svg" alt="Upload" width={32} height={32} className="mb-2" />
                                <p className="text-sm font-semibold">Click to Upload</p>
                            </label>
                        )}
                    </div>
                </div>

                {/* Cover Photo/Video Upload */}
                <div>
                    <label className="block font-semibold mb-2">Add Cover photo or video</label>
                    {coverPreview ? (
                        <div className="relative border-2 border-dark rounded-xl overflow-hidden group">
                            <img src={coverPreview} alt="Cover preview" className="w-full max-h-64 object-cover" />
                            <button
                                type="button"
                                onClick={handleRemoveCover}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <label className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-secondary cursor-pointer transition-colors">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleCoverUpload}
                                className="hidden"
                            />
                            <Image src="/icons/upload.svg" alt="Upload" width={48} height={48} className="mx-auto mb-4" />
                            <p className="font-semibold">Click to Upload</p>
                        </label>
                    )}
                </div>

                {/* Additional Images - Dynamic grid based on count */}
                <div>
                    <label className="block font-semibold mb-2">Add more images (Optional) - Max {MAX_ADDITIONAL_IMAGES}</label>
                    <div className={`grid gap-4 ${
                        additionalPreviews.length === 0 ? 'grid-cols-1' :
                        additionalPreviews.length === 1 ? 'grid-cols-2' :
                        'grid-cols-3'
                    }`}>
                        {/* Show uploaded images */}
                        {additionalPreviews.map((preview, index) => (
                            <div key={index} className="relative aspect-video border-2 border-dark rounded-xl overflow-hidden group">
                                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveAdditionalImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        
                        {/* Show upload button if under max */}
                        {additionalPreviews.length < MAX_ADDITIONAL_IMAGES && (
                            <label className={`border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-secondary cursor-pointer transition-colors ${additionalPreviews.length === 0 ? 'py-12' : 'aspect-video'}`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAdditionalUpload}
                                    className="hidden"
                                />
                                <Image src="/icons/upload.svg" alt="Upload" width={32} height={32} className="mb-2" />
                                <p className="text-sm font-semibold">Add Image</p>
                            </label>
                        )}
                    </div>
                </div>
            </div>
                </div>
            </div>
        </section>
    )
}
