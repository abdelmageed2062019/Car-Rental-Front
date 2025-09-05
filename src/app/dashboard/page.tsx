"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data - replace with actual API calls
const mockStats = {
  totalRentals: 1247,
  activeRentals: 89,
  totalCars: 156,
  availableCars: 67,
  totalRevenue: 125430,
  monthlyRevenue: 15420,
  totalUsers: 892,
  newUsers: 23,
};

const mockRecentRentals = [
  {
    id: "1",
    customer: "John Doe",
    car: "Toyota Camry",
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    status: "active",
    amount: 450,
  },
  {
    id: "2",
    customer: "Jane Smith",
    car: "Honda Civic",
    startDate: "2024-01-14",
    endDate: "2024-01-18",
    status: "completed",
    amount: 320,
  },
  {
    id: "3",
    customer: "Mike Johnson",
    car: "BMW X5",
    startDate: "2024-01-16",
    endDate: "2024-01-22",
    status: "pending",
    amount: 680,
  },
];

export default function DashboardOverview() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9E0C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your car rental business.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/rentals")}
          className="bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Rental
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rentals</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.totalRentals.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Rentals
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeRentals}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+5</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockStats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{mockStats.newUsers}</span> new
              this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentRentals.map((rental) => (
                <div
                  key={rental.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{rental.customer}</p>
                    <p className="text-sm text-gray-600">{rental.car}</p>
                    <p className="text-xs text-gray-500">
                      {rental.startDate} - {rental.endDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${rental.amount}</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        rental.status === "active"
                          ? "bg-green-100 text-green-800"
                          : rental.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {rental.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => router.push("/dashboard/rentals")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View All Rentals
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/cars")}
              >
                <Car className="w-4 h-4 mr-2" />
                Manage Cars
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/users")}
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/reports")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Reports
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
