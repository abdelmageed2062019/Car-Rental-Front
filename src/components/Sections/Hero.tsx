import HeroContent from "./HeroContent";
import BookingForm from "./BookingForm";
import Image from "next/image";
import Whires from "@/assets/whires.png";
import HeroImage from "@/assets/hero-img.png";

<Image src={Whires} alt="Car" width={500} height={400} />;

const Hero = () => {
  return (
    <section className="w-full max-w-[1296px] mx-auto px-12 py-12 md:flex md:justify-between md:items-center gap-38 bg-[#5937E0] rounded-4xl text-white overflow-hidden relative">
      <div className="flex-1 mb-10 md:mb-0">
        <HeroContent />
      </div>

      <div className="flex-1 max-w-md">
        <BookingForm />
      </div>

      <Image
        src={Whires}
        alt="Car"
        width={1646.47}
        height={388}
        className="absolute top-0 right-0 z-1"
      />

      <Image
        src={HeroImage}
        alt="Car"
        width={598}
        height={418}
        className="absolute top-[50%] right-[50%] transform translate-x-1/2 translate-y-[-30%] z-1"
      />
    </section>
  );
};

export default Hero;
