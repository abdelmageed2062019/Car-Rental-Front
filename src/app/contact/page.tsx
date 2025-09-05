import Logos from "@/components/Sections/Logos";
import Blog from "@/components/Sections/Blog";
import Breadcrumb from "@/components/Sections/Breadcrumb";
import ContactForm from "@/components/Sections/ContactForm";
import React from "react";
import ContactInfo from "@/components/Sections/ContactInfo";

const page = () => {
  return (
    <div>
      <div className="flex justify-center items-center mt-6 mb-6">
        <Breadcrumb currentPage="Contact Us" text="Get in Touch" />
      </div>
      <ContactForm />

      <ContactInfo />

      <Blog />
      <Logos />
    </div>
  );
};

export default page;
