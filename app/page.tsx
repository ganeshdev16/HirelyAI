import CustomButton from "@/components/CustomButton";
import Footer from "@/components/Footer";
import GoodLifeCompanySection from "@/components/GoodLifeCompanySection";
import JobCategory from "@/components/JobCategory";
import JobSearchComponent from "@/components/JobSearchComponent";
import LogoStrip from "@/components/LogoStrip";
import NavBar from "@/components/NavBar";
import TestimonialsSection from "@/components/TestimonialsSection";
import WebsiteChatbot from "@/components/WebsiteChatbot";
import { Figtree } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const figtree = Figtree({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="relative min-h-screen min-w-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/assets/background.jpg"
          alt="Background"
          fill
          className="object-fill blur-md h-screen w-screen"
          priority
        />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-50 flex flex-col min-h-screen">
        <NavBar />

        <section className="h-screen flex items-center justify-center">
          <div className="flex flex-col justify-center items-center max-w-4xl">
            <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-3 sm:mb-4 text-center leading-tight">
              Find Your Dream Job Today!
            </h1>
            <p className="mb-8 text-white font-normal text-sm sm:text-base lg:text-lg text-center max-w-2xl">
              Connecting Talent with Opportunity: Your Gateway to Career Success
            </p>
            <Link href={"/search"}>
              <CustomButton className="p-7" size="md" variant="primary">
                <p className="text-sm lg:text-base">Get Your Dream Job</p>
              </CustomButton>
            </Link>
          </div>
        </section>
        <LogoStrip />
        <JobCategory />
        <GoodLifeCompanySection />
        <TestimonialsSection />
        <Footer />
      </div>

      {/* Website Chatbot */}
      <WebsiteChatbot />
    </div>
  );
}
