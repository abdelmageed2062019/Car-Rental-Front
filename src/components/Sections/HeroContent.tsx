"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroContent = () => {
  return (
    <div className="relative z-10">
      <h1 className="text-4xl md:text-5xl font-bold  leading-tight">
        Experience the road like never before
      </h1>
      <p className="mt-4  text-base md:text-lg leading-relaxed w-[60%]">
        Aliquam adipiscing velit semper morbi. Purus non eu cursus porttitor
        tristique et gravida. Quis nunc interdum gravida ullamcorper.
      </p>
      <Link href="/vehicles">
        <Button className="mt-6 bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white px-6 py-3 rounded-lg">
          View All Cars
        </Button>
      </Link>
    </div>
  );
};

export default HeroContent;
