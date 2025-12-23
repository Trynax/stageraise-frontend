import { ButtonConnect} from "./connect-button"
import Link from "next/link"

export function Header() {


    return (
        <header className="flex fixed top-0 left-0 right-0 z-50 items-center gap-5 px-32 py-4 bg-primary w-full border-b-3 border-dark">
            <div className="font-bold text-xl flex-none">
                LOGO
            </div>

        <div className="flex-1 flex justify-center gap-8">
            <Link href="/projects" className="nav-link">Explore Projects</Link>
            <Link href="/voting" className="nav-link">Explore Voting</Link>
            <Link href="/how-it-works" className="nav-link">How it works</Link>
            <Link href="/about" className="nav-link">About</Link>
        </div>

            <ButtonConnect/>

        </header>
    )
}