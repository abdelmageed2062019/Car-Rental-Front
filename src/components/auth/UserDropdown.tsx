"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { User, LogOut, Car, ChevronDown, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logout } from "@/store/authSlice";
import Link from "next/link";

interface UserDropdownProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!user || !user.firstName) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <Button
        variant="ghost"
        className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg"
      >
        <User className="w-4 h-5 text-[#5937E0]" />
        <span className="text-sm font-medium">Loading...</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </Button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg"
        >
          <User className="w-4 h-5 text-[#5937E0]" />
          <span className="text-sm font-medium">Hi, {user.firstName}</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4" />
            Profile
          </Link>

          <Link
            href="/rentals"
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Car className="w-4 h-4" />
            My Rentals
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
