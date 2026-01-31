import Image from "next/image";
import Link from "next/link";

export function AboutSection() {
  return (
    <section className=" bg-primary py-10">
      <div className="px-4 sm:px-8 lg:px-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-dark">
            Stage Raise is for <span className="text-secondary" style={{ 
                            WebkitTextStroke: '2px black',
                            paintOrder: 'stroke fill'
                        }}>Everyone</span>
          </h2>
        </div>


        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <div className="border-2 rounded-xl border-dark">
            <div className="bg-[#CBF5BD] px-8 py-4 rounded-t-xl">
              <h3 className="text-sm text-[#296219] mb-2 font-semibold">For Creators</h3>
              <h2 className="text-2xl font-bold  text-dark">Raise funds with trust and accountability</h2>
            </div>
            
            <ul className="space-y-3 flex flex-col px-8 py-6 gap-3">
              {[
                'Create a project.',
                'Set goals, milestones, and deadlines.',
                'Choose funding mode.',
                'Receive transparent funding.',
                'Unlock funds only when you deliver.',
                'Build trust that lasts beyond one project.'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-[#0e2c076d] rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[#296219]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#296219] font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-2 rounded-xl border-dark">
            <div className="bg-[#F6EFE6] px-8 py-4 rounded-t-xl">
              <h3 className="text-sm text-[#764536] mb-2 font-semibold">For Funders</h3>
              <h2 className="text-2xl font-bold  text-dark">Back Projects with Confidence</h2>
            </div>
            
            <ul className="space-y-3 flex flex-col px-8 py-6 gap-3">
              
            {[
                'Discover high-quality projects.',
                'Fund within fair USD limits.',
                'Vote on milestone completion.',
                'Track progress live onchain.',
                'Claim refunds if creators fail a set of milestones.',
                'Support creators who actually deliver.'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-[#331d1770] rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[#764536]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#764536] font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>


        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The Old Way Is <span className="text-[#F04438]" style={{ 
                            WebkitTextStroke: '1px black',
                            paintOrder: 'stroke fill'
                        }}>Broken</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          {[
            { icon: '/icons/danger.svg', text: 'No milestone verification' },
            { icon: '/icons/protection.svg', text: 'No funder protection' },
            { icon: '/icons/cancel.svg', text: 'No refund system' },
            { icon: '/icons/lock.svg', text: 'Decentralized rules' },
            { icon: '/icons/coin.svg', text: 'Heavy fees' },
            { icon: '/icons/closedeye.svg', text: 'Zero transparency' }
          ].map((item, index) => (
            <div key={index} className="rounded-2xl p-6 border-2 border-gray-800 flex items-center gap-4">
                <div className=" p-2 bg-[#FEE4E2] rounded-lg flex items-center justify-center">
                    <Image src={item.icon} alt={item.text} width={40} height={40} />
                </div>
              <span className="font-semibold text-gray-800">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="bg-deepGreen rounded-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The New Way - <span className="text-secondary" style={{ 
                            WebkitTextStroke: '2px black',
                            paintOrder: 'stroke fill'
                        }}>Stage Raise</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon:"icons/target.svg",
                title: 'Milestone-Based Fund Release',
                description: 'Funds are locked in smart contracts and only released when milestones are proven. Community votes verify progress and releases funds.',
                tagline: 'Say goodbye to ghosted projects.'
              },
              {
                icon: "icons/check.svg",
                title: 'Two Funding Models — Your Rules',
                description: 'Traditional all-or-nothing mode or our flagship Milestone Mode with step-by-step fund release controlled by community governance.',
                tagline: "It's built for everyone."
              },
              {
                icon:"icons/coin-green.svg",
                title: 'Stablecoin Support & Limits',
                description: 'Supports USDC, USDT, and BUSD with configurable min/max contribution limits per contributor to reduce volatility and prevent whale dominance.',
                tagline: 'Stable funding, fair participation.'
              },
              {
                icon: "icons/voting.svg",
                title: 'Community Voting That Matters',
                description: 'Votes have consequences. Fully on-chain and transparent. No double-voting. No central authority altering outcomes.',
                tagline: 'Real accountability.'
              },
              {
                icon: "icons/refreshgreen.svg",
                title: 'Refund Guarantee',
                description: 'If a project fails 3 milestone votes, funders can claim refunds for remaining unspent funds. Refunds are proportional to contributions.',
                tagline: 'You deliver or they exit.'
              },
              {
                icon: "icons/shieldgreen.svg",
                title: 'Security You Can See',
                description: 'Smart contract audits, gas-optimized architecture, immutable records, and transparent transactions.',
                tagline: "If it's not on-chain, it's not verified."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-secondary rounded-2xl p-6 border-2 border-dark shadow-2xl hover:scale-102 transition-transform duration-300">
                <div className="w-12 h-12 bg-[#CBF5BD] rounded-xl flex items-center justify-center mb-4">
                  <Image src={feature.icon} alt={feature.title} width={24} height={24} />
                </div>
                <h4 className="text-lg font-bold mb-3 text-gray-900">{feature.title}</h4>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{feature.description}</p>
                <p className="text-xs font-semibold text-gray-900">{feature.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className=" py-8 px-3 md:p-8 flex flex-col gap-4 ">
        <h1 className=" text-4xl md:text-5xl text-center font-semibold  md:leading-15">The Future of Crowdfunding is <br /> Community-Governed.</h1>

         <div className="flex justify-center gap-3 md:gap-6 mb-20">
                    <Link 
                        href="/create"
                        className="px-4 py-3 bg-deepGreen text-white rounded-xl font-semibold text-sm md:text-lg hover:scale-105 transition-transform duration-300 shadow-lg inline-block text-center"
                    >
                        Start a Project
                    </Link>
                    <Link 
                        href="/projects"
                        className="px-4 py-3 bg-white text-gray-900 rounded-xl font-semibold text-sm md:text-lg border-2 border-gray-900 hover:scale-105 transition-transform duration-300 shadow-lg inline-block text-center"
                    >
                        Browse Projects
                    </Link>
                </div>

      </div>
    </section>
  );
}


