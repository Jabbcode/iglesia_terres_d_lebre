import { Hero } from "@/components/sections/hero";
import { NextService } from "@/components/sections/next-service";
import { Community } from "@/components/sections/community";
import { CtaNew } from "@/components/sections/cta-new";

export default function Home() {
  return (
    <>
      <Hero />
      <NextService />
      <Community />
      <CtaNew />
    </>
  );
}
