import Image from "next/image";
import {Header} from "@/components/ui/header";
import {VotesHeroSection } from "@/components/sections/votesherosection";
import{ Footer } from "@/components/sections/footer";
import { VotesList } from "@/components/sections/voteslists";
export default function Home() {
  return (
    <div className="relative">
    <Header />
    <div className="pt-10">
        <VotesHeroSection/>
    </div>

    <div>
        <VotesList/>
    </div>

    <Footer />
    </div>
  );
}
