"use client"

import { useState } from "react"
import Image from "next/image"

interface MediaStepProps {
    formData: any
    updateFormData: (data: any) => void
    nextStep: () => void
    prevStep: () => void
    currentStep: number
}

export default function MediaStep({ formData, updateFormData, nextStep, prevStep, currentStep }: MediaStepProps) {
    const [coverPreview, setCoverPreview] = useState<string | null>(null)
    const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([])

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            updateFormData({ coverImage: file })
            setCoverPreview(URL.createObjectURL(file))
        }
    }

    const handleAdditionalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length) {
            updateFormData({ additionalImages: [...formData.additionalImages, ...files] })
            const previews = files.map(file => URL.createObjectURL(file))
            setAdditionalPreviews([...additionalPreviews, ...previews])
        }
    }

    return (
        <section className="bg-primary relative">
       
            <div className="bg-[#CBF5BD] py-12">
                <h1 className="text-3xl md:text-5xl font-bold text-center text-dark">Create a project</h1>
            </div>

            <div className=" px-4  md:px-32 py-12">
                <div>
                    <div className="hidden md:flex justify-between items-start mb-20">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Media</h2>
                            <p className="text-gray-600">Using a bright and clear photo helps people connect to your fundraiser right away.</p>
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
                            <h2 className="text-3xl font-bold">Media</h2>
                            <span className="text-lg">{currentStep}/4</span>
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
                    </div>

                    <div className="absolute hidden top-74 lg:block right-0 left-0 h-0.5 bg-dark" ></div>

            <div className="space-y-6">
                <div>
                    <label className="block font-semibold mb-2">Add Cover photo or video</label>
                    <label className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-secondary cursor-pointer transition-colors">
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleCoverUpload}
                            className="hidden"
                        />
                        {coverPreview ? (
                            <img src={coverPreview} alt="Cover preview" className="max-h-64 mx-auto" />
                        ) : (
                            <>
                                <Image src="/icons/upload.svg" alt="Upload" width={48} height={48} className="mx-auto mb-4" />
                                <p className="font-semibold">Click to Upload</p>
                            </>
                        )}
                    </label>
                </div>

                <div>
                    <label className="block font-semibold mb-2">Add more image (Optional)</label>
                    <label className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-secondary cursor-pointer transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAdditionalUpload}
                            className="hidden"
                        />
                        {additionalPreviews.length > 0 ? (
                            <div className="grid grid-cols-3 gap-4">
                                {additionalPreviews.map((preview, index) => (
                                    <img key={index} src={preview} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded-lg" />
                                ))}
                            </div>
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
            </div>
        </section>
    )
}
