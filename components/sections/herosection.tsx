import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative min-h-[80vh] bg-primary px-16 overflow-hidden">
              <div className="absolute top-0 bottom-0 left-16 w-[3px] bg-dark"></div>
              <div className="absolute top-0 bottom-0 right-16 w-[3px] bg-dark"></div>
            <div 
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #d1d5db 1px, transparent 1px),
                        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px'
                }}
            />

        
            <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
      
                <div className="text-center mb-12">
                    <h1 className="text-7xl font-extrabold mb-6 leading-tight">
                        <span className="text-white" style={{ 
                            WebkitTextStroke: '2px black',
                            paintOrder: 'stroke fill'
                        }}>
                            Fund Bold Ideas.{' '}
                        </span>
                        <span className="text-secondary" style={{ 
                            WebkitTextStroke: '2px black',
                            paintOrder: 'stroke fill'
                        }}>
                            Unlock Funds
                        </span>
                        <br />
                        <span className="text-white" style={{ 
                            WebkitTextStroke: '2px black',
                            paintOrder: 'stroke fill'
                        }}>
                            Only When They Deliver.
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-900 font-medium max-w-4xl mx-auto">
                        A decentralized crowdfunding platform where milestones decide the money not hope.
                    </p>
                </div>


                <div className="flex justify-center gap-6 mb-20">
                    <button className="px-8 py-3 bg-deepGreen text-white rounded-xl font-semibold text-lg hover:scale-105 transition-colors shadow-lg ">
                        Create Project
                    </button>
                    <button className="px-8 py-3 bg-white text-gray-900 rounded-xl font-semibold text-lg border-2 border-gray-900 hover:scale-105 transition-colors shadow-lg">
                        Fund project
                    </button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-light-orange">
                <div className="flex justify-between items-center px-8 py-6">
                    <div className="flex items-center gap-3">
                        <Image src="/icons/shield.svg" alt="Verification Icon" width={22} height={22} />
                        <span className="font-semibold text-gray-900">On-Chain Verification</span>
                    </div>

                    <div className="flex items-center gap-3">
                            <Image src="/icons/refresh.svg" alt="Refresh Icon" width={22} height={22} />
                            <span className="font-semibold text-gray-900">Automatic Refunds</span>
                    </div>

                    <div className="flex items-center gap-3">
                          <Image src="/icons/squares.svg" alt="Refresh Icon" width={22} height={22} />
                          <span className="font-semibold text-gray-900">Milestone-Based Funding</span>
                    </div>

                    <div className="flex items-center gap-3">
                            <Image src="/icons/refresh.svg" alt="Refresh Icon" width={22} height={22} /> 
                            <span className="font-semibold text-gray-900">Automatic Refunds</span>
                    </div>
                </div>
            </div>
        </section>
    );
}