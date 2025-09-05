import Hero from "@/components/Sections/Hero";
import Features from "@/components/Sections/Features";
import Steps from "@/components/Sections/Steps";
import ChooseCar from "@/components/Sections/ChooseCar";
import Numbers from "@/components/Sections/Numbers";
import Mobile from "@/components/Sections/Mobile";
import Enjoy from "@/components/Sections/Enjoy";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Steps />
      <ChooseCar />
      <Numbers />
      <Mobile />
      <Enjoy />
    </div>
  );
}
