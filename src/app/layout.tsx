import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import ConditionalLayout from "@/components/ConditionalLayout";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
  fallback: ["system-ui", "arial", "sans-serif"],
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Car Rental",
  description: "Car Rent Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${workSans.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
