"use client";

import Link from "next/link";
import { Menu, Car, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthModal, UserDropdown } from "@/components/auth";
import { RootState } from "@/store/store";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isMounted, setIsMounted] = useState(false);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Vehicles", href: "/vehicles" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <header className="w-full max-w-[1296px] mx-auto px-4 md:px-0">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center gap-2">
            <Car className="w-6 h-6" />
            <span className="font-bold text-lg">Car Rental</span>
          </div>
          <div className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="text-sm font-medium text-gray-400"
              >
                {link.name}
              </div>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-md" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full max-w-[1296px] mx-auto px-4 md:px-0">
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <Car className="w-6 h-6" />
          <span className="font-bold text-lg">Car Rental</span>
        </div>

        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-[#5937E0] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <UserDropdown user={user} />
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAuthMode("login");
                  setAuthModalOpen(true);
                }}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setAuthMode("register");
                  setAuthModalOpen(true);
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden p-2 hover:bg-transparent focus:ring-0 focus:outline-none border-none shadow-none"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="p-4 focus:outline-none focus:ring-0 border-0"
          >
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium hover:text-[#5937E0]"
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated && user ? (
                <div className="mt-4 border-t pt-4">
                  <UserDropdown user={user} />
                </div>
              ) : (
                <div className="mt-4 border-t pt-4 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setAuthMode("login");
                      setAuthModalOpen(true);
                      setOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setAuthMode("register");
                      setAuthModalOpen(true);
                      setOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </header>
  );
};

export default Navbar;
