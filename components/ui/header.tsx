"use client"

import { ButtonConnect} from "./connect-button"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
        <header className="flex fixed top-0 left-0 right-0 z-50 items-center gap-3 sm:gap-5 px-4 sm:px-8 lg:px-32 py-3 sm:py-4 bg-primary w-full border-b-3 border-dark">
            <div className="font-bold text-lg sm:text-xl flex-none">
                LOGO
            </div>

            <div className="hidden lg:flex flex-1 justify-center gap-8">
                <Link href="/projects" className="nav-link">Explore Projects</Link>
                <Link href="/votes" className="nav-link">Explore Voting</Link>
                <Link href="/how-it-works" className="nav-link">How it works</Link>
                <Link href="/about" className="nav-link">About</Link>
            </div>

        
            <div className="flex-1 lg:hidden"></div>

            <div className="flex items-center gap-3">
               
                
                <ButtonConnect/>

                <button 
                    className="lg:hidden p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <Image src="/icons/menuhamburger.svg" alt="Menu" width={24} height={24} />
                </button>

            </div>
        </header>

        {mobileMenuOpen && (
            <>
                <div 
                    className="fixed inset-0 bg-dark/50 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
                <div className="fixed top-[60px] right-0 w-64 h-[calc(100vh-60px)] bg-primary border-l-2 border-dark z-50 lg:hidden">
                    <nav className="flex flex-col p-6 gap-4">
                        <Link 
                            href="/projects" 
                            className="py-3 px-4 border-2 border-dark rounded-lg font-semibold hover:bg-secondary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Explore Projects
                        </Link>
                        <Link 
                            href="/votes" 
                            className="py-3 px-4 border-2 border-dark rounded-lg font-semibold hover:bg-secondary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Explore Voting
                        </Link>
                        <Link 
                            href="/how-it-works" 
                            className="py-3 px-4 border-2 border-dark rounded-lg font-semibold hover:bg-secondary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            How it works
                        </Link>
                        <Link 
                            href="/about" 
                            className="py-3 px-4 border-2 border-dark rounded-lg font-semibold hover:bg-secondary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                    </nav>
                </div>
            </>
        )}
        </>
    )
}