import Link from "next/link";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/sections/footer";

const creatorFlow = [
  "Create a project and choose Traditional or Milestone mode.",
  "Set funding target, funding start, funding end, and contribution limits.",
  "Receive stablecoin funding once the project enters Live funding.",
  "For milestone projects, open voting when a milestone is ready for review.",
  "Withdraw only what is currently withdrawable by project rules.",
];

const funderFlow = [
  "Browse projects and check whether funding is Upcoming, Live, or Ended.",
  "Fund using the selected stablecoin (USDC, USDT, or BUSD) within limits.",
  "Track your contribution and voting power on funded milestone projects.",
  "Vote once per round during active milestone voting windows.",
  "Request refund when a milestone project reaches 3 failed vote rounds.",
];

const fundingStates = [
  {
    title: "Upcoming",
    description:
      "Funding has not started yet. Contributions are blocked until the funding start time.",
    tone: "bg-[#E9F5FE] text-[#175CD3] border-[#B2DDFF]",
  },
  {
    title: "Live",
    description:
      "Funding is open between funding start and funding end, subject to project limits.",
    tone: "bg-[#ECFDF3] text-[#067647] border-[#ABEFC6]",
  },
  {
    title: "Ended",
    description:
      "Funding window has closed. New contributions are blocked and project actions move forward.",
    tone: "bg-[#F4F3FF] text-[#5925DC] border-[#D9D6FE]",
  },
];

const rules = [
  "Single payment token per project (USDC, USDT, or BUSD).",
  "Min and max contribution limits are enforced per contributor.",
  "Voting power is proportional to each contributor's funded amount.",
  "A funder can vote only once per voting round.",
  "Milestone refunds become available after 3 failed vote rounds.",
];

export default function HowItWorksPage() {
  return (
    <div className="relative">
      <Header />

      <main className="min-h-screen bg-primary pt-16">
        <section className="px-4 sm:px-8 lg:px-32 py-10 sm:py-14">
          <div className="border-2 border-dark rounded-2xl overflow-hidden">
            <div className="bg-secondary px-5 sm:px-8 py-5">
              <p className="text-sm font-semibold text-[#296219]">Learn</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-dark mt-2">
                How StageRaise Works
              </h1>
              <p className="text-dark/80 mt-3 max-w-3xl">
                StageRaise is a crowdfunding platform with clear funding windows,
                milestone accountability, and on-chain community voting.
              </p>
            </div>

            <div className="p-5 sm:p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border border-dark rounded-xl p-4 sm:p-5">
                  <h2 className="text-xl font-bold text-dark mb-3">
                    For Creators
                  </h2>
                  <ul className="space-y-2 text-dark/90">
                    {creatorFlow.map((step) => (
                      <li key={step} className="flex gap-2">
                        <span className="font-semibold text-deepGreen">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-dark rounded-xl p-4 sm:p-5">
                  <h2 className="text-xl font-bold text-dark mb-3">
                    For Funders
                  </h2>
                  <ul className="space-y-2 text-dark/90">
                    {funderFlow.map((step) => (
                      <li key={step} className="flex gap-2">
                        <span className="font-semibold text-deepGreen">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-dark mb-3">
                  Funding States
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {fundingStates.map((state) => (
                    <div
                      key={state.title}
                      className={`border rounded-xl p-4 ${state.tone}`}
                    >
                      <p className="font-bold text-lg">{state.title}</p>
                      <p className="mt-2 text-sm">{state.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-dark mb-3">
                  Core Rules
                </h2>
                <div className="border border-dark rounded-xl p-4 sm:p-5 bg-[#F9FAFB]">
                  <ul className="space-y-2 text-dark/90">
                    {rules.map((rule) => (
                      <li key={rule} className="flex gap-2">
                        <span className="font-semibold text-deepGreen">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="px-5 py-3 bg-deepGreen text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Explore Projects
                </Link>
                <Link
                  href="/create"
                  className="px-5 py-3 bg-secondary text-dark border-2 border-dark rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Create a Project
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
