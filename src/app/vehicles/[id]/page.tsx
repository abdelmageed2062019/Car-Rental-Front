"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Car, Fuel, Users, Snowflake, MapPin, Check } from "lucide-react";
import Image from "next/image";
import OtherCars from "@/components/Sections/OtherCars";
import { useParams } from "next/navigation";
import { useCar } from "@/hooks/useCars";
import Loading from "@/components/ui/loading";
import RentalModal from "@/components/rental/RentalModal";

export default function Home() {
  const params = useParams();
  const id = params.id as string;
  const { data: carResponse, isLoading, error } = useCar(id);
  const car = carResponse?.data;

  console.log("ID:", id);
  console.log("Car Response:", carResponse);
  console.log("Car Data:", car);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);

  const carImages =
    car?.images && car.images.length > 0
      ? car.images.map((img) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${img}`)
      : ["/car.png", "/Car (2).png", "/Car (3).png"];

  const specifications = [
    {
      icon: Car,
      label: "Gear Box",
      value: car?.technicalSpecs?.gearBox || "N/A",
    },
    { icon: Fuel, label: "Fuel", value: car?.technicalSpecs?.fuel || "N/A" },
    {
      icon: Users,
      label: "Doors",
      value: car?.technicalSpecs?.doors?.toString() || "N/A",
    },
    {
      icon: Snowflake,
      label: "Air Conditioner",
      value: car?.technicalSpecs?.airConditioner ? "Yes" : "No",
    },
    {
      icon: Users,
      label: "Seats",
      value: car?.technicalSpecs?.seats?.toString() || "N/A",
    },
    {
      icon: MapPin,
      label: "Distance",
      value: car?.technicalSpecs?.distance || "N/A",
    },
  ];

  const equipment = [
    { label: "ABS", included: car?.equipment?.ABS || false },
    { label: "Air Bags", included: car?.equipment?.airBags || false },
    {
      label: "Air Conditioning",
      included: car?.equipment?.airConditioning || false,
    },
    {
      label: "Cruise Control",
      included: car?.equipment?.cruiseControl || false,
    },
  ];

  if (isLoading) {
    return (
      <Loading
        variant="loading"
        title="Loading vehicle details..."
        message="Please wait while we fetch the car information."
        size="lg"
      />
    );
  }

  if (error || !car) {
    return (
      <Loading
        variant="error"
        title="Error loading vehicle"
        message={
          error
            ? "Failed to load car details. Please try again later."
            : "Car not found."
        }
        size="lg"
      />
    );
  }

  return (
    <div className="min-h-screen pt-4 md:pt-8">
      <div className="mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {car?.name || "Loading..."}
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  {car?.brand || "Loading..."}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-blue-600">
                    ${car?.pricePerDay || "..."}
                  </span>
                  <span className="text-gray-500">/ day</span>
                </div>
              </div>
            </div>

            <Card
              className="overflow-hidden border-0"
              style={{
                boxShadow: "none",
              }}
            >
              <CardContent className="p-8 h-[400px] flex justify-center items-center">
                <div className="relative">
                  <Image
                    src={carImages[selectedImage]}
                    alt={`${car.name} - ${car.brand}`}
                    width={400}
                    height={400}
                    className="rounded-lg transition-all duration-300 hover:scale-105"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              {carImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                    selectedImage === index
                      ? "ring-2 ring-blue-500 scale-105"
                      : "hover:scale-105 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${car.name} view ${index + 1}`}
                    width={80}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="shadow-none border-0">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  Technical Specification
                </h2>

                <div className="grid grid-cols-3 gap-6">
                  {specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-start text-start group"
                    >
                      <spec.icon className="w-6 h-6 text-gray-900 mb-2" />

                      <span className=" text-gray-900 mb-1 font-semibold">
                        {spec.label}
                      </span>
                      <span className="text-sm text-gray-600">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <Button
                  onClick={() => setIsRentalModalOpen(true)}
                  className="w-[50%] bg-[#5937E0] text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  Rent a car
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-none border-0">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  Car Equipment
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {equipment.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          item.included
                            ? "bg-[#5937E0] text-white"
                            : "bg-[#5937E0] text-gray-400"
                        }`}
                      >
                        {item.included ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          item.included ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <OtherCars currentCarId={id} />

      {/* Rental Modal */}
      <RentalModal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
        carId={id}
        carName={car?.name || ""}
        carBrand={car?.brand || ""}
        pricePerDay={car?.pricePerDay || 0}
      />
    </div>
  );
}
