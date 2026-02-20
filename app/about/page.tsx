import Link from "next/link";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/sections/footer";

const pillars = [
  {
    title: "Milestone Accountability",
    description:
      "For milestone projects, funds are unlocked based on community-reviewed progress instead of blind trust.",
  },
  {
    title: "Community Governance",
    description:
      "Funders vote on milestone completion and voting power is weighted by actual contribution.",
  },
  {
    title: "Funder Protection",
    description:
      "If a milestone project fails 3 vote rounds, funders can request proportional refunds of remaining funds.",
  },
  {
    title: "Stablecoin Funding",
    description:
      "Projects use stablecoin payments and configured contribution limits for more predictable participation.",
  },
];

const roadmap = [
  "Improve creator tooling for milestone evidence and vote setup.",
  "Expand discovery, filtering, and richer project updates.",
  "Strengthen analytics and transparency views across dashboards.",
];

export default function AboutPage() {
  return (
    <div className="relative">
      <Header />

      <main className="min-h-screen bg-primary pt-16">
        <section className="px-4 sm:px-8 lg:px-32 py-10 sm:py-14 space-y-6">
          <div className="border-2 border-dark rounded-2xl overflow-hidden">
            <div className="bg-[#CBF5BD] px-5 sm:px-8 py-5">
              <p className="text-sm font-semibold text-[#296219]">About</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-dark mt-2">
                Crowdfunding with Accountability
              </h1>
            </div>

            <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-dark">Our Mission</h2>
                <p className="text-dark/85 leading-7">
                  StageRaise is built to make project funding more transparent for
                  creators and safer for funders. We combine funding windows,
                  milestone governance, and on-chain records so progress is visible
                  and decisions are verifiable.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-bold text-dark">What We Fix</h2>
                <p className="text-dark/85 leading-7">
                  Traditional crowdfunding often relies on trust after money is
                  raised. StageRaise introduces structured milestones, voting, and
                  refund paths to reduce creator-funder misalignment.
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-dark rounded-2xl p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-dark mb-4">Core Pillars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-xl border border-dark p-4 bg-[#F9FAFB]"
                >
                  <h3 className="font-bold text-dark">{pillar.title}</h3>
                  <p className="text-dark/80 mt-2 text-sm">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-2 border-dark rounded-2xl p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-dark mb-4">Now and Next</h2>
            <ul className="space-y-2 text-dark/90">
              {roadmap.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="font-semibold text-deepGreen">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-2 border-dark rounded-2xl p-5 sm:p-8 bg-secondary/40">
            <h2 className="text-2xl font-bold text-dark mb-2">
              Build or Back with Confidence
            </h2>
            <p className="text-dark/85 mb-4">
              Whether you are launching a project or funding one, StageRaise gives
              you a clearer process from funding start to final milestone outcome.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/create"
                className="px-5 py-3 bg-deepGreen text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Start a Project
              </Link>
              <Link
                href="/projects"
                className="px-5 py-3 bg-white border-2 border-dark text-dark rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Browse Projects
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
