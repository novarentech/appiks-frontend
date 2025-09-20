import { Cta } from "@/components/features/landing-page/Cta";
import { Feature } from "@/components/features/landing-page/Feature";
import { Footer7 } from "@/components/features/landing-page/Footer";
import { Hero } from "@/components/features/landing-page/Hero";
import { Stats } from "@/components/features/landing-page/Stats";
import { Testimonial } from "@/components/features/landing-page/Testimonial";
import { NavbarLandingPage } from "@/components/layout/LandingPageNavbar";


export default function Home() {
  return (
    <>
      <NavbarLandingPage />
      <Hero />
      <Feature />
      <Stats />
      <Cta />
      <Testimonial />
      <Footer7 />
    </>
  );
}
