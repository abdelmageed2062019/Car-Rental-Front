"use client";

import { ArrowRight } from "lucide-react";
import CarCard from "../CarCard";
import { useCars } from "@/hooks/useCars";
import Loading from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ChooseCar = () => {
  const { data: carsResponse, isLoading, error } = useCars();

  const cars = carsResponse?.data?.slice(0, 9) || [];

  if (isLoading) {
    return (
      <div className="mt-7">
        <Loading
          variant="loading"
          title="Loading featured cars..."
          message="Please wait while we fetch the best car selections for you."
          size="lg"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-7">
        <div className="text-center py-16">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Error loading cars
          </h3>
          <p className="text-red-500">
            Failed to load car listings. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-7">
      <h2 className="text-4xl md:text-5xl pl-4 md:pl-0 font-bold mb-6 text-gray-950">
        Choose the car that
        <br />
        suits you
      </h2>

      <div className="flex justify-end w-full pr-4 md:pr-0 mb-6">
        <Link href="/vehicles">
          <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
            <div className="inline text-right">
              <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <span>View all </span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cars.map((car) => (
          <CarCard
            key={car._id}
            id={car._id || ""}
            name={car.name}
            type={car.brand}
            image={
              car.images &&
              car.images.length > 0 &&
              car.images[0] &&
              process.env.NEXT_PUBLIC_API_BASE_URL
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${car.images[0]}`
                : "/car.png"
            }
            price={car.pricePerDay}
            transmission={car.technicalSpecs.gearBox}
            fuelType={car.technicalSpecs.fuel}
            air={
              car.technicalSpecs.airConditioner ? "Air Conditioner" : "No AC"
            }
          />
        ))}
      </div>

      {cars.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No cars available
          </h3>
          <p className="text-gray-500">
            No cars are currently available. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChooseCar;
