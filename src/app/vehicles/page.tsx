"use client";

import { useState, useEffect } from "react";
import CarCard from "@/components/CarCard";
import Logos from "@/components/Sections/Logos";
import { useCars, useSearchCars, CarSearchParams } from "@/hooks/useCars";
import Loading from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

const Vehicles = () => {
  const searchParamsFromURL = useSearchParams();
  const [searchParams, setSearchParams] = useState<CarSearchParams>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (searchParamsFromURL) {
      const brand = searchParamsFromURL.get("brand");
      const gearBox = searchParamsFromURL.get("gearBox");
      const fuel = searchParamsFromURL.get("fuel");
      const minPrice = searchParamsFromURL.get("minPrice");
      const maxPrice = searchParamsFromURL.get("maxPrice");

      const initialParams: CarSearchParams = {};
      if (brand) initialParams.brand = brand;
      if (gearBox) initialParams.gearBox = gearBox;
      if (fuel) initialParams.fuel = fuel;
      if (minPrice) initialParams.minPrice = parseInt(minPrice);
      if (maxPrice) initialParams.maxPrice = parseInt(maxPrice);

      if (Object.keys(initialParams).length > 0) {
        setSearchParams(initialParams);
        setIsFilterOpen(true);
      }
    }
  }, [searchParamsFromURL]);

  const hasSearchParams = Object.keys(searchParams).some(
    (key) => searchParams[key as keyof CarSearchParams] !== undefined
  );

  const {
    data: carsResponse,
    isLoading: carsLoading,
    error: carsError,
  } = useCars();
  const {
    data: searchResponse,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchCars(searchParams);

  const cars = hasSearchParams
    ? searchResponse?.data || []
    : carsResponse?.data || [];
  const isLoading = hasSearchParams ? searchLoading : carsLoading;
  const error = hasSearchParams ? searchError : carsError;

  const handleSearch = (newParams: CarSearchParams) => {
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setIsFilterOpen(false);
  };

  const hasActiveFilters = Object.keys(searchParams).some(
    (key) => searchParams[key as keyof CarSearchParams] !== undefined
  );

  if (isLoading) {
    return (
      <Loading
        variant="loading"
        title="Loading vehicles..."
        message="Please wait while we fetch the latest car listings."
        size="lg"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Select a vehicle group
            </h1>
          </div>
          <div className="text-center py-16">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Error loading vehicles
            </h3>
            <p className="text-red-500">
              Failed to load car listings. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Select a vehicle group
          </h1>
        </div>

        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
              {!isMounted ? (
                <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-md" />
              ) : (
                <>
                  <Button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    {hasActiveFilters ? "Filters Active" : "Filters"}
                  </Button>
                  {hasActiveFilters && (
                    <Button
                      onClick={clearFilters}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </>
              )}
            </div>

            <div className="text-sm text-gray-600">
              {cars.length} vehicle{cars.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* Advanced Search Filters */}
          {isFilterOpen && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Advanced Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Brand Filter */}
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Select
                      value={searchParams.brand || "all"}
                      onValueChange={(value) =>
                        handleSearch({
                          ...searchParams,
                          brand: value === "all" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All brands" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All brands</SelectItem>
                        <SelectItem value="BMW">BMW</SelectItem>
                        <SelectItem value="Mercedes">Mercedes</SelectItem>
                        <SelectItem value="Audi">Audi</SelectItem>
                        <SelectItem value="Toyota">Toyota</SelectItem>
                        <SelectItem value="Honda">Honda</SelectItem>
                        <SelectItem value="Ford">Ford</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Gearbox Filter */}
                  <div>
                    <Label htmlFor="gearBox">Transmission</Label>
                    <Select
                      value={searchParams.gearBox || "all"}
                      onValueChange={(value) =>
                        handleSearch({
                          ...searchParams,
                          gearBox: value === "all" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All transmissions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All transmissions</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fuel Filter */}
                  <div>
                    <Label htmlFor="fuel">Fuel Type</Label>
                    <Select
                      value={searchParams.fuel || "all"}
                      onValueChange={(value) =>
                        handleSearch({
                          ...searchParams,
                          fuel: value === "all" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All fuel types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All fuel types</SelectItem>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <Label>Price Range (per day)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={searchParams.minPrice || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseInt(e.target.value)
                            : undefined;
                          handleSearch({ ...searchParams, minPrice: value });
                        }}
                        className="w-20"
                      />
                      <span className="text-gray-500 self-center">-</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={searchParams.maxPrice || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseInt(e.target.value)
                            : undefined;
                          handleSearch({ ...searchParams, maxPrice: value });
                        }}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Active Filters Banner */}
        {hasActiveFilters && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Showing results for:
                </span>
                <div className="flex gap-2">
                  {searchParams.brand && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                      Brand: {searchParams.brand}
                    </span>
                  )}
                  {searchParams.gearBox && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                      Transmission: {searchParams.gearBox}
                    </span>
                  )}
                  {searchParams.fuel && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                      Fuel: {searchParams.fuel}
                    </span>
                  )}
                  {searchParams.minPrice && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                      Min Price: ${searchParams.minPrice}
                    </span>
                  )}
                  {searchParams.maxPrice && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                      Max Price: ${searchParams.maxPrice}
                    </span>
                  )}
                </div>
              </div>
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
              No vehicles found
            </h3>
            <p className="text-gray-500">
              {hasActiveFilters
                ? "No vehicles match your current filters. Try adjusting your search criteria."
                : "No vehicles available at the moment."}
            </p>
          </div>
        )}
        <Logos />
      </div>
    </div>
  );
};

export default Vehicles;
