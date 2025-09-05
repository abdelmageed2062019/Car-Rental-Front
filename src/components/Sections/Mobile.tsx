import Image from "next/image";
import Store from "@/assets/store.png";
import Google from "@/assets/google.png";
import Frame from "@/assets/mobile-frame.png";

const Mobile = () => {
  return (
    <section className="w-full px-6 py-16 mt-0 md:mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 flex flex-col gap10 md:gap-20 text-center md:text-left">
          <div>
            <h2 className="text-3xl md:text-7xl font-bold mb-4">
              Download <br className="hidden md:block" /> mobile app
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mt-10 md:mt-15">
              Imperdiet ut tristique viverra nunc. Ultrices orci vel auctor
              cursus turpis nibh placerat massa. Fermentum urna ut at et in.
              Turpis aliquet cras hendrerit enim condimentum. Condimentum
              interdum risus bibendum urna.
            </p>
          </div>

          <div className="flex justify-center md:justify-start gap-4 mt-12">
            <a
              href="#"
              className="flex items-center gap-3  text-white rounded-lg shadow hover:bg-gray-800 transition"
            >
              <Image src={Store} alt="App Store" />
            </a>

            <a
              href="#"
              className="flex items-center gap-3  text-white rounded-lg shadow hover:bg-gray-800 transition"
            >
              <Image src={Google} alt="Google Play" />
            </a>
          </div>
        </div>

        <div className="flex-1 flex justify-center relative mt-12">
          <div className="relative w-[250px] md:w-[300px]">
            <Image
              src={Frame}
              alt="Mobile Frame 1"
              width={300}
              height={500}
              className="z-10 relative"
            />
            <Image
              src={Frame}
              alt="Mobile Frame 2"
              width={300}
              height={500}
              className="absolute top-[-30px] left-[20%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mobile;
