"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Car,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { RentalData } from "@/lib/crud/rentals";
import Image from "next/image";

interface RentalCardProps {
  rental: RentalData;
}

const RentalCard = ({ rental }: RentalCardProps) => {
  console.log("Rental data structure:", {
    pickup: rental.pickup,
    return: rental.return,
    fullRental: rental,
  });

  if (!rental || !rental.carId || !rental.pickup || !rental.return) {
    console.warn("Incomplete rental data:", rental);
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>Rental data is incomplete or corrupted</p>
            <p className="text-sm">Please contact support if this persists</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "active":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm");
    } catch {
      return dateString;
    }
  };

  return (
    <Card className=" transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image
                src={
                  rental.carId?.images &&
                  rental.carId.images.length > 0 &&
                  rental.carId.images[0] &&
                  process.env.NEXT_PUBLIC_API_BASE_URL
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${rental.carId.images[0]}`
                    : "/car.png"
                }
                alt={rental.carId?.name || "Car"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-lg">
                {rental.carId?.name || "Unknown Car"}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {rental.carId?.brand || "Unknown Brand"}
              </p>
            </div>
          </div>
          <Badge
            className={`${getStatusColor(rental.status || "unknown")} border`}
          >
            <div className="flex items-center gap-1">
              {getStatusIcon(rental.status || "unknown")}
              {rental.status || "Unknown"}
            </div>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Rental Period:</span>
            </div>
            <p className="text-sm text-gray-600 ml-6">
              {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
            </p>
            <p className="text-sm text-gray-500 ml-6">
              Duration: {rental.duration || 0} day
              {(rental.duration || 0) !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Car className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Car Details:</span>
            </div>
            <p className="text-sm text-gray-600 ml-6">
              {rental.carId?.brand || "Unknown"} •{" "}
              {rental.carId?.name || "Unknown"}
            </p>
            <p className="text-sm text-gray-500 ml-6">
              ${rental.pricePerDay || 0}/day
            </p>
          </div>
        </div>

        {/* Pickup & Return */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="font-medium">Pickup:</span>
            </div>
            <p className="text-sm text-gray-600 ml-6">
              {rental.pickup?.branch?.name ||
                rental.pickup?.location ||
                "Location not specified"}
            </p>
            <p className="text-sm text-gray-500 ml-6">
              {rental.pickup?.branch?.address && rental.pickup?.branch?.city
                ? `${rental.pickup.branch.address}, ${rental.pickup.branch.city}`
                : "Address not specified"}
            </p>
            <p className="text-sm text-gray-500 ml-6">
              {formatDate(rental.startDate)} at {formatTime(rental.pickup.time)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="font-medium">Return:</span>
            </div>
            <p className="text-sm text-gray-600 ml-6">
              {rental.return?.branch?.name ||
                rental.return?.location ||
                "Location not specified"}
            </p>
            <p className="text-sm text-gray-500 ml-6">
              {rental.return?.branch?.address && rental.return?.branch?.city
                ? `${rental.return.branch.address}, ${rental.return.branch.city}`
                : "Address not specified"}
            </p>
            <p className="text-sm text-gray-500 ml-6">
              {formatDate(rental.endDate)} at {formatTime(rental.return.time)}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Payment:</span>
                <span className="text-gray-600">
                  {rental.payment?.method || "Not specified"}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Status:{" "}
                <span className="font-medium">
                  {rental.payment?.status || "Unknown"}
                </span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">
                ${rental.finalAmount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {rental.status === "pending" && (
            <Button variant="outline" size="sm" className="flex-1">
              Cancel
            </Button>
          )}
          {rental.status === "active" && (
            <Button variant="outline" size="sm" className="flex-1">
              Extend
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RentalCard;
