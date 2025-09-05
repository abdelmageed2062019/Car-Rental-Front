import Image from "next/image";
import Front from "@/assets/front.png";
import Whire from "@/assets/whires.png";

const Enjoy = () => {
  return (
    <section className="w-full px-4 md:px-14 py-10  bg-[#5937E0] rounded-4xl text-white relative overflow-hidden">
      <Image
        src={Whire}
        alt="Car"
        width={946.47}
        height={388}
        className="absolute top-[2%] left-0 z-1"
      />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        <div className="flex-2 flex flex-col gap-8 text-center lg:text-left">
          <div className="space-y-10">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Enjoy every mile with adorable companionship.
            </h2>
            <p className=" text-lg leading-relaxed max-w-2xl">
              Amet cras hac orci lacus. Faucibus ipsum arcu lectus nibh sapien
              bibendum ullamcorper in. Diam tincidunt tincidunt erat.
            </p>
          </div>

          <div className="w-full max-w-md mx-auto lg:mx-0 mt-10">
            <div className="relative">
              <input
                type="text"
                placeholder="City"
                className="w-full px-6 py-3 pr-16 text-lg  text-gray-950  bg-white rounded-xl focus:border-[#FF9E0C]  focus:outline-none border-0 transition-colors duration-200"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FF9E0C]  text-white  rounded-lg border-0 transition-colors duration-200 px-5 py-2">
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center lg:justify-start">
          <div className="relative w-full">
            <Image
              src={Front}
              alt="Enjoy every mile"
              width={600}
              height={600}
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Enjoy;
