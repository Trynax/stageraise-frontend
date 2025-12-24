"use client"

interface ReviewStepProps {
    formData: any
    nextStep: () => void
    prevStep: () => void
    currentStep: number
}

import Image from "next/image"

export default function ReviewStep({ formData, nextStep, prevStep, currentStep }: ReviewStepProps) {
    const handleSubmit = () => {
       
        console.log('Submitting project:', formData)
        nextStep()
    }

    return (
        <section className="bg-primary relative">
         
            <div className="bg-secondary py-12">
                <h1 className="text-3xl md:text-5xl font-bold text-center text-dark">Create a project</h1>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
                <div>
                   
                    <div className="hidden md:flex justify-between items-start mb-20">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Review</h2>
                            <p className="text-gray-600">Review your project details carefully. Funders will rely on this information to make decisions.</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-lg font-semibold self-end">{currentStep}/4</span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-2 border-2 border-dark rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                                >
                                  <Image src="/icons/back.svg" alt="Back" width={24} height={24} />
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-2 rounded-xl font-semibold transition-all bg-deepGreen text-secondary hover:bg-deepGreen/80"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Step Header */}
                    <div className="flex flex-col md:hidden justify-between items-start gap-4 mb-10">
                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-3xl font-bold">Review</h2>
                            <span className="text-lg">{currentStep}/4</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-gray-600">Review your project details carefully. Funders will rely on this information to make decisions.</p>    
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
                                onClick={handleSubmit}
                                className="flex-1 px-6 py-2 rounded-xl font-semibold transition-all bg-deepGreen text-secondary hover:bg-deepGreen/80"
                            >
                                Submit
                            </button>
                        </div>
                    </div>

                    <div className="absolute hidden top-72 lg:block right-0 left-0 h-0.5 bg-dark"></div>

            <div className="space-y-6">
                {formData.coverImage && (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">Media</p>
                            <button className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"><span>Edit</span><Image src={"/icons/image-edit.svg"} alt="Edit" width={24} height={24}></Image></button>
                        </div>
                        <div className="border-2 border-dark rounded-xl overflow-hidden">
                            <img src={URL.createObjectURL(formData.coverImage)} alt="Cover" className="w-full h-64 object-cover" />
                        </div>
                    </div>
                )}

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Project title</p>
                        <button className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"><span>Edit</span><Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24}></Image></button>
                    </div>
                    <p className="text-sm">{formData.projectName || 'Not set'}</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Tags</p>
                        <button className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"><span>Edit</span><Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24}></Image></button>
                    </div>
                    <p className="text-sm">{formData.tagline || 'Not set'}</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Project description</p>
                        <button className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"><span>Edit</span><Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24}></Image></button>
                    </div>
                    <p className="text-sm">{formData.description || 'Not set'}</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Fundraising Target</p>
                        <button className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"><span>Edit</span><Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24}></Image></button>
                    </div>
                    <p className="text-sm">${formData.fundraisingTarget || '0'}</p>
                 
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Minimum Contribution per Person</p>
                        <button className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"><span>Edit</span><Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24}></Image></button>
                    </div>
                    <p className="text-sm">${formData.minContribution || 'Not set'}</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Maximum Contribution per Person</p>
                        <button className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"><span>Edit</span><Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24}></Image></button>
                    </div>
                    <p className="text-sm">${formData.maxContribution || 'Not set'}</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Number of Milestones</p>
                        <button className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"><span>Edit</span><Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24}></Image></button>
                    </div>
                    <p className="text-sm">{formData.numberOfMilestones || 'Not set'} Milestones</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Voting Period</p>
                        <button className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"><span>Edit</span><Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24}></Image></button>
                    </div>
                    <p className="text-sm">{formData.votingPeriod || 'Not set'} days</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Project Wallet Address</p>
                        <button className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"><span>Edit</span><Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24}></Image></button>
                    </div>
                    <p className="text-sm break-all">{formData.walletAddress || 'Not set'}</p>
                </div>

                {formData.website && (
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">Website Link</p>
                            <button className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"><span>Edit</span><Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24}></Image></button>
                        </div>
                        <p className="text-sm">{formData.website}</p>
                    </div>
                )}

                {formData.twitter && (
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">Twitter (X)</p>
                            <button className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"><span>Edit</span><Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24}></Image></button>
                        </div>
                        <p className="text-sm">{formData.twitter}</p>
                    </div>
                )}

                {formData.discord && (
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">Discord</p>
                            <button className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"><span>Edit</span><Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24}></Image></button>
                        </div>
                        <p className="text-sm">{formData.discord}</p>
                    </div>
                )}

                {formData.telegram && (
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">Telegram</p>
                            <button className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"><span>Edit</span><Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24}></Image></button>
                        </div>
                        <p className="text-sm">{formData.telegram}</p>
                    </div>
                )}
            </div>
                </div>
            </div>
        </section>
    )
}
