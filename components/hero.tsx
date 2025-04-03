import { ChevronDown } from "lucide-react";
import AnimatedBackground from "./animated-background";
import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* <AnimatedBackground /> */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Never Run Out of Content Ideas Again!
          </h1>
          <p className="text-xl text-gray-100 mb-8 leading-relaxed">
            Our AI analyzes your past social media content and trends to
            generate fresh, personalized ideas—so you can focus on creating.
          </p>
          <Button className="bg-violet-700 hover:bg-violet-800 text-white text-lg px-8 py-6 rounded-xl">
            Get Early Access
          </Button>

          <div className="mt-12 flex justify-center">
            <a
              href="#how-it-works"
              className="flex flex-col items-center text-gray-500 hover:text-violet-700 transition-colors"
            >
              <span className="text-sm mb-2">Learn More</span>
              <ChevronDown className="animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
