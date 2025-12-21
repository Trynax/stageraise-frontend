import { ButtonConnect} from "./connect-button"

export function Header() {


    return (
        <header className="flex fixed top-0 left-0 right-0 z-50 items-center gap-5 px-16 py-4 bg-primary w-full border-b-3 border-dark">
            <div className="font-bold text-xl flex-none">
                LOGO
            </div>

        <div className="flex-1 flex justify-center gap-8">
            <a href="#" className="nav-link">Explore Projects</a>
            <a href="#" className="nav-link">Explore Voting</a>
            <a href="#" className="nav-link">How it works</a>
            <a href="#" className="nav-link">About</a>
        </div>

            <ButtonConnect/>

        </header>
    )
}