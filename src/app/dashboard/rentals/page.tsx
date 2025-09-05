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
  Calendar,
  Car,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  useAllRentals, 
  useUpdateRentalStatus, 
  useActivateRental,
  useCompleteRental, 
  useCancelRental, 
  useDeleteRental,
  useRentalStats 
} from "@/hooks/useRentals";
import { AdminRentalsParams } from "@/lib/crud/rentals";
import DeleteConfirmDialog from "@/components/dashboard/DeleteConfirmDialog";

export default function DashboardRentals() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<unknown>(null);

  // Build query parameters
  const queryParams: AdminRentalsParams = {
    page: currentPage,
    limit: pageSize,
    sortBy,
    sortOrder,
  };

  if (statusFilter !== "all") {
    queryParams.status = statusFilter;
  }

  // Fetch rentals data
  const {
    data: rentalsResponse,
    isLoading,
    error,
    refetch,
  } = useAllRentals(queryParams);

  // Fetch rental stats
  const { data: statsResponse } = useRentalStats();

  // Mutations
  const updateStatusMutation = useUpdateRentalStatus();
  const activateRentalMutation = useActivateRental();
  const completeRentalMutation = useCompleteRental();
  const cancelRentalMutation = useCancelRental();
  const deleteRentalMutation = useDeleteRental();

  const rentals = rentalsResponse?.data || [];
  const totalPages = rentalsResponse?.totalPages || 1;
  const totalCount = rentalsResponse?.count || 0;
  const stats = statsResponse?.data;

  // Handle search (client-side filtering for now)
  const filteredRentals = rentals.filter((rental) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      rental.userId?.firstName?.toLowerCase().includes(searchLower) ||
      rental.userId?.lastName?.toLowerCase().includes(searchLower) ||
      rental.userId?.email?.toLowerCase().includes(searchLower) ||
      rental.carId?.name?.toLowerCase().includes(searchLower) ||
      rental.carId?.brand?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "overdue":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (rentalId: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        rentalId,
        status: newStatus,
      });
      toast.success(`Rental status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update rental status");
    }
  };

  const handleActivateRental = async (rentalId: string) => {
    try {
      await activateRentalMutation.mutateAsync(rentalId);
      toast.success("Rental activated successfully");
    } catch (error) {
      toast.error("Failed to activate rental");
    }
  };

  const handleCompleteRental = async (rentalId: string) => {
    try {
      await completeRentalMutation.mutateAsync({ rentalId });
      toast.success("Rental completed successfully");
    } catch (error) {
      toast.error("Failed to complete rental");
    }
  };

  const handleCancelRental = async (rentalId: string) => {
    try {
      await cancelRentalMutation.mutateAsync({ 
        rentalId, 
        reason: "Cancelled by admin" 
      });
      toast.success("Rental cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel rental");
    }
  };

  const handleDeleteRental = async () => {
    if (!selectedRental) return;
    
    try {
      await deleteRentalMutation.mutateAsync(selectedRental._id);
      toast.success("Rental deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedRental(null);
    } catch (error) {
      toast.error("Failed to delete rental");
    }
  };

  const openDeleteDialog = (rental: unknown) => {
    setSelectedRental(rental);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

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
              Rental Management
            </h1>
            <p className="text-gray-600">
              Manage and track all car rental bookings
            </p>
          </div>
        </div>
        <div className="text-center py-16">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Error loading rentals
          </h3>
          <p className="text-red-500 mb-4">
            Failed to load rental data. Please try again later.
          </p>
          <Button 
            onClick={() => refetch()}
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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Rental Management
          </h1>
          <p className="text-gray-600">
            Manage and track all car rental bookings
          </p>
        </div>
        <Button
          onClick={() => router.push("/rentals")}
          className="bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Rental
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rentals</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All time rentals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
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
                {formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                All time revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Rentals</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by customer, car, or brand..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="startDate">Start Date</SelectItem>
                  <SelectItem value="endDate">End Date</SelectItem>
                  <SelectItem value="totalPrice">Total Price</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex-1"
              >
                {sortOrder === "asc" ? "↑" : "↓"} {sortOrder === "asc" ? "Asc" : "Desc"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className="flex-1"
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rentals Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Rentals ({totalCount})
            <span className="text-sm font-normal text-gray-500 ml-2">
              Page {currentPage} of {totalPages}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Car</th>
                  <th className="text-left py-3 px-4">Dates</th>
                  <th className="text-left py-3 px-4">Locations</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRentals.map((rental) => (
                  <tr key={rental._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">
                          {rental.userId?.firstName} {rental.userId?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {rental.userId?.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{rental.carId?.name}</p>
                        <p className="text-sm text-gray-500">
                          {rental.carId?.brand}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm">{formatDate(rental.startDate)}</p>
                        <p className="text-sm text-gray-500">
                          to {formatDate(rental.endDate)}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm">
                          Pickup: {rental.pickup?.branch?.name || rental.pickup?.location}
                        </p>
                        <p className="text-sm text-gray-500">
                          Return: {rental.return?.branch?.name || rental.return?.location}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium">{formatCurrency(rental.totalPrice)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          rental.status
                        )}`}
                      >
                        {rental.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/dashboard/rentals/${rental._id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {rental.status === "active" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCompleteRental(rental._id)}
                            className="text-green-600 hover:text-green-700"
                            title="Complete Rental"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {rental.status === "pending" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleActivateRental(rental._id)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Activate Rental"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {(rental.status === "pending" || rental.status === "active") && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCancelRental(rental._id)}
                            className="text-orange-600 hover:text-orange-700"
                            title="Cancel Rental"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(rental)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete Rental"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRentals.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No rentals found matching your criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-2">
                <Label htmlFor="pageSize">Show:</Label>
                <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-500">per page</span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteRental}
        title="Delete Rental"
        description="Are you sure you want to delete this rental? This action cannot be undone."
        itemName={selectedRental ? `${selectedRental.userId?.firstName} ${selectedRental.userId?.lastName} - ${selectedRental.carId?.name}` : ""}
      />
    </div>
  );
}
