"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Save,
  Bell,
  Shield,
  Globe,
  CreditCard,
  User,
  Building,
} from "lucide-react";

export default function DashboardSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: "general", name: "General", icon: Settings },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
    { id: "billing", name: "Billing", icon: CreditCard },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9E0C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your account and application settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-[#FF9E0C] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "general" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="compunknownName">Compunknown Name</Label>
                    <Input
                      id="compunknownName"
                      defaultValue="CarRent Solutions"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="est">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                        <SelectItem value="cst">Central Time (CST)</SelectItem>
                        <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="compunknownDescription">
                    Compunknown Description
                  </Label>
                  <Textarea
                    id="compunknownDescription"
                    defaultValue="Premium car rental service providing quality vehicles for all your transportation needs."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="cad">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">
                        Receive notifications via email
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">SMS Notifications</h3>
                      <p className="text-sm text-gray-500">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-500">
                        Receive push notifications in browser
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Notification Types</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New rental bookings</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rental cancellations</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Payment confirmations</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">System maintenance</span>
                      <input type="checkbox" className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <Button className="bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Two-Factor Authentication</h3>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Enable 2FA</h4>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Session Management</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Auto-logout after inactivity
                      </span>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button className="bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "billing" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Billing & Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Current Plan</h3>
                      <p className="text-sm text-gray-500">Professional Plan</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$99/month</p>
                      <p className="text-sm text-gray-500">
                        Next billing: Jan 15, 2024
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Payment Method</h3>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">**** **** **** 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Billing History</h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">December 2023</p>
                        <p className="text-sm text-gray-500">
                          Professional Plan
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$99.00</p>
                        <p className="text-sm text-green-600">Paid</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">November 2023</p>
                        <p className="text-sm text-gray-500">
                          Professional Plan
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$99.00</p>
                        <p className="text-sm text-green-600">Paid</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline">Download Invoice</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
