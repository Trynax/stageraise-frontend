import Link from "next/link";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/sections/footer";

const highlights = [
  "Two funding models: Traditional and Milestone-based.",
  "Three supported tokens: USDC, USDT, and BUSD.",
  "Refund path for milestone projects after three failed voting rounds.",
];

const lifecycle = [
  {
    phase: "1. Project Setup",
    details:
      "A creator defines the project type, funding target, funding start and end times, contribution limits, and payment token.",
  },
  {
    phase: "2. Upcoming State",
    details:
      "Before funding start, the project is visible but cannot accept contributions.",
  },
  {
    phase: "3. Live Funding",
    details:
      "Between funding start and funding end, contributors can fund within min/max limits using the configured stablecoin.",
  },
  {
    phase: "4. Funding Closed",
    details:
      "After funding end, new contributions are blocked and project execution continues under its selected model.",
  },
  {
    phase: "5. Post-Funding Execution",
    details:
      "Traditional projects allow direct withdrawal after funding closes. Milestone projects move through vote rounds before more funds are unlocked.",
  },
];

const modelComparison = [
  {
    title: "Traditional",
    howItWorks:
      "Single funding window with no milestone voting. After funding ends, the project owner can withdraw available balance.",
    bestFor: "Simple campaigns where phased proof-of-work is not required.",
  },
  {
    title: "Milestone-Based",
    howItWorks:
      "Funding is raised first, then each milestone may require a community vote before additional funds are unlocked.",
    bestFor:
      "Projects that need stronger public accountability and staged fund release.",
  },
];

const tokenLaunchDirection = [
  "Milestone-gated token unlocks so distribution follows verified project progress.",
  "Contributor-aware allocation models that can consider both contribution and governance participation.",
  "Guardrails around launch timing so token release cannot bypass core project accountability rules.",
  "Optional module design so projects can use funding-only mode or funding-plus-token mode.",
];

export default function HowItWorksPage() {
  return (
    <div className="relative">
      <Header />

      <main className="min-h-screen bg-primary pt-16">
        <section className="px-4 sm:px-8 lg:px-32 py-10 sm:py-14 space-y-6">
          <div className="border-2 border-dark rounded-2xl bg-white overflow-hidden">
            <div className="border-b border-gray-200 px-5 sm:px-8 py-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Learn
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-dark mt-2 leading-tight">
                How StageRaise Works
              </h1>
              <p className="text-dark/75 mt-4 max-w-4xl leading-7">
                StageRaise is a decentralized funding protocol designed for
                transparent capital flow. It supports both Traditional and
                Milestone-based projects, where milestone funding release is tied
                to progress and community voting.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-dark/80 bg-[#FCFCFD]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-8 space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">
                  End-to-End Lifecycle
                </h2>
                <div className="space-y-3">
                  {lifecycle.map((item) => (
                    <div
                      key={item.phase}
                      className="border border-gray-300 rounded-xl p-4 bg-[#FCFCFD]"
                    >
                      <h3 className="font-semibold text-dark">{item.phase}</h3>
                      <p className="text-dark/75 mt-1">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">
                  Funding Models
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {modelComparison.map((model) => (
                    <div
                      key={model.title}
                      className="border border-gray-300 rounded-xl p-5 bg-[#FCFCFD]"
                    >
                      <h3 className="text-lg font-bold text-dark">{model.title}</h3>
                      <p className="text-dark/75 mt-2 leading-7">
                        {model.howItWorks}
                      </p>
                      <p className="text-sm text-gray-600 mt-3">
                        <span className="font-semibold text-gray-800">
                          Best fit:
                        </span>{" "}
                        {model.bestFor}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-dark mb-3">
                  Milestone Voting Mechanics
                </h2>
                <div className="border border-gray-300 rounded-xl p-5 bg-[#FCFCFD]">
                  <ol className="space-y-3 text-dark/80 list-decimal list-inside leading-7">
                    <li>Project owner opens a milestone vote round.</li>
                    <li>Funders vote YES or NO once in that round.</li>
                    <li>
                      Voting power is weighted by funded amount, not by wallet
                      count.
                    </li>
                    <li>
                      After the vote window ends, the round must be finalized to
                      apply results.
                    </li>
                    <li>
                      Passing votes move milestone progress forward. Failed votes
                      increase failed-vote count.
                    </li>
                    <li>
                      At three failed rounds, project funders can request
                      proportional refunds from remaining project balance.
                    </li>
                  </ol>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-dark mb-3">
                  Key Rules and Constraints
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border border-gray-300 rounded-xl p-4">
                    <p className="font-semibold text-dark">Funding windows</p>
                    <p className="text-dark/75 mt-1 text-sm">
                      Contributions are allowed only between funding start and
                      funding end.
                    </p>
                  </div>
                  <div className="border border-gray-300 rounded-xl p-4">
                    <p className="font-semibold text-dark">Contribution limits</p>
                    <p className="text-dark/75 mt-1 text-sm">
                      Every funder must stay within project min and max limits.
                    </p>
                  </div>
                  <div className="border border-gray-300 rounded-xl p-4">
                    <p className="font-semibold text-dark">Token scope</p>
                    <p className="text-dark/75 mt-1 text-sm">
                      Each project accepts one configured stablecoin only.
                    </p>
                  </div>
                  <div className="border border-gray-300 rounded-xl p-4">
                    <p className="font-semibold text-dark">Vote integrity</p>
                    <p className="text-dark/75 mt-1 text-sm">
                      One vote per funder per round, with weighted voting power.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-xl p-5 bg-[#FCFCFD]">
                <h2 className="text-2xl font-bold text-dark mb-3">
                  Planned Work: Token Launch Integration
                </h2>
                <p className="text-dark/75 mb-3 leading-7">
                  This is an exploratory direction and not final yet. The goal is
                  to let projects launch tokens in a way that stays aligned with
                  StageRaise funding and milestone accountability.
                </p>
                <ul className="space-y-2 text-dark/80">
                  {tokenLaunchDirection.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="font-semibold text-deepGreen">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-gray-300 rounded-xl p-5 bg-[#FCFCFD]">
                <h2 className="text-2xl font-bold text-dark mb-3">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4 text-dark/80">
                  <div>
                    <p className="font-semibold text-dark">
                      Can I fund before the start date?
                    </p>
                    <p className="text-sm mt-1">
                      No. Upcoming projects are visible but funding is blocked
                      until the funding start time.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-dark">
                      Why does a milestone vote still need finalization?
                    </p>
                    <p className="text-sm mt-1">
                      Finalization is the state transition that records whether
                      the round passed or failed and updates project milestone
                      counters.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-dark">
                      Are refunds automatic after failed votes?
                    </p>
                    <p className="text-sm mt-1">
                      Refund eligibility becomes available after three failed
                      milestone rounds, and each eligible funder requests their
                      own proportional refund.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/projects"
                  className="px-5 py-3 bg-deepGreen text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Explore Projects
                </Link>
                <Link
                  href="/create"
                  className="px-5 py-3 bg-white text-dark border-2 border-dark rounded-xl font-semibold hover:bg-gray-50 transition-colors"
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
