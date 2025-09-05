import Image from "next/image";
import Frame from "@/assets/mobile-frame.png";
import Store from "@/assets/store.png";
import Google from "@/assets/google.png";
import Whire from "@/assets/whires2.png";

export default function Download() {
  return (
    <section className="pt-16 sm:pt-24 lg:pt-32">
      <div className="w-full flex justify-center items-center bg-[#5937E0] rounded-2xl sm:rounded-3xl lg:rounded-4xl p-6 sm:p-8 lg:p-10 relative">
        <Image
          src={Whire}
          alt="Whire"
          width={809.55}
          height={160}
          className="absolute top-2 right-0 z-0 hidden sm:block"
        />
        <div className="absolute left-[5%] sm:left-[10%] top-[-20%] sm:top-[-30%] lg:top-[-40%] w-[150px] h-[300px] sm:w-[180px] sm:h-[350px] lg:w-[220px] lg:h-[450px] hidden sm:block">
          <Image
            src={Frame}
            alt="Phone"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>

        <div className="max-w-[1296px] w-full flex flex-col md:flex-row items-center text-white pl-0 sm:pl-[30%] md:pl-[40%] lg:pl-[50%] z-10">
          <div className="flex flex-col text-center md:text-left">
            <p className="text-xs sm:text-sm uppercase tracking-wide mb-2 opacity-80">
              Download our app
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8">
              Download our app
            </h2>
            <p className="text-sm sm:text-base text-gray-200 mb-4 sm:mb-6 max-w-md">
              Turpis morbi enim nisi pulvinar leo dui tellus. Faucibus egestas
              semper diam rutrum dictumst ut donec. Nisi nisi morbi vel in
              vulputate. Nulla nam eget urna fusce vulputate at risus
            </p>

            <div className="flex justify-center md:justify-start gap-3 sm:gap-4">
              <a href="#">
                <Image
                  src={Store}
                  alt="Download on App Store"
                  width={120}
                  height={40}
                  className="sm:w-[150px] sm:h-[50px]"
                />
              </a>
              <a href="#">
                <Image
                  src={Google}
                  alt="Get it on Google Play"
                  width={120}
                  height={40}
                  className="sm:w-[150px] sm:h-[50px]"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
