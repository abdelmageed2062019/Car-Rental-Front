import Image from "next/image";
import Logo1 from "@/assets/Logo.png";
import Logo2 from "@/assets/Logo (1).png";
import Logo3 from "@/assets/Logo (2).png";
import Logo4 from "@/assets/Logo (3).png";
import Logo5 from "@/assets/Logo (4).png";
import Logo6 from "@/assets/Logo (5).png";

const Logos = () => {
  const logos = [
    { src: Logo1, alt: "Brand Logo 1" },
    { src: Logo2, alt: "Brand Logo 2" },
    { src: Logo3, alt: "Brand Logo 3" },
    { src: Logo4, alt: "Brand Logo 4" },
    { src: Logo5, alt: "Brand Logo 5" },
    { src: Logo6, alt: "Brand Logo 6" },
  ];

  return (
    <section className="py-16  mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={60}
                className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Logos;
