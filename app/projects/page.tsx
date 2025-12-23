import Image from "next/image";
import {Header} from "@/components/ui/header";
import { ProjectHeroSection } from "@/components/sections/projectherosection";
import{ Footer } from "@/components/sections/footer";
import { ProjectList } from "@/components/sections/projectLists";
export default function Home() {
  return (
    <div className="relative">
    <Header />
    <div className="pt-10">
        <ProjectHeroSection/>
    </div>

    <div>
        <ProjectList/>
    </div>

    <Footer />
    </div>
  );
}
