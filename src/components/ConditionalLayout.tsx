"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    // For dashboard pages, only render children (no navbar/footer)
    return <>{children}</>;
  }

  // For all other pages, render with navbar and footer
  return (
    <div className="container max-w-[1296px] mx-auto">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
