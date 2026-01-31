"use client"

import { ButtonConnect} from "./connect-button"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useAccount, useDisconnect } from "wagmi"

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}......${addr.slice(-4)}`;
    };

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    return (
        <>
        <header className="flex fixed top-0 left-0 right-0 z-50 items-center gap-3 sm:gap-5 px-4 sm:px-8 lg:px-32 py-3 sm:py-4 bg-primary w-full border-b-3 border-dark">
            <div className="flex items-center">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center">
                    <Image src="/images/logo.svg" alt="Stage Raise Logo" width={150} height={40} />
                </Link>
            </div>

            <div className="hidden lg:flex flex-1 justify-center gap-4 md:gap-2 xl:gap-12 text-sm">
                <Link href="/projects" className="nav-link">Projects</Link>
                <Link href="/votes" className="nav-link">Votes</Link>
                <Link href="/how-it-works" className="nav-link">Learn</Link>
                <Link href="/about" className="nav-link">About</Link>
            </div>

        
            <div className="flex-1 lg:hidden"></div>

            <div className="flex items-center gap-2 sm:gap-3">
               
                <div className="hidden sm:block">
                    <ButtonConnect />
                </div>

                <div className="sm:hidden">
                    <ButtonConnect accountStatus="avatar" chainStatus="none" />
                </div>

                <button 
                    className="lg:hidden p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <Image src="/icons/menuhamburger.svg" alt="Menu" width={24} height={24} />
                </button>

            </div>
        </header>

        {mobileMenuOpen && (
            <div className="fixed inset-0 bg-primary z-50 lg:hidden">
                <div className="flex flex-col h-full p-6 relative">
            
                    <div className="flex justify-between items-center mb-8">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center">
                            <Image src="/images/logo.svg" alt="Stage Raise Logo" width={150} height={40} />
                        </Link>
                        <button 
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-dark hover:bg-gray-100"
                        >
                            <span className="text-xl">&times;</span>
                        </button>
                    </div>

          
                    {isConnected && address && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4 border-dark">
                               <Image src="/icons/profile.svg" alt="Wallet" width={43} height={43} />
                                <span className="text-sm font-mono">{formatAddress(address)}</span>
                                <button className="ml-auto">
                                    <Image src="/icons/copy.svg" alt="Copy" width={16} height={16} />
                                </button>
                            </div>
                            <Link
                                href="/dashboard"
                                className="block w-full py-3 bg-secondary text-dark rounded-xl font-semibold text-center hover:bg-secondary/80 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Go to dashboard
                            </Link>

                            <hr className="border-dark absolute left-0 right-0 mt-2 border-2" />
                        </div>
                    )}

                
                    <nav className="flex flex-col gap-6 flex-1">
                        <Link 
                            href="/projects" 
                            className="text-lg font-medium hover:text-deepGreen transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Projects
                        </Link>
                        <Link 
                            href="/votes" 
                            className="text-lg font-medium hover:text-deepGreen transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Votes
                        </Link>
                        <Link 
                            href="/how-it-works" 
                            className="text-lg font-medium hover:text-deepGreen transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Learn
                        </Link>
                        <Link 
                            href="/about" 
                            className="text-lg font-medium hover:text-deepGreen transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                    </nav>


                    {isConnected ? (
                        <button
                            onClick={() => {
                                disconnect();
                                setMobileMenuOpen(false);
                            }}
                            className="w-full py-3 border-2 border-dark rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                        >
                            Disconnect
                            <Image src="/icons/disconnect.svg" alt="Disconnect" width={16} height={16} />
                        </button>
                    ) : (
                        <div onClick={() => setMobileMenuOpen(false)} className="w-full [&>div]:w-full [&_button]:w-full [&_button]:flex [&_button]:justify-center [&_button]:items-center [&_button>span]:mx-auto">
                            <ButtonConnect />
                        </div>
                    )}
                </div>
            </div>
        )}
        </>
    )
}