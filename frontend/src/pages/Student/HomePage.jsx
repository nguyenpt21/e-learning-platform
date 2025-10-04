import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CoursesList from "../../components/CoursesList";
import FeatureSection from "../../components/FeatureSection";
import HeroSection from "../../components/HeroSection";
import Testimonials from "../../components/Testimonials";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="flex-col mt-18">
        <HeroSection />
        <FeatureSection />
        <CoursesList />
        <Testimonials />
      </div>
      <Footer />
    </div>
  );
}
