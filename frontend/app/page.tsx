import AboutSection from "@/components/section/AboutSection";
import BaseSection from "@/components/section/BaseSection";
import FaqSection from "@/components/section/FaqSection";
import WhySection from "@/components/section/WhySection";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-audiowided)]">
      <BaseSection/>
      <AboutSection/>
      <WhySection/>
      <FaqSection/>
    </div>
  );
}
