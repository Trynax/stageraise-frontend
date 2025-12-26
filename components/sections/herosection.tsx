import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative min-h-[80vh] bg-primary px-4 sm:px-8 lg:px-16 overflow-hidden">
              <div className="absolute hidden lg:block top-0 bottom-0 left-32 w-[3px] bg-dark"></div>
              <div className="absolute hidden lg:block top-0 bottom-0 right-32 w-[3px] bg-dark"></div>
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

        
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 md:py-20">
      
                <div className="text-center mb-4 lg:mb-12">
                    <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight">
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


                <div className="flex justify-center gap-3 md:gap-6 mb-20">
                    <Link 
                        href="/create"
                        className="px-4 py-3 bg-deepGreen text-white rounded-xl font-semibold text-sm md:text-lg hover:scale-105 transition-transform duration-300 shadow-lg inline-block text-center"
                    >
                        Create Project
                    </Link>
                    <Link 
                        href="/projects"
                        className="px-4 py-3 bg-white text-gray-900 rounded-xl font-semibold text-sm md:text-lg border-2 border-gray-900 hover:scale-105 transition-transform duration-300 shadow-lg inline-block text-center"
                    >
                        Fund project
                    </Link>
                </div>

                <div className="relative h-100 overflow-visible -mb-50 md:mb-0">
                    <Image className="absolute -bottom- md:-bottom-64 left-1/2 -translate-x-1/2" src="/images/heroimage.svg" alt="Hero Image" width={800} height={400} />
                </div>
            </div>
    <div className="absolute bottom-0 left-0 right-0 bg-light-orange z-10 overflow-hidden">
    <div className="flex animate-scroll gap-8 py-4 sm:py-6">
   
        <div className="flex items-center gap-3 shrink-0">
            <Image src="/icons/shield.svg" alt="Verification Icon" width={22} height={22} />
            <span className="font-semibold text-gray-900 whitespace-nowrap">On-Chain Verification</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
            <Image src="/icons/refresh.svg" alt="Refresh Icon" width={22} height={22} />
            <span className="font-semibold text-gray-900 whitespace-nowrap">Automatic Refunds</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
            <Image src="/icons/squares.svg" alt="Squares Icon" width={22} height={22} />
            <span className="font-semibold text-gray-900 whitespace-nowrap">Milestone-Based Funding</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
            <Image src="/icons/refresh.svg" alt="Refresh Icon" width={22} height={22} /> 
            <span className="font-semibold text-gray-900 whitespace-nowrap">Automatic Refunds</span>
        </div>

       
        <div className="flex items-center gap-3 shrink-0">
            <Image src="/icons/shield.svg" alt="Verification Icon" width={22} height={22} />
            <span className="font-semibold text-gray-900 whitespace-nowrap">On-Chain Verification</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
            <Image src="/icons/refresh.svg" alt="Refresh Icon" width={22} height={22} />
            <span className="font-semibold text-gray-900 whitespace-nowrap">Automatic Refunds</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
            <Image src="/icons/squares.svg" alt="Squares Icon" width={22} height={22} />
            <span className="font-semibold text-gray-900 whitespace-nowrap">Milestone-Based Funding</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
            <Image src="/icons/refresh.svg" alt="Refresh Icon" width={22} height={22} /> 
            <span className="font-semibold text-gray-900 whitespace-nowrap">Automatic Refunds</span>
        </div>
    </div>
    </div>
        </section>
    );
}