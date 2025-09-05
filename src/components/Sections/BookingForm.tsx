"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useBranches } from "@/hooks/useBranches";
import Loading from "@/components/ui/loading";

const BookingForm = () => {
  const router = useRouter();
  const {
    data: branchesResponse,
    isLoading: branchesLoading,
    error: branchesError,
  } = useBranches();
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [rentalLocation, setRentalLocation] = useState<string>("");
  const [returnLocation, setReturnLocation] = useState<string>("");
  const [rentalDate, setRentalDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedBrand && selectedBrand !== "all") {
      params.append("brand", selectedBrand);
    }

    const queryString = params.toString();
    const url = queryString ? `/vehicles?${queryString}` : "/vehicles";
    router.push(url);
  };

  const isFormValid =
    selectedBrand &&
    rentalLocation &&
    returnLocation &&
    rentalDate &&
    returnDate &&
    rentalLocation !== returnLocation;

  // Show loading state while fetching branches
  if (branchesLoading) {
    return (
      <div className="shadow-lg rounded-2xl p-6 border border-gray-200 mt-4 bg-white z-10 relative">
        <Loading
          variant="loading"
          title="Loading booking form..."
          message="Please wait while we fetch available locations."
          size="md"
        />
      </div>
    );
  }

  // Show error state if branches fail to load
  if (branchesError) {
    return (
      <div className="shadow-lg rounded-2xl p-6 border border-gray-200 mt-4 bg-white z-10 relative">
        <div className="text-center py-8">
          <div className="text-red-400 text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Error loading locations
          </h3>
          <p className="text-red-500 text-sm">
            Failed to load available rental locations. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const branches = branchesResponse?.data || [];

  return (
    <div className="shadow-lg rounded-2xl p-6 border border-gray-200 mt-4 bg-white z-10 relative">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-950">
        Book Your Car
      </h2>
      <div className="space-y-4">
        <div>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-full text-gray-900">
              <SelectValue placeholder="Select Car Brand" />
            </SelectTrigger>
            <SelectContent className="text-gray-900">
              <SelectItem value="all" className="text-gray-900">
                All Brands
              </SelectItem>
              <SelectItem value="BMW" className="text-gray-900">
                BMW
              </SelectItem>
              <SelectItem value="Mercedes" className="text-gray-900">
                Mercedes
              </SelectItem>
              <SelectItem value="Audi" className="text-gray-900">
                Audi
              </SelectItem>
              <SelectItem value="Toyota" className="text-gray-900">
                Toyota
              </SelectItem>
              <SelectItem value="Honda" className="text-gray-900">
                Honda
              </SelectItem>
              <SelectItem value="Ford" className="text-gray-900">
                Ford
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={rentalLocation} onValueChange={setRentalLocation}>
            <SelectTrigger className="w-full text-gray-900">
              <SelectValue placeholder="Select Place of Rental" />
            </SelectTrigger>
            <SelectContent className="text-gray-900">
              {branches.map((branch) => (
                <SelectItem
                  key={branch._id}
                  value={branch._id}
                  className="text-gray-900"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{branch.name}</span>
                    <span className="text-sm text-gray-600">
                      {branch.address}, {branch.city}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={returnLocation} onValueChange={setReturnLocation}>
            <SelectTrigger className="w-full text-gray-900">
              <SelectValue placeholder="Select Place of Return" />
            </SelectTrigger>
            <SelectContent className="text-gray-900">
              {branches.map((branch) => (
                <SelectItem
                  key={branch._id}
                  value={branch._id}
                  className="text-gray-900"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{branch.name}</span>
                    <span className="text-sm text-gray-600">
                      {branch.address}, {branch.city}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {rentalLocation &&
            returnLocation &&
            rentalLocation === returnLocation && (
              <p className="text-sm text-red-500 mt-1">
                Rental and return locations must be different
              </p>
            )}
        </div>

        <div>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between border rounded-md px-4 py-2 text-left text-gray-700"
              >
                {rentalDate ? (
                  format(rentalDate, "PPP")
                ) : (
                  <span className="text-gray-500">Rental date</span>
                )}
                <Calendar className="h-5 w-5 text-gray-500" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <CalendarComponent
                mode="single"
                selected={rentalDate}
                onSelect={setRentalDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between border rounded-md px-4 py-2 text-left text-gray-700 "
              >
                {returnDate ? (
                  format(returnDate, "PPP")
                ) : (
                  <span className="text-gray-500">Return date</span>
                )}
                <Calendar className="h-5 w-5 text-gray-500" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <CalendarComponent
                mode="single"
                selected={returnDate}
                onSelect={setReturnDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          className="w-full bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white py-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSearch}
          disabled={!isFormValid}
        >
          Search Available Cars
        </Button>
      </div>
    </div>
  );
};

export default BookingForm;
