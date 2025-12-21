import Image from "next/image";
import {Header} from "@/components/ui/header";
import { HeroSection } from "@/components/sections/herosection";
import { ProjectSection } from "@/components/sections/projectsection";
export default function Home() {
  return (
    <div className="relative">
    <Header />
    <div className="pt-16">
       <HeroSection />
    </div>

    <div className="py-20">
      <ProjectSection/>
    </div>
    
   

    
    </div>
  );
}
