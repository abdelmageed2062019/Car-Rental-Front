import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Car,
} from "lucide-react";
import Store from "@/assets/store.png";
import Google from "@/assets/google.png";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className=" text-black py-10">
      <div className="pt-8 mb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex items-center space-x-2 mb-6 lg:mb-0">
            <Car className="h-6 w-6 sm:h-8 sm:w-8 text-footer-accent" />
            <span className="text-lg sm:text-xl font-bold text-footer-foreground">
              Car Rental
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-footer-accent rounded-full bg-[#FF9E0C] flex-shrink-0">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-footer-muted uppercase tracking-wide font-bold">
                Address
              </p>
              <p className="text-sm text-footer-foreground">
                Oxford Ave. Cary, NC 27511
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-footer-accent rounded-full bg-[#FF9E0C] flex-shrink-0">
              <Mail className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-footer-muted uppercase tracking-wide font-bold">
                Email
              </p>
              <p className="text-sm text-footer-foreground">
                nwjiger@yahoo.com
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-footer-accent rounded-full bg-[#FF9E0C] flex-shrink-0">
              <Phone className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-footer-muted uppercase tracking-wide font-bold">
                Phone
              </p>
              <p className="text-sm text-footer-foreground">+537 547-6401</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mt-10">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 space-y-6">
            <p className="text-footer-muted text-sm leading-relaxed">
              Faucibus faucibus pellentesque dictum turpis. Id pellentesque
              mattis turpis massa a id iaculis lorem t...
            </p>

            <div className="flex gap-4 sm:gap-6">
              <div className="p-2 bg-footer-border rounded-full hover:bg-footer-accent transition-colors bg-gray-950 text-white cursor-pointer">
                <Facebook className="h-4 w-4" />
              </div>
              <div className="p-2 bg-footer-border rounded-full hover:bg-footer-accent transition-colors bg-gray-950 text-white cursor-pointer">
                <Instagram className="h-4 w-4" />
              </div>
              <div className="p-2 bg-footer-border rounded-full hover:bg-footer-accent transition-colors bg-gray-950 text-white cursor-pointer">
                <Twitter className="h-4 w-4" />
              </div>
              <div className="p-2 bg-footer-border rounded-full hover:bg-footer-accent transition-colors bg-gray-950 text-white cursor-pointer">
                <Youtube className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-footer-foreground">
              Useful links
            </h3>
            <ul className="space-y-3">
              {["About us", "Contact us", "Gallery", "Blog", "F.A.Q"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-footer-muted hover:text-footer-accent transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-footer-foreground">
              Vehicles
            </h3>
            <ul className="space-y-3">
              {["Sedan", "Cabriolet", "Pickup", "Minivan", "SUV"].map(
                (vehicle) => (
                  <li key={vehicle}>
                    <a
                      href="#"
                      className="text-footer-muted hover:text-footer-accent transition-colors text-sm"
                    >
                      {vehicle}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-footer-foreground">
              Download App
            </h3>
            <div className="space-y-3">
              <a href="#" className="block">
                <Image
                  src={Store}
                  alt="Download on the App Store"
                  className="h-10 sm:h-12 w-auto hover:opacity-80 transition-opacity"
                />
              </a>
              <a href="#" className="block">
                <Image
                  src={Google}
                  alt="Get it on Google Play"
                  className="h-10 sm:h-12 w-auto hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t border-gray-200 px-4">
        © Copyright Car Rental 2024. Design by Figma.guru
      </div>
    </footer>
  );
};

export default Footer;
