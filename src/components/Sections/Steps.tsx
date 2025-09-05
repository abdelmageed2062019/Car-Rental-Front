import Image from "next/image";
import React from "react";
import cover from "@/assets/cover.jpg";

export default function Steps() {
  const items = [
    {
      number: "1",
      title: "Erat at semper",
      description:
        "Non amet fermentum est in enim at sit ullamcorper. Sit elementum rhoncus nullam feugiat. Risus sem fermentum dui ornare praesent. ",
    },
    {
      number: "2",
      title: "Urna nec vivamus risus duis arcu",
      description:
        "Aliquam adipiscing velit semper morbi. Purus non eu cursus porttitor tristique et gravida. Quis nunc interdum gravida ullamcorper",
    },
    {
      number: "3",
      title: "Lobortis euismod imperdiet tempus",
      description:
        "Viverra scelerisque mauris et nullam molestie et. Augue adipiscing praesent nisl cras nunc luctus viverra nisi",
    },
    {
      number: "4",
      title: "Cras nulla aliquet nam eleifend amet et",
      description:
        "Aliquam adipiscing velit semper morbi. Purus non eu cursus porttitor tristique et gravida.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-6 md:py-12 grid md:grid-cols-2 gap-12 md:gap-32 items-center">
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src={cover}
          alt="Example"
          layout="fill"
          objectFit="cover"
          className="rounded-2xl shadow-lg"
        />
      </div>

      <div className="flex flex-col gap-8 px-4 md:px-0">
        {items.map((item) => (
          <div key={item.number} className="flex gap-3 md:gap-6 flex-col">
            <div className="flex-shrink-0 flex items-center gap-2 md:gap-6">
              <span className="flex items-center justify-center w-10 h-10 aspect-square rounded-full bg-[#5937E0] text-white text-lg font-bold leading-none">
                {item.number}
              </span>
              <h3 className="text-xl font-semibold">{item.title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
