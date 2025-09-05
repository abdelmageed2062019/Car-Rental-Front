import AboutText from "@/components/Sections/AboutText";
import Accordion from "@/components/Sections/Accordion";
import Breadcrumb from "@/components/Sections/Breadcrumb";
import Download from "@/components/Sections/Download";
import VideoPlayer from "@/components/Sections/VideoPlayer";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="flex justify-center items-center mt-6 mb-6">
        <Breadcrumb currentPage="About Us" text="About Us" />
      </div>
      <AboutText />
      <VideoPlayer />
      <Download />
      <Accordion />
    </div>
  );
};

export default page;
