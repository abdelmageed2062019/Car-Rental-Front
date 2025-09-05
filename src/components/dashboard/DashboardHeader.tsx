"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Bell, Search, User } from "lucide-react";
import { User as UserType } from "@/store/authSlice";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  user: UserType | null;
}

export default function DashboardHeader({
  onMenuClick,
  user,
}: DashboardHeaderProps) {
  const [notifications] = useState(3); 

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden mr-2"
          >
            <Menu className="w-5 h-5" />
          </Button>

         
        </div>

        <div className="flex items-center space-x-4">
          

          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="w-8 h-8 bg-[#FF9E0C] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
