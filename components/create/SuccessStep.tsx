import Link from "next/link"
import Image from "next/image"

export default function SuccessStep() {
    return (
        <div className="bg-white rounded-2xl px-4 md:px-12 py-12 text-center flex flex-col items-center">
            <div className="mb-8 flex flex-col items-center">
                    <Image src="/images/sucess.svg" alt="Success" width={100} height={100} />
                <h2 className="text-2xl md:text-4xl font-bold mb-4">Fundraising has started</h2>
                <p className="text-gray-600 text-sm md:text-lg">
                    Your fundraising project has been deployed and is now open for community funding and voting.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full max-w-md">
                <Link
                    href="/dashboard"
                    className="flex-1 px-6 py-3 bg-secondary text-dark rounded-xl hover:bg-secondary/80 transition-colors text-sm md:text-base font-semibold text-center"
                >
                    Go to dashboard
                </Link>
                <Link
                    href="/projects"
                    className="flex-1 px-6 py-3 bg-deepGreen text-secondary rounded-xl hover:bg-deepGreen/80 transition-colors text-sm md:text-base font-semibold text-center"
                >
                    View project
                </Link>
            </div>
        </div>
    )
}
