"use client"

import { useState } from "react"
import Image from "next/image"

interface ReviewStepProps {
    formData: any
    updateFormData: (data: any) => void
    nextStep: () => void
    prevStep: () => void
    currentStep: number
}

export default function ReviewStep({ formData, updateFormData, nextStep, prevStep, currentStep }: ReviewStepProps) {
    const [editModal, setEditModal] = useState<{
        isOpen: boolean
        field: string
        value: any
    }>({ isOpen: false, field: '', value: '' })
    const [coverPreview, setCoverPreview] = useState<string | null>(null)
    const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([])

    const openEditModal = (field: string, value: any) => {
        setEditModal({ isOpen: true, field, value })
    }

    const closeEditModal = () => {
        setEditModal({ isOpen: false, field: '', value: '' })
    }

    const handleUpdate = () => {
        if (editModal.field === 'coverImage' && coverPreview) {
            closeEditModal()
            return
        }

        updateFormData({ [editModal.field]: editModal.value })
        closeEditModal()
    }

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
            updateFormData({ additionalImages: [...(formData.additionalImages || []), ...files] })
            const previews = files.map(file => URL.createObjectURL(file))
            setAdditionalPreviews([...(additionalPreviews || []), ...previews])
        }
    }

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
                                    onClick={handleSubmit}
                                    className="px-6 py-2 rounded-xl font-semibold transition-all bg-deepGreen text-secondary hover:bg-deepGreen/80"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>

          
                    <div className="flex flex-col md:hidden justify-between items-start gap-4 mb-10">
                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-3xl font-bold">Review</h2>
                            <span className="text-lg">{currentStep}/5</span>
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
                            <button 
                                onClick={() => openEditModal('coverImage', formData.coverImage)}
                                className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"
                            >
                                <span>Edit</span>
                                <Image src={"/icons/image-edit.svg"} alt="Edit" width={24} height={24} />
                            </button>
                        </div>
                        <div className="border-2 border-dark rounded-xl overflow-hidden">
                            <img src={URL.createObjectURL(formData.coverImage)} alt="Cover" className="w-full h-64 object-cover" />
                        </div>
                    </div>
                )}

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Project title</p>
                        <button 
                            onClick={() => openEditModal('projectName', formData.projectName)}
                            className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"
                        >
                            <span>Edit</span>
                            <Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24} />
                        </button>
                    </div>
                    <p className="text-sm">{formData.projectName || 'Not set'}</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Tags</p>
                        <button 
                            onClick={() => openEditModal('tagline', formData.tagline)}
                            className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"
                        >
                            <span>Edit</span>
                            <Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24} />
                        </button>
                    </div>
                    <p className="text-sm">{formData.tagline || 'Not set'}</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Project description</p>
                        <button 
                            onClick={() => openEditModal('description', formData.description)}
                            className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"
                        >
                            <span>Edit</span>
                            <Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24} />
                        </button>
                    </div>
                    <p className="text-sm">{formData.description || 'Not set'}</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Fundraising Target</p>
                        <button 
                            onClick={() => openEditModal('fundraisingTarget', formData.fundraisingTarget)}
                            className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"
                        >
                            <span>Edit</span>
                            <Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24} />
                        </button>
                    </div>
                    <p className="text-sm">${formData.fundraisingTarget || '0'}</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Minimum Contribution per Person</p>
                        <button 
                            onClick={() => openEditModal('minContribution', formData.minContribution)}
                            className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"
                        >
                            <span>Edit</span>
                            <Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24} />
                        </button>
                    </div>
                    <p className="text-sm">${formData.minContribution || 'Not set'}</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Maximum Contribution per Person</p>
                        <button 
                            onClick={() => openEditModal('maxContribution', formData.maxContribution)}
                            className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"
                        >
                            <span>Edit</span>
                            <Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24} />
                        </button>
                    </div>
                    <p className="text-sm">${formData.maxContribution || 'Not set'}</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Number of Milestones</p>
                        <button 
                            onClick={() => openEditModal('numberOfMilestones', formData.numberOfMilestones)}
                            className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"
                        >
                            <span>Edit</span>
                            <Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24} />
                        </button>
                    </div>
                    <p className="text-sm">{formData.numberOfMilestones || 'Not set'} Milestones</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Voting Period</p>
                        <button 
                            onClick={() => openEditModal('votingPeriod', formData.votingPeriod)}
                            className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"
                        >
                            <span>Edit</span>
                            <Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24} />
                        </button>
                    </div>
                    <p className="text-sm">{formData.votingPeriod || 'Not set'} days</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Project Wallet Address</p>
                        <button 
                            onClick={() => openEditModal('walletAddress', formData.walletAddress)}
                            className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"
                        >
                            <span>Edit</span>
                            <Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24} />
                        </button>
                    </div>
                    <p className="text-sm break-all">{formData.walletAddress || 'Not set'}</p>
                </div>

                {formData.website && (
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">Website Link</p>
                            <button 
                                onClick={() => openEditModal('website', formData.website)}
                                className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"
                            >
                                <span>Edit</span>
                                <Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24} />
                            </button>
                        </div>
                        <p className="text-sm">{formData.website}</p>
                    </div>
                )}

                {formData.twitter && (
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">Twitter (X)</p>
                            <button 
                                onClick={() => openEditModal('twitter', formData.twitter)}
                                className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"
                            >
                                <span>Edit</span>
                                <Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24} />
                            </button>
                        </div>
                        <p className="text-sm">{formData.twitter}</p>
                    </div>
                )}

                {formData.discord && (
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">Discord</p>
                            <button 
                                onClick={() => openEditModal('discord', formData.discord)}
                                className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"
                            >
                                <span>Edit</span>
                                <Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24} />
                            </button>
                        </div>
                        <p className="text-sm">{formData.discord}</p>
                    </div>
                )}

                {formData.telegram && (
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">Telegram</p>
                            <button 
                                onClick={() => openEditModal('telegram', formData.telegram)}
                                className="text-sm border border-dark px-3 py-1 rounded-lg hover:bg-gray-100 flex gap-1 items-center"
                            >
                                <span>Edit</span>
                                <Image src={"/icons/edit.svg"} alt="Edit" width={24} height={24} />
                            </button>
                        </div>
                        <p className="text-sm">{formData.telegram}</p>
                    </div>
                )}
            </div>
                </div>
            </div>

            {editModal.isOpen && (
                <>
                    <div className="fixed inset-0 bg-dark/50 z-40" onClick={closeEditModal} />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-[calc(100%-2rem)] max-w-md z-50 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {editModal.field === 'projectName' && 'Edit title'}
                                {editModal.field === 'tagline' && 'Edit tags'}
                                {editModal.field === 'description' && 'Edit project description'}
                                {editModal.field === 'fundraisingTarget' && 'Edit Fundraising Target'}
                                {editModal.field === 'minContribution' && 'Minimum contribution'}
                                {editModal.field === 'maxContribution' && 'Maximum contribution'}
                                {editModal.field === 'numberOfMilestones' && 'Edit Number of Milestones'}
                                {editModal.field === 'votingPeriod' && 'Edit Voting Period'}
                                {editModal.field === 'walletAddress' && 'Edit Wallet Address'}
                                {editModal.field === 'website' && 'Edit Website'}
                                {editModal.field === 'twitter' && 'Edit Twitter'}
                                {editModal.field === 'discord' && 'Edit Discord'}
                                {editModal.field === 'telegram' && 'Edit Telegram'}
                                {editModal.field === 'coverImage' && 'Add Cover photo or video'}
                            </h3>
                            <button
                                onClick={closeEditModal}
                                className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-dark hover:bg-gray-100"
                            >
                                <span className="text-xl">&times;</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {editModal.field === 'coverImage' ? (
                                <div>
                                    {formData.coverImage && (
                                        <div className="relative mb-4">
                                            <img 
                                                src={URL.createObjectURL(formData.coverImage)} 
                                                alt="Cover" 
                                                className="w-full h-48 object-cover rounded-xl" 
                                            />
                                            <label className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white border-2 border-dark rounded-lg font-semibold cursor-pointer hover:bg-gray-100 flex gap-2 items-center">
                                                <span>Replace</span>
                                                <Image src="/icons/refresh.svg" alt="Replace" width={20} height={20} />
                                                <input
                                                    type="file"
                                                    accept="image/*,video/*"
                                                    onChange={handleCoverUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    )}
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
                                                        <img key={index} src={preview} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
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
                            ) : editModal.field === 'description' ? (
                                <div>
                                    <label className="block font-semibold mb-2">Project description</label>
                                    <textarea
                                        value={editModal.value || ''}
                                        onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
                                        rows={8}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary focus:outline-none resize-none"
                                    />
                                </div>
                            ) : editModal.field === 'fundraisingTarget' || editModal.field === 'minContribution' || editModal.field === 'maxContribution' ? (
                                <div>
                                    <label className="block font-semibold mb-2">
                                        {editModal.field === 'fundraisingTarget' && 'Fundraising Target'}
                                        {editModal.field === 'minContribution' && 'Minimum contribution per person'}
                                        {editModal.field === 'maxContribution' && 'Maximum contribution per person'}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            value={editModal.value || ''}
                                            onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
                                            className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary focus:outline-none"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block font-semibold mb-2">
                                        {editModal.field === 'projectName' && 'Title'}
                                        {editModal.field === 'tagline' && 'Tags'}
                                        {editModal.field === 'numberOfMilestones' && 'Number of Milestones'}
                                        {editModal.field === 'votingPeriod' && 'Voting Period (days)'}
                                        {editModal.field === 'walletAddress' && 'Wallet Address'}
                                        {editModal.field === 'website' && 'Website'}
                                        {editModal.field === 'twitter' && 'Twitter'}
                                        {editModal.field === 'discord' && 'Discord'}
                                        {editModal.field === 'telegram' && 'Telegram'}
                                    </label>
                                    <input
                                        type={editModal.field === 'numberOfMilestones' || editModal.field === 'votingPeriod' ? 'number' : 'text'}
                                        value={editModal.value || ''}
                                        onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary focus:outline-none"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleUpdate}
                                className="w-full py-3 bg-deepGreen text-white rounded-xl font-semibold hover:bg-deepGreen/80 transition-colors"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    )
}
