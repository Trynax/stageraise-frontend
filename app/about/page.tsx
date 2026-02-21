import Link from "next/link";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/sections/footer";

const principles = [
  {
    title: "Progress-Based Fund Release",
    description:
      "Milestone projects release funds in stages tied to verifiable progress and vote outcomes.",
  },
  {
    title: "Contributor Governance",
    description:
      "Voting rights are granted to project funders, with power weighted by contribution size.",
  },
  {
    title: "Capital Protection Path",
    description:
      "After repeated failed rounds, project funders can request proportional refunds from remaining balance.",
  },
  {
    title: "Transparent On-Chain State",
    description:
      "Funding progress, voting windows, results, and milestone state transitions are publicly verifiable.",
  },
];

const whyStageRaise = [
  "Traditional funding platforms usually trust delivery after funds are raised.",
  "Contributors often lack reliable control points between payment and execution.",
  "StageRaise introduces structured checkpoints so release of capital tracks project progress.",
];

const protocolModel = [
  "Projects are configured with a funding window, limits, and a selected execution mode.",
  "Traditional mode prioritizes simple fundraising and post-window withdrawal.",
  "Milestone mode adds community voting checkpoints before deeper fund release.",
  "Failed milestone rounds are tracked and can unlock refund eligibility rules.",
];

const roadmap = [
  "Improve creator evidence tooling for milestone vote rounds.",
  "Expand project discovery with stronger filtering and signal quality.",
  "Add deeper analytics for funding performance and governance outcomes.",
  "Explore token launch architecture tied to project funding and milestone progression.",
];

const tokenVision = [
  "Keep token launch optional so creators can choose funding-only or funding-plus-token workflows.",
  "Align token release with project accountability checkpoints, not only fundraising completion.",
  "Design allocation rules that can respect contribution data and governance participation.",
];

export default function AboutPage() {
  return (
    <div className="relative">
      <Header />

      <main className="min-h-screen bg-primary pt-16">
        <section className="px-4 sm:px-8 lg:px-32 py-10 sm:py-14 space-y-6">
          <div className="border-2 border-dark rounded-2xl bg-white overflow-hidden">
            <div className="border-b border-gray-200 px-5 sm:px-8 py-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                About
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-dark mt-2 leading-tight">
                StageRaise: A Funding Protocol with Accountability
              </h1>
              <p className="text-dark/75 mt-4 max-w-4xl leading-7">
                StageRaise is designed for projects that need capital and
                contributors that need transparent control points. The protocol
                combines configurable funding windows, milestone governance, and
                verifiable state transitions to reduce misalignment between money
                raised and progress delivered.
              </p>
            </div>

            <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="border border-gray-300 rounded-xl p-5 bg-[#FCFCFD]">
                <h2 className="text-xl font-bold text-dark">Mission</h2>
                <p className="text-dark/80 mt-2 leading-7">
                  Build a protocol where project funding and project accountability
                  are linked by default, not treated as separate concerns.
                </p>
              </div>

              <div className="border border-gray-300 rounded-xl p-5 bg-[#FCFCFD]">
                <h2 className="text-xl font-bold text-dark">Trust Model</h2>
                <p className="text-dark/80 mt-2 leading-7">
                  StageRaise does not ask contributors to rely only on promises.
                  For milestone projects, milestone progression and capital release
                  can be gated by vote outcomes and explicit protocol rules.
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-dark rounded-2xl p-5 sm:p-8 bg-white">
            <h2 className="text-2xl font-bold text-dark mb-4">Why StageRaise</h2>
            <ul className="space-y-2 text-dark/85">
              {whyStageRaise.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="font-semibold text-deepGreen">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-2 border-dark rounded-2xl p-5 sm:p-8 bg-white">
            <h2 className="text-2xl font-bold text-dark mb-4">Design Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {principles.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-xl border border-gray-300 p-4 bg-[#FCFCFD]"
                >
                  <h3 className="font-bold text-dark">{pillar.title}</h3>
                  <p className="text-dark/80 mt-2 text-sm">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-2 border-dark rounded-2xl p-5 sm:p-8 bg-white">
            <h2 className="text-2xl font-bold text-dark mb-4">Operating Model</h2>
            <ul className="space-y-2 text-dark/90">
              {protocolModel.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="font-semibold text-deepGreen">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-2 border-dark rounded-2xl p-5 sm:p-8 bg-white">
            <h2 className="text-2xl font-bold text-dark mb-4">
              Current Focus and Next Steps
            </h2>
            <ul className="space-y-2 text-dark/90">
              {roadmap.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="font-semibold text-deepGreen">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-2 border-dark rounded-2xl p-5 sm:p-8 bg-white">
            <h2 className="text-2xl font-bold text-dark mb-3">
              Exploratory Direction: Funding + Token Launch
            </h2>
            <p className="text-dark/80 leading-7 mb-3">
              A future direction for StageRaise is adding a token launch layer
              that is structurally tied to project funding and milestone
              accountability. This is currently exploratory and not finalized.
            </p>
            <ul className="space-y-2 text-dark/90">
              {tokenVision.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="font-semibold text-deepGreen">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-2 border-dark rounded-2xl p-5 sm:p-8 bg-white">
            <h2 className="text-2xl font-bold text-dark mb-2">
              Build or Back with Confidence
            </h2>
            <p className="text-dark/85 mb-4">
              Whether you are launching a project or funding one, StageRaise
              provides a clearer operational path from funding window to project
              outcome.
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
                className="px-5 py-3 bg-white border-2 border-dark text-dark rounded-xl font-semibold hover:bg-gray-50 transition-colors"
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
