'use client';

import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

interface VotesFilterProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: VotesFilterState) => void;
}

export interface VotesFilterState {
    votingStatus: string[];
    milestone: { min: number; max: number };
    votingProgress: { min: number; max: number };
    fundraisingTarget: { min: number; max: number };
    timeRemaining: { min: number; max: number };
    funders: { min: number; max: number };
}

export default function VotesFilter({ isOpen, onClose, onApplyFilters }: VotesFilterProps) {
    const formatValue = (value: number): string => {
        if (value >= 1_000_000_000_000) {
            return `$${(value / 1_000_000_000_000).toFixed(1)}t`;
        } else if (value >= 1_000_000_000) {
            return `$${(value / 1_000_000_000).toFixed(1)}b`;
        } else if (value >= 1_000_000) {
            return `$${(value / 1_000_000).toFixed(1)}m`;
        } else if (value >= 1_000) {
            return `$${(value / 1_000).toFixed(0)}k`;
        }
        return `$${value}`;
    };

    const [filters, setFilters] = useState<VotesFilterState>({
        votingStatus: [],
        milestone: { min: 0, max: 30 },
        votingProgress: { min: 0, max: 100 },
        fundraisingTarget: { min: 0, max: 100000 },
        timeRemaining: { min: 1, max: 30 },
        funders: { min: 10, max: 3000 },
    });

    const [rangeLimits, setRangeLimits] = useState({
        milestone: { min: 0, max: 30 },
        fundraisingTarget: { min: 0, max: 100000 },
    });

    const [expandedSections, setExpandedSections] = useState({
        votingStatus: true,
        milestone: true,
        votingProgress: true,
        fundraisingTarget: true,
        timeRemaining: true,
        funders: true,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCheckboxChange = (category: 'votingStatus', value: string) => {
        setFilters(prev => ({
            ...prev,
            [category]: prev[category].includes(value)
                ? prev[category].filter(item => item !== value)
                : [...prev[category], value]
        }));
    };

    const handleRangeChange = (category: keyof VotesFilterState, type: 'min' | 'max', value: number) => {
        setFilters(prev => ({
            ...prev,
            [category]: { ...(prev[category] as any), [type]: value }
        }));
    };

    const handleReset = () => {
        setFilters({
            votingStatus: [],
            milestone: { min: 0, max: 30 },
            votingProgress: { min: 0, max: 100 },
            fundraisingTarget: { min: 0, max: 100000 },
            timeRemaining: { min: 1, max: 30 },
            funders: { min: 10, max: 3000 },
        });
        setRangeLimits({
            milestone: { min: 0, max: 30 },
            fundraisingTarget: { min: 0, max: 100000 },
        });
    };

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-dark/50 z-40" onClick={onClose} />

            <div className="fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[700px] bg-primary z-50 flex flex-col">
                <div className="flex-shrink-0 p-5 border-b-2 border-dark">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Filters</h2>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-dark hover:bg-gray-100">
                            <span className="text-xl">&times;</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="hidden md:block space-y-4">
                
                        <div>
                            <button
                                onClick={() => toggleSection('votingStatus')}
                                className="flex justify-between items-center w-full mb-6"
                            >
                                <span className="font-semibold">Voting Status</span>
                                <span className="w-5 h-5 inline-flex items-center justify-center">
                                    {expandedSections.votingStatus ? (
                                        <ChevronUpIcon className="w-5 h-5" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5" />
                                    )}
                                </span>
                            </button>
                            {expandedSections.votingStatus && (
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.votingStatus.includes('voting-open')}
                                            onChange={() => handleCheckboxChange('votingStatus', 'voting-open')}
                                            className="w-4 h-4 accent-secondary"
                                        />
                                        <span>Voting Open</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.votingStatus.includes('approved')}
                                            onChange={() => handleCheckboxChange('votingStatus', 'approved')}
                                            className="w-4 h-4 accent-secondary"
                                        />
                                        <span>Approved</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.votingStatus.includes('failed')}
                                            onChange={() => handleCheckboxChange('votingStatus', 'failed')}
                                            className="w-4 h-4 accent-secondary"
                                        />
                                        <span>Failed</span>
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-300"></div>

          
                        <div>
                            <button
                                onClick={() => toggleSection('milestone')}
                                className="flex justify-between items-center w-full mb-6"
                            >
                                <span className="font-semibold">Milestone</span>
                                <span className="w-5 h-5 inline-flex items-center justify-center">
                                    {expandedSections.milestone ? (
                                        <ChevronUpIcon className="w-5 h-5" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5" />
                                    )}
                                </span>
                            </button>
                            {expandedSections.milestone && (
                                <div>
                                    <div className="mb-4">
                                        <div className="relative mb-6">
                                            <div className="absolute -top-6 left-0 right-0 h-6">
                                                <span 
                                                    className="absolute -translate-x-1/2 bg-[#4BBF28] text-white px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                                                    style={{ left: `${(filters.milestone.min / Math.max(rangeLimits.milestone.max, 1)) * 100}%` }}
                                                >
                                                    {filters.milestone.min}
                                                </span>
                                                <span 
                                                    className="absolute -translate-x-1/2 bg-[#4BBF28] text-white px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                                                    style={{ left: `${(filters.milestone.max / Math.max(rangeLimits.milestone.max, 1)) * 100}%` }}
                                                >
                                                    {filters.milestone.max}
                                                </span>
                                            </div>
                                            <div className="relative h-2 bg-[#F4FDF0] rounded-full border border-dark">
                                                <div 
                                                    className="absolute h-full bg-[#4BBF28] rounded-full border border-[#4BBF28]"
                                                    style={{
                                                        left: `${(filters.milestone.min / Math.max(rangeLimits.milestone.max, 1)) * 100}%`,
                                                        right: `${100 - (filters.milestone.max / Math.max(rangeLimits.milestone.max, 1)) * 100}%`
                                                    }}
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={rangeLimits.milestone.max}
                                                    value={filters.milestone.min}
                                                    onChange={(e) => {
                                                        const newMin = Number(e.target.value);
                                                        handleRangeChange('milestone', 'min', Math.min(newMin, filters.milestone.max - 1));
                                                    }}
                                                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4BBF28] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4BBF28] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                                                    style={{ zIndex: filters.milestone.min > filters.milestone.max - 2 ? 5 : 3 }}
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={rangeLimits.milestone.max}
                                                    value={filters.milestone.max}
                                                    onChange={(e) => {
                                                        const newMax = Number(e.target.value);
                                                        handleRangeChange('milestone', 'max', Math.max(newMax, filters.milestone.min + 1));
                                                    }}
                                                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4BBF28] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4BBF28] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                                                    style={{ zIndex: 4 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-600 mb-1 block">Min</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={rangeLimits.milestone.min}
                                                onChange={(e) => {
                                                    const val = Math.max(0, Number(e.target.value) || 0);
                                                    setRangeLimits(prev => ({
                                                        ...prev,
                                                        milestone: { ...prev.milestone, min: val }
                                                    }));
                                                    if (filters.milestone.min < val) {
                                                        handleRangeChange('milestone', 'min', val);
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-600 mb-1 block">Max</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={rangeLimits.milestone.max}
                                                onChange={(e) => {
                                                    const val = Math.max(1, Number(e.target.value) || 1);
                                                    setRangeLimits(prev => ({
                                                        ...prev,
                                                        milestone: { ...prev.milestone, max: val }
                                                    }));
                                                    if (filters.milestone.max > val) {
                                                        handleRangeChange('milestone', 'max', val);
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-300"></div>

          
                        <div>
                            <button
                                onClick={() => toggleSection('votingProgress')}
                                className="flex justify-between items-center w-full mb-6"
                            >
                                <span className="font-semibold">Voting Progress</span>
                                <span className="w-5 h-5 inline-flex items-center justify-center">
                                    {expandedSections.votingProgress ? (
                                        <ChevronUpIcon className="w-5 h-5" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5" />
                                    )}
                                </span>
                            </button>
                            {expandedSections.votingProgress && (
                                <div>
                                    <div className="mb-4">
                                        <div className="relative mb-6">
                                            <div className="absolute -top-6 left-0 right-0 h-6">
                                                <span 
                                                    className="absolute -translate-x-1/2 bg-[#4BBF28] text-white px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                                                    style={{ left: `${Math.max(0, Math.min(100, filters.votingProgress.min))}%` }}
                                                >
                                                    {filters.votingProgress.min}%
                                                </span>
                                                <span 
                                                    className="absolute -translate-x-1/2 bg-[#4BBF28] text-white px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                                                    style={{ left: `${Math.max(0, Math.min(100, filters.votingProgress.max))}%` }}
                                                >
                                                    {filters.votingProgress.max}%
                                                </span>
                                            </div>
                                            <div className="relative h-2 bg-[#F4FDF0] rounded-full border border-dark">
                                                <div 
                                                    className="absolute h-full bg-[#4BBF28] rounded-full border border-[#4BBF28]"
                                                    style={{
                                                        left: `${Math.max(0, Math.min(100, filters.votingProgress.min))}%`,
                                                        right: `${Math.max(0, Math.min(100, 100 - filters.votingProgress.max))}%`
                                                    }}
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={Math.max(0, Math.min(100, filters.votingProgress.min))}
                                                    onChange={(e) => handleRangeChange('votingProgress', 'min', Math.min(Number(e.target.value), filters.votingProgress.max - 1))}
                                                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4BBF28] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4BBF28] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                                                    style={{ zIndex: filters.votingProgress.min > filters.votingProgress.max - 10 ? 5 : 3 }}
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={Math.max(0, Math.min(100, filters.votingProgress.max))}
                                                    onChange={(e) => handleRangeChange('votingProgress', 'max', Math.max(Number(e.target.value), filters.votingProgress.min + 1))}
                                                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4BBF28] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4BBF28] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                                                    style={{ zIndex: 4 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-600 mb-1 block">Min</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={filters.votingProgress.min}
                                                onChange={(e) => handleRangeChange('votingProgress', 'min', Math.max(0, Math.min(100, Number(e.target.value))))}
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-600 mb-1 block">Max</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={filters.votingProgress.max}
                                                onChange={(e) => handleRangeChange('votingProgress', 'max', Math.max(0, Math.min(100, Number(e.target.value))))}
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-300"></div>

                     
                        <div>
                            <button
                                onClick={() => toggleSection('fundraisingTarget')}
                                className="flex justify-between items-center w-full mb-6"
                            >
                                <span className="font-semibold">Fundraising Target</span>
                                <span className="w-5 h-5 inline-flex items-center justify-center">
                                    {expandedSections.fundraisingTarget ? (
                                        <ChevronUpIcon className="w-5 h-5" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5" />
                                    )}
                                </span>
                            </button>
                            {expandedSections.fundraisingTarget && (
                                <div>
                                    <div className="relative mb-6">
                                        <div className="absolute -top-6 left-0 right-0 h-6">
                                            <span 
                                                className="absolute -translate-x-1/2 bg-[#4BBF28] text-white px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                                                style={{ left: `${(filters.fundraisingTarget.min / Math.max(rangeLimits.fundraisingTarget.max, 1)) * 100}%` }}
                                            >
                                                {formatValue(filters.fundraisingTarget.min)}
                                            </span>
                                            <span 
                                                className="absolute -translate-x-1/2 bg-[#4BBF28] text-white px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                                                style={{ left: `${(filters.fundraisingTarget.max / Math.max(rangeLimits.fundraisingTarget.max, 1)) * 100}%` }}
                                            >
                                                {formatValue(filters.fundraisingTarget.max)}
                                            </span>
                                        </div>
                                        <div className="relative h-2 bg-[#F4FDF0] rounded-full border border-dark">
                                            <div 
                                                className="absolute h-full bg-[#4BBF28] rounded-full border border-[#4BBF28]"
                                                style={{
                                                    left: `${(filters.fundraisingTarget.min / Math.max(rangeLimits.fundraisingTarget.max, 1)) * 100}%`,
                                                    right: `${100 - (filters.fundraisingTarget.max / Math.max(rangeLimits.fundraisingTarget.max, 1)) * 100}%`
                                                }}
                                            />
                                            <input
                                                type="range"
                                                min="0"
                                                max={rangeLimits.fundraisingTarget.max}
                                                step="5000"
                                                value={filters.fundraisingTarget.min}
                                                onChange={(e) => {
                                                    const newMin = Number(e.target.value);
                                                    handleRangeChange('fundraisingTarget', 'min', Math.min(newMin, filters.fundraisingTarget.max - 1));
                                                }}
                                                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4BBF28] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4BBF28] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                                                style={{ zIndex: filters.fundraisingTarget.min > filters.fundraisingTarget.max - 10000 ? 5 : 3 }}
                                            />
                                            <input
                                                type="range"
                                                min="0"
                                                max={rangeLimits.fundraisingTarget.max}
                                                step="5000"
                                                value={filters.fundraisingTarget.max}
                                                onChange={(e) => {
                                                    const newMax = Number(e.target.value);
                                                    handleRangeChange('fundraisingTarget', 'max', Math.max(newMax, filters.fundraisingTarget.min + 1));
                                                }}
                                                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4BBF28] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4BBF28] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                                                style={{ zIndex: 4 }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-600 mb-1 block">Min</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="5000"
                                                value={rangeLimits.fundraisingTarget.min}
                                                onChange={(e) => {
                                                    const val = Math.max(0, Number(e.target.value) || 0);
                                                    setRangeLimits(prev => ({
                                                        ...prev,
                                                        fundraisingTarget: { ...prev.fundraisingTarget, min: val }
                                                    }));
                                                    if (filters.fundraisingTarget.min < val) {
                                                        handleRangeChange('fundraisingTarget', 'min', val);
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-600 mb-1 block">Max</label>
                                            <input
                                                type="number"
                                                min="1"
                                                step="5000"
                                                value={rangeLimits.fundraisingTarget.max}
                                                onChange={(e) => {
                                                    const val = Math.max(1, Number(e.target.value) || 1);
                                                    setRangeLimits(prev => ({
                                                        ...prev,
                                                        fundraisingTarget: { ...prev.fundraisingTarget, max: val }
                                                    }));
                                                    if (filters.fundraisingTarget.max > val) {
                                                        handleRangeChange('fundraisingTarget', 'max', val);
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-300"></div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <button
                                    onClick={() => toggleSection('funders')}
                                    className="flex justify-between items-center w-full mb-6"
                                >
                                    <span className="font-semibold">Funders</span>
                                    <span className="w-5 h-5 inline-flex items-center justify-center">
                                        {expandedSections.funders ? (
                                            <ChevronUpIcon className="w-5 h-5" />
                                        ) : (
                                            <ChevronDownIcon className="w-5 h-5" />
                                        )}
                                    </span>
                                </button>
                                {expandedSections.funders && (
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={filters.funders.min}
                                            onChange={(e) => handleRangeChange('funders', 'min', Number(e.target.value))}
                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            placeholder="Min"
                                        />
                                        <input
                                            type="number"
                                            value={filters.funders.max}
                                            onChange={(e) => handleRangeChange('funders', 'max', Number(e.target.value))}
                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            placeholder="Max"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <button
                                    onClick={() => toggleSection('timeRemaining')}
                                    className="flex justify-between items-center w-full mb-6"
                                >
                                    <span className="font-semibold">Time Remaining</span>
                                    <span className="w-5 h-5 inline-flex items-center justify-center">
                                        {expandedSections.timeRemaining ? (
                                            <ChevronUpIcon className="w-5 h-5" />
                                        ) : (
                                            <ChevronDownIcon className="w-5 h-5" />
                                        )}
                                    </span>
                                </button>
                                {expandedSections.timeRemaining && (
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={filters.timeRemaining.min}
                                            onChange={(e) => handleRangeChange('timeRemaining', 'min', Number(e.target.value))}
                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            placeholder="Days"
                                        />
                                        <input
                                            type="number"
                                            value={filters.timeRemaining.max}
                                            onChange={(e) => handleRangeChange('timeRemaining', 'max', Number(e.target.value))}
                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            placeholder="Days"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

            
                    <div className="md:hidden space-y-2">
                 
                        <div>
                            <button
                                onClick={() => toggleSection('votingStatus')}
                                className="flex justify-between items-center w-full mb-3"
                            >
                                <span className="font-semibold">Voting Status</span>
                                <span className="w-5 h-5 inline-flex items-center justify-center">
                                    {expandedSections.votingStatus ? (
                                        <ChevronUpIcon className="w-5 h-5" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5" />
                                    )}
                                </span>
                            </button>
                            {expandedSections.votingStatus && (
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.votingStatus.includes('voting-open')}
                                            onChange={() => handleCheckboxChange('votingStatus', 'voting-open')}
                                            className="w-4 h-4 accent-secondary"
                                        />
                                        <span>Voting Open</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.votingStatus.includes('approved')}
                                            onChange={() => handleCheckboxChange('votingStatus', 'approved')}
                                            className="w-4 h-4 accent-secondary"
                                        />
                                        <span>Approved</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.votingStatus.includes('failed')}
                                            onChange={() => handleCheckboxChange('votingStatus', 'failed')}
                                            className="w-4 h-4 accent-secondary"
                                        />
                                        <span>Failed</span>
                                    </label>
                                </div>
                            )}
                        </div>

                       
                        <div>
                            <button
                                onClick={() => toggleSection('milestone')}
                                className="flex justify-between items-center w-full mb-6"
                            >
                                <span className="font-semibold">Milestone</span>
                                <span className="w-5 h-5 inline-flex items-center justify-center">
                                    {expandedSections.milestone ? (
                                        <ChevronUpIcon className="w-5 h-5" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5" />
                                    )}
                                </span>
                            </button>
                            {expandedSections.milestone && (
                                <div>
                                    <div className="mb-4">
                                        <div className="relative mb-6">
                                            <div className="absolute -top-6 left-0 right-0 h-6">
                                                <span 
                                                    className="absolute -translate-x-1/2 bg-[#4BBF28] text-white px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                                                    style={{ left: `${(filters.milestone.min / Math.max(rangeLimits.milestone.max, 1)) * 100}%` }}
                                                >
                                                    {filters.milestone.min}
                                                </span>
                                                <span 
                                                    className="absolute -translate-x-1/2 bg-[#4BBF28] text-white px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                                                    style={{ left: `${(filters.milestone.max / Math.max(rangeLimits.milestone.max, 1)) * 100}%` }}
                                                >
                                                    {filters.milestone.max}
                                                </span>
                                            </div>
                                            <div className="relative h-2 bg-[#F4FDF0] rounded-full border border-dark">
                                                <div 
                                                    className="absolute h-full bg-[#4BBF28] rounded-full border border-[#4BBF28]"
                                                    style={{
                                                        left: `${(filters.milestone.min / Math.max(rangeLimits.milestone.max, 1)) * 100}%`,
                                                        right: `${100 - (filters.milestone.max / Math.max(rangeLimits.milestone.max, 1)) * 100}%`
                                                    }}
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={rangeLimits.milestone.max}
                                                    value={filters.milestone.min}
                                                    onChange={(e) => {
                                                        const newMin = Number(e.target.value);
                                                        handleRangeChange('milestone', 'min', Math.min(newMin, filters.milestone.max - 1));
                                                    }}
                                                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4BBF28] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4BBF28] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                                                    style={{ zIndex: filters.milestone.min > filters.milestone.max - 2 ? 5 : 3 }}
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={rangeLimits.milestone.max}
                                                    value={filters.milestone.max}
                                                    onChange={(e) => {
                                                        const newMax = Number(e.target.value);
                                                        handleRangeChange('milestone', 'max', Math.max(newMax, filters.milestone.min + 1));
                                                    }}
                                                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4BBF28] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4BBF28] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                                                    style={{ zIndex: 4 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-600 mb-1 block">Min</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={rangeLimits.milestone.min}
                                                onChange={(e) => {
                                                    const val = Math.max(0, Number(e.target.value) || 0);
                                                    setRangeLimits(prev => ({
                                                        ...prev,
                                                        milestone: { ...prev.milestone, min: val }
                                                    }));
                                                    if (filters.milestone.min < val) {
                                                        handleRangeChange('milestone', 'min', val);
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-600 mb-1 block">Max</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={rangeLimits.milestone.max}
                                                onChange={(e) => {
                                                    const val = Math.max(1, Number(e.target.value) || 1);
                                                    setRangeLimits(prev => ({
                                                        ...prev,
                                                        milestone: { ...prev.milestone, max: val }
                                                    }));
                                                    if (filters.milestone.max > val) {
                                                        handleRangeChange('milestone', 'max', val);
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                      
                        <div>
                            <button
                                onClick={() => toggleSection('votingProgress')}
                                className="flex justify-between items-center w-full mb-6"
                            >
                                <span className="font-semibold">Voting Progress</span>
                                <span className="w-5 h-5 inline-flex items-center justify-center">
                                    {expandedSections.votingProgress ? (
                                        <ChevronUpIcon className="w-5 h-5" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5" />
                                    )}
                                </span>
                            </button>
                            {expandedSections.votingProgress && (
                                <div>
                                    <div className="mb-4">
                                        <div className="relative mb-6">
                                            <div className="absolute -top-6 left-0 right-0 h-6">
                                                <span 
                                                    className="absolute -translate-x-1/2 bg-[#4BBF28] text-white px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                                                    style={{ left: `${Math.max(0, Math.min(100, filters.votingProgress.min))}%` }}
                                                >
                                                    {filters.votingProgress.min}%
                                                </span>
                                                <span 
                                                    className="absolute -translate-x-1/2 bg-[#4BBF28] text-white px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                                                    style={{ left: `${Math.max(0, Math.min(100, filters.votingProgress.max))}%` }}
                                                >
                                                    {filters.votingProgress.max}%
                                                </span>
                                            </div>
                                            <div className="relative h-2 bg-[#F4FDF0] rounded-full border border-dark">
                                                <div 
                                                    className="absolute h-full bg-[#4BBF28] rounded-full border border-[#4BBF28]"
                                                    style={{
                                                        left: `${Math.max(0, Math.min(100, filters.votingProgress.min))}%`,
                                                        right: `${Math.max(0, Math.min(100, 100 - filters.votingProgress.max))}%`
                                                    }}
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={Math.max(0, Math.min(100, filters.votingProgress.min))}
                                                    onChange={(e) => handleRangeChange('votingProgress', 'min', Math.min(Number(e.target.value), filters.votingProgress.max - 1))}
                                                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4BBF28] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4BBF28] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                                                    style={{ zIndex: filters.votingProgress.min > filters.votingProgress.max - 10 ? 5 : 3 }}
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={Math.max(0, Math.min(100, filters.votingProgress.max))}
                                                    onChange={(e) => handleRangeChange('votingProgress', 'max', Math.max(Number(e.target.value), filters.votingProgress.min + 1))}
                                                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4BBF28] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4BBF28] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                                                    style={{ zIndex: 4 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-600 mb-1 block">Min</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={filters.votingProgress.min}
                                                onChange={(e) => handleRangeChange('votingProgress', 'min', Math.max(0, Math.min(100, Number(e.target.value))))}
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-600 mb-1 block">Max</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={filters.votingProgress.max}
                                                onChange={(e) => handleRangeChange('votingProgress', 'max', Math.max(0, Math.min(100, Number(e.target.value))))}
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

           
                        <div>
                            <button
                                onClick={() => toggleSection('fundraisingTarget')}
                                className="flex justify-between items-center w-full mb-6"
                            >
                                <span className="font-semibold">Fundraising Target</span>
                                <span className="w-5 h-5 inline-flex items-center justify-center">
                                    {expandedSections.fundraisingTarget ? (
                                        <ChevronUpIcon className="w-5 h-5" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5" />
                                    )}
                                </span>
                            </button>
                            {expandedSections.fundraisingTarget && (
                                <div>
                                    <div className="relative mb-6">
                                        <div className="absolute -top-6 left-0 right-0 h-6">
                                            <span 
                                                className="absolute -translate-x-1/2 bg-[#4BBF28] text-white px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                                                style={{ left: `${(filters.fundraisingTarget.min / Math.max(rangeLimits.fundraisingTarget.max, 1)) * 100}%` }}
                                            >
                                                {formatValue(filters.fundraisingTarget.min)}
                                            </span>
                                            <span 
                                                className="absolute -translate-x-1/2 bg-[#4BBF28] text-white px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                                                style={{ left: `${(filters.fundraisingTarget.max / Math.max(rangeLimits.fundraisingTarget.max, 1)) * 100}%` }}
                                            >
                                                {formatValue(filters.fundraisingTarget.max)}
                                            </span>
                                        </div>
                                        <div className="relative h-2 bg-[#F4FDF0] rounded-full border border-dark">
                                            <div 
                                                className="absolute h-full bg-[#4BBF28] rounded-full border border-[#4BBF28]"
                                                style={{
                                                    left: `${(filters.fundraisingTarget.min / Math.max(rangeLimits.fundraisingTarget.max, 1)) * 100}%`,
                                                    right: `${100 - (filters.fundraisingTarget.max / Math.max(rangeLimits.fundraisingTarget.max, 1)) * 100}%`
                                                }}
                                            />
                                            <input
                                                type="range"
                                                min="0"
                                                max={rangeLimits.fundraisingTarget.max}
                                                step="5000"
                                                value={filters.fundraisingTarget.min}
                                                onChange={(e) => {
                                                    const newMin = Number(e.target.value);
                                                    handleRangeChange('fundraisingTarget', 'min', Math.min(newMin, filters.fundraisingTarget.max - 1));
                                                }}
                                                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4BBF28] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4BBF28] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                                                style={{ zIndex: filters.fundraisingTarget.min > filters.fundraisingTarget.max - 10000 ? 5 : 3 }}
                                            />
                                            <input
                                                type="range"
                                                min="0"
                                                max={rangeLimits.fundraisingTarget.max}
                                                step="5000"
                                                value={filters.fundraisingTarget.max}
                                                onChange={(e) => {
                                                    const newMax = Number(e.target.value);
                                                    handleRangeChange('fundraisingTarget', 'max', Math.max(newMax, filters.fundraisingTarget.min + 1));
                                                }}
                                                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4BBF28] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4BBF28] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                                                style={{ zIndex: 4 }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-600 mb-1 block">Min</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="5000"
                                                value={rangeLimits.fundraisingTarget.min}
                                                onChange={(e) => {
                                                    const val = Math.max(0, Number(e.target.value) || 0);
                                                    setRangeLimits(prev => ({
                                                        ...prev,
                                                        fundraisingTarget: { ...prev.fundraisingTarget, min: val }
                                                    }));
                                                    if (filters.fundraisingTarget.min < val) {
                                                        handleRangeChange('fundraisingTarget', 'min', val);
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-600 mb-1 block">Max</label>
                                            <input
                                                type="number"
                                                min="1"
                                                step="5000"
                                                value={rangeLimits.fundraisingTarget.max}
                                                onChange={(e) => {
                                                    const val = Math.max(1, Number(e.target.value) || 1);
                                                    setRangeLimits(prev => ({
                                                        ...prev,
                                                        fundraisingTarget: { ...prev.fundraisingTarget, max: val }
                                                    }));
                                                    if (filters.fundraisingTarget.max > val) {
                                                        handleRangeChange('fundraisingTarget', 'max', val);
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                
                        <div>
                            <button
                                onClick={() => toggleSection('funders')}
                                className="flex justify-between items-center w-full mb-6"
                            >
                                <span className="font-semibold">Funders</span>
                                <span className="w-5 h-5 inline-flex items-center justify-center">
                                    {expandedSections.funders ? (
                                        <ChevronUpIcon className="w-5 h-5" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5" />
                                    )}
                                </span>
                            </button>
                            {expandedSections.funders && (
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={filters.funders.min}
                                        onChange={(e) => handleRangeChange('funders', 'min', Number(e.target.value))}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                        placeholder="Min"
                                    />
                                    <input
                                        type="number"
                                        value={filters.funders.max}
                                        onChange={(e) => handleRangeChange('funders', 'max', Number(e.target.value))}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                        placeholder="Max"
                                    />
                                </div>
                            )}
                        </div>

                   
                        <div>
                            <button
                                onClick={() => toggleSection('timeRemaining')}
                                className="flex justify-between items-center w-full mb-3"
                            >
                                <span className="font-semibold">Time Remaining</span>
                                <span className="w-5 h-5 inline-flex items-center justify-center">
                                    {expandedSections.timeRemaining ? (
                                        <ChevronUpIcon className="w-5 h-5" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5" />
                                    )}
                                </span>
                            </button>
                            {expandedSections.timeRemaining && (
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={filters.timeRemaining.min}
                                        onChange={(e) => handleRangeChange('timeRemaining', 'min', Number(e.target.value))}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                        placeholder="Days"
                                    />
                                    <input
                                        type="number"
                                        value={filters.timeRemaining.max}
                                        onChange={(e) => handleRangeChange('timeRemaining', 'max', Number(e.target.value))}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                        placeholder="Days"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

               
                <div className="flex-shrink-0 p-6 border-t-2 border-dark bg-primary">
                    <div className="flex gap-4">
                        <button
                            onClick={handleApply}
                            className="flex-1 py-3 bg-deepGreen text-secondary rounded-xl font-semibold hover:bg-deepGreen/80 transition-colors flex items-center justify-center gap-2"
                        >
                            Filter
                            <span className="border border-secondary text-secondary rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                {filters.votingStatus.length}
                            </span>
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 py-3 bg-white border-2 border-dark rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Reset Filter
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
