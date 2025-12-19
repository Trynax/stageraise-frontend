import { ButtonConnect} from "./connect-button"

export function Header() {


    return (
        <header className="flex items-center gap-5 px-16 py-4 bg-white w-full border-2 border-dark">
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