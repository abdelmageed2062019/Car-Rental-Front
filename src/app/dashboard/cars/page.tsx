"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Car,
  Fuel,
  Users,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { fetchCars, createCar, updateCar, deleteCar, CarData } from "@/lib/crud/cars";
import { useCars } from "@/hooks/useCars";
import CarForm from "@/components/dashboard/CarForm";
import DeleteConfirmDialog from "@/components/dashboard/DeleteConfirmDialog";

interface Car extends CarData {
  id: string;
  name?: string;
  pricePerDay?: number;
  status?: string;
  isAvailable?: string;
  fuelType?: string;
  transmission?: string;
  mileage?: number;
  location?: string;
}

export default function DashboardCars() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: carsResponse,
    isLoading,
    error,
    refetch: refetchCars,
  } = useCars();

  const cars: Car[] = carsResponse?.data?.map((car: any) => ({
    id: car._id || car.id,
    brand: car.brand,
    year: car.year,
    price: car.pricePerDay || car.price,
    pricePerDay: car.pricePerDay || car.price,
    gearBox: car.technicalSpecs?.gearBox || car.gearBox,
    fuel: car.technicalSpecs?.fuel || car.fuel,
    fuelType: car.technicalSpecs?.fuel || car.fuel,
    transmission: car.technicalSpecs?.gearBox || car.gearBox,
    seats: car.technicalSpecs?.seats || car.seats || 5,
    image: car.images && car.images.length > 0 && process.env.NEXT_PUBLIC_API_BASE_URL
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${car.images[0]}`
      : car.image || "/car.png",
    description: car.description,
    available: car.isAvailable !== undefined ? car.isAvailable : true,
    status: car.isAvailable !== undefined 
      ? (car.isAvailable ? "available" : "unavailable")
      : "available",
    name: car.name || `${car.brand} ${car.model}`,
    mileage: car.mileage || Math.floor(Math.random() * 50000) + 1000,
    location: car.location || "Main Branch",
  })) || [];

  const handleCreateCar = async (carData: CarData) => {
    try {
      await createCar(carData);
      toast.success("Car created successfully");
      refetchCars(); 
    } catch (error) {
      console.error("Error creating car:", error);
      toast.error("Failed to create car");
    }
  };

  const handleUpdateCar = async (carData: CarData) => {
    if (!selectedCar?.id) return;
    
    try {
      await updateCar(selectedCar.id, carData);
      toast.success("Car updated successfully");
      refetchCars(); 
    } catch (error) {
      console.error("Error updating car:", error);
      toast.error("Failed to update car");
    }
  };

  const handleDeleteCar = async () => {
    if (!selectedCar?.id) return;
    
    try {
      await deleteCar(selectedCar.id);
      toast.success("Car deleted successfully");
      refetchCars(); 
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error("Failed to delete car");
    }
  };

  const openAddForm = () => {
    setSelectedCar(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const openEditForm = (car: Car) => {
    setSelectedCar(car);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (car: Car) => {
    setSelectedCar(car);
    setIsDeleteDialogOpen(true);
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      searchTerm === "" ||
      car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) 

    const matchesStatus = statusFilter === "all" || car.status === statusFilter;
    const matchesBrand =
      brandFilter === "all" ||
      car.brand.toLowerCase() === brandFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesBrand;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "rented":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_service":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const brands = Array.from(new Set(cars.map((car) => car.brand)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9E0C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Car Fleet Management
            </h1>
            <p className="text-gray-600">Manage your car rental fleet</p>
          </div>
        </div>
        <div className="text-center py-16">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Error loading cars
          </h3>
          <p className="text-red-500 mb-4">
            Failed to load car listings. Please try again later.
          </p>
          <Button 
            onClick={() => refetchCars()}
            className="bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Car Fleet Management
          </h1>
          <p className="text-gray-600">Manage your car rental fleet</p>
        </div>
        <Button
          onClick={openAddForm}
          className="bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Car
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Cars</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, brand, or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out_of_service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand.toLowerCase()}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setBrandFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <Card key={car.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{car.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {car.brand} 
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    car.status
                  )}`}
                >
                  {car.status}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>${car.pricePerDay}/day</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-gray-500" />
                  <span>{car.fuelType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{car.seats} seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{car.mileage.toLocaleString()} mi</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Location:</strong> {car.location}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Transmission:</strong> {car.transmission}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => router.push(`/vehicles/${car.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openEditForm(car)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => openDeleteDialog(car)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No cars found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Car Form Modal */}
      <CarForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={isEditing ? handleUpdateCar : handleCreateCar}
        car={selectedCar}
        title={isEditing ? "Edit Car" : "Add New Car"}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteCar}
        title="Delete Car"
        description="Are you sure you want to delete this car? This action cannot be undone."
        itemName={selectedCar?.name}
      />
    </div>
  );
}
