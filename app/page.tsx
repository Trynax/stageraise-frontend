import Image from "next/image";
import {Header} from "@/components/ui/header";
import { HeroSection } from "@/components/sections/herosection";
import { ProjectSection } from "@/components/sections/projectsection";
import {VoteSection} from "@/components/sections/votesection";
import { AboutSection } from "@/components/sections/aboutsection";  
import { Footer } from "@/components/sections/footer";
export default function Home() {
  return (
    <div className="relative">
    <Header />
    <div className="pt-16">
       <HeroSection />
    </div>

    <div className="">
      <ProjectSection/>
    </div>
    
    <div className="">
      <VoteSection/>
    </div>

    <div className="">
      <AboutSection />
    </div>

    <Footer />
    
    </div>
  );
}
