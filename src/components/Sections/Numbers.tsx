import React from "react";
import { Car, Users, Calendar, Timer } from "lucide-react";
import Whires from "@/assets/whires.png";
import HeroImage from "@/assets/hero-img.png";
import Image from "next/image";

const Numbers = () => {
  const stats = [
    {
      icon: <Car size={32} />,
      value: "540+",
      label: "Cars",
    },
    {
      icon: <Users size={32} />,
      value: "20k+",
      label: "Customers",
    },
    {
      icon: <Calendar size={32} />,
      value: "25+",
      label: "Years",
    },
    {
      icon: <Timer size={32} />,
      value: "20m+",
      label: "Miles",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-12 py-12 text-center bg-[#5937E0] rounded-4xl mt-20 text-white relative overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 z-20">
        Facts in Numbers
      </h2>
      <p className="max-w-2xl mx-auto mb-10 z-20 relative">
        Amet cras hac orci lacus. Faucibus ipsum arcu lectus nibh sapien
        bibendum ullamcorper in. Diam tincidunt tincidunt erat at semper
        fermentum.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 z-20 relative">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-row items-start justify-center md:justify-start bg-white rounded-2xl px-2 py-3 md:p-6  transition gap-5"
          >
            <div className="flex items-center justify-center bg-[#FF9E0C] rounded-xl p-2 md:p-4">
              {stat.icon}
            </div>
            <div className="flex items-start flex-col">
              <h3 className="text-lg md:text-3xl font-bold text-gray-800">
                {stat.value}
              </h3>
              <p className="text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Image
        src={Whires}
        alt="Car"
        width={1046.47}
        height={388}
        className="absolute top-[50%] left-[-10%] z-10 rotate-20"
      />

      <Image
        src={HeroImage}
        alt="Car"
        width={498}
        height={418}
        className="absolute top-[50%] right-[50%] transform translate-x-1/2 translate-y-[-30%] z-1 opacity-85"
      />
    </section>
  );
};

export default Numbers;
