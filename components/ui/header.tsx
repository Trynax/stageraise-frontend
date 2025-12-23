import { ButtonConnect} from "./connect-button"
import Link from "next/link"
import Image from "next/image"

export function Header() {
    return (
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

                <button className="lg:hidden p-2">
                    <Image src="/icons/menuhamburger.svg" alt="Menu" width={24} height={24} />
                </button>

            </div>
        </header>
    )
}