"use client";

import { useState, useEffect } from "react";
import { useUserRentals } from "@/hooks/useRentals";
import Loading from "@/components/ui/loading";
import RentalCard from "@/components/rental/RentalCard";
import Pagination from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const RentalsPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push("/");
    }
  }, [isMounted, isAuthenticated, router]);

  const {
    data: rentalsResponse,
    isLoading,
    error,
  } = useUserRentals(currentPage, itemsPerPage);

  // Debug: Log the API response
  useEffect(() => {
    if (rentalsResponse) {
      console.log("Rentals page - Full API response:", rentalsResponse);
      console.log("Rentals page - Data array:", rentalsResponse.data);
      if (rentalsResponse.data && rentalsResponse.data.length > 0) {
        console.log("Rentals page - First rental:", rentalsResponse.data[0]);
      }
    }
  }, [rentalsResponse]);

  // Debug: Log filtering results
  useEffect(() => {
    if (rentalsResponse?.data) {
      const rentals = rentalsResponse.data || [];
      const filteredRentals = rentals.filter((rental) => {
        try {
          const matchesSearch =
            searchTerm === "" ||
            (rental.carId?.name &&
              rental.carId.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (rental.carId?.brand &&
              rental.carId.brand
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (rental.pickup?.branch?.name &&
              rental.pickup.branch.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (rental.pickup?.location &&
              rental.pickup.location
                .toLowerCase()
                .includes(searchTerm.toLowerCase()));

          const matchesStatus =
            statusFilter === "all" ||
            (rental.status &&
              rental.status.toLowerCase() === statusFilter.toLowerCase());

          // Date range filtering
          let matchesDate = true;
          if (dateFrom && rental.startDate) {
            const startDate = new Date(rental.startDate);
            const fromDate = new Date(dateFrom);
            matchesDate = matchesDate && startDate >= fromDate;
          }
          if (dateTo && rental.startDate) {
            const startDate = new Date(rental.startDate);
            const toDate = new Date(dateTo);
            matchesDate = matchesDate && startDate <= toDate;
          }

          let matchesAmount = true;
          if (minAmount && rental.finalAmount) {
            matchesAmount =
              matchesAmount && rental.finalAmount >= parseFloat(minAmount);
          }
          if (maxAmount && rental.finalAmount) {
            matchesAmount =
              matchesAmount && rental.finalAmount <= parseFloat(maxAmount);
          }

          return matchesSearch && matchesStatus && matchesDate && matchesAmount;
        } catch (error) {
          console.error("Error filtering rental:", error, rental);
          return false;
        }
      });

      console.log("Filtering debug:", {
        totalRentals: rentals.length,
        filteredCount: filteredRentals.length,
        searchTerm,
        statusFilter,
        dateFrom,
        dateTo,
        minAmount,
        maxAmount,
        hasActiveFilters:
          searchTerm ||
          statusFilter !== "all" ||
          dateFrom ||
          dateTo ||
          minAmount ||
          maxAmount,
      });
    }
  }, [
    rentalsResponse,
    searchTerm,
    statusFilter,
    dateFrom,
    dateTo,
    minAmount,
    maxAmount,
  ]);

  // Don't render if not authenticated
  if (!isMounted || !isAuthenticated) {
    return null;
  }

  const rentals = rentalsResponse?.data || [];
  const totalItems = rentalsResponse?.count || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateRental = () => {
    router.push("/vehicles");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setMinAmount("");
    setMaxAmount("");
  };

  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "all" ||
    dateFrom ||
    dateTo ||
    minAmount ||
    maxAmount;

  const filteredRentals = rentals.filter((rental) => {
    try {
      const matchesSearch =
        searchTerm === "" ||
        (rental.carId?.name &&
          rental.carId.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rental.carId?.brand &&
          rental.carId.brand
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (rental.pickup?.branch?.name &&
          rental.pickup.branch.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (rental.pickup?.location &&
          rental.pickup.location
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (rental.status &&
          rental.status.toLowerCase() === statusFilter.toLowerCase());

      // Date range filtering
      let matchesDate = true;
      if (dateFrom && rental.startDate) {
        const startDate = new Date(rental.startDate);
        const fromDate = new Date(dateFrom);
        matchesDate = matchesDate && startDate >= fromDate;
      }
      if (dateTo && rental.startDate) {
        const startDate = new Date(rental.startDate);
        const toDate = new Date(dateTo);
        matchesDate = matchesDate && startDate <= toDate;
      }

      let matchesAmount = true;
      if (minAmount && rental.finalAmount) {
        matchesAmount =
          matchesAmount && rental.finalAmount >= parseFloat(minAmount);
      }
      if (maxAmount && rental.finalAmount) {
        matchesAmount =
          matchesAmount && rental.finalAmount <= parseFloat(maxAmount);
      }

      return matchesSearch && matchesStatus && matchesDate && matchesAmount;
    } catch (error) {
      console.error("Error filtering rental:", error, rental);
      return false;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <Loading
          variant="loading"
          title="Loading your rentals..."
          message="Please wait while we fetch your rental history."
          size="lg"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Error loading rentals
            </h3>
            <p className="text-red-500 mb-4">
              {error.message ||
                "Failed to load your rental history. Please try again later."}
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                My Rentals
              </h1>
              <p className="text-lg text-gray-600">
                Manage and track all your car rental bookings
              </p>
            </div>
            <Button
              onClick={handleCreateRental}
              className="bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Rent a Car
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search & Filter Rentals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search">Search Cars</Label>
                  <Input
                    id="search"
                    placeholder="Search by car name, brand, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="w-full"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {isFilterOpen ? "Hide" : "Show"} Advanced Filters
                  </Button>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* Advanced Filters */}
              {isFilterOpen && (
                <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Date Range</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="date"
                        placeholder="From"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                      <Input
                        type="date"
                        placeholder="To"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Amount Range</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="number"
                        placeholder="Min Amount"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max Amount"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredRentals?.length || 0} of {totalItems || 0} rental
              {(totalItems || 0) !== 1 ? "s" : ""}
            </p>
            {totalItems > 0 && (
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        </div>

        {filteredRentals && filteredRentals.length > 0 ? (
          <div className="space-y-6 mb-8">
            {filteredRentals.map((rental) => {
              try {
                return <RentalCard key={rental._id} rental={rental} />;
              } catch (error) {
                console.error("Error rendering rental card:", error, rental);
                return (
                  <Card
                    key={rental._id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="text-center text-red-500">
                        <p>Error rendering rental</p>
                        <p className="text-sm">
                          Please try refreshing the page
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {totalItems === 0
                ? "No rentals found"
                : "No rentals match your filters"}
            </h3>
            <p className="text-gray-500 mb-6">
              {totalItems === 0
                ? "You haven't made unknown car rentals yet. Start by browsing our available vehicles."
                : "Try adjusting your search criteria or clear some filters."}
            </p>
            {totalItems === 0 && (
              <Button
                onClick={handleCreateRental}
                className="bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Rent Your First Car
              </Button>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems || 0}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
    </div>
  );
};

export default RentalsPage;
