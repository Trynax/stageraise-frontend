import Link from "next/link"
import Image from "next/image"

interface SuccessStepProps {
    fundingStart?: string
}

function formatFundingStart(value?: string): string | null {
    if (!value) return null
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return null
    return parsed.toLocaleString()
}

export default function SuccessStep({ fundingStart }: SuccessStepProps) {
    const parsedFundingStart = fundingStart ? new Date(fundingStart) : null
    const hasValidStart = Boolean(parsedFundingStart && !Number.isNaN(parsedFundingStart.getTime()))
    const isFundingLive = hasValidStart ? (parsedFundingStart as Date).getTime() <= Date.now() : false
    const fundingStartsAtText = formatFundingStart(fundingStart)
    const title = isFundingLive ? "Fundraising is live" : "Project created successfully"
    const subtitle = isFundingLive
        ? "Your project has been deployed and is now open for community funding and milestone participation."
        : `Your project has been deployed. Funding is scheduled to open${fundingStartsAtText ? ` on ${fundingStartsAtText}` : " at the configured start time"}.`

    return (
        <div className="bg-white rounded-2xl px-4 md:px-12 py-12 text-center flex flex-col items-center">
            <div className="mb-8 flex flex-col items-center">
                    <Image src="/images/sucess.svg" alt="Success" width={100} height={100} />
                <h2 className="text-2xl md:text-4xl font-bold mb-4">{title}</h2>
                <p className="text-gray-600 text-sm md:text-lg">
                    {subtitle}
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
