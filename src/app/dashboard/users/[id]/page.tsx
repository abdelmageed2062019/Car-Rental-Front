"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  Car,
  Edit,
  Shield,
  UserCheck,
  UserX,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useUserById, useUpdateUserStatus, useUpdateUserRole, useDeleteUser } from "@/hooks/useUsers";
import DeleteConfirmDialog from "@/components/dashboard/DeleteConfirmDialog";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch user data
  const { data: userResponse, isLoading, error, refetch } = useUserById(userId);
  const user = userResponse?.data;

  // Mutations
  const updateStatusMutation = useUpdateUserStatus();
  const updateRoleMutation = useUpdateUserRole();
  const deleteUserMutation = useDeleteUser();

  const handleStatusUpdate = async (isActive: boolean) => {
    if (!user) return;
    
    try {
      await updateStatusMutation.mutateAsync({ userId: user._id, isActive });
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const handleRoleUpdate = async (role: "user" | "admin") => {
    if (!user) return;
    
    try {
      await updateRoleMutation.mutateAsync({ userId: user._id, role });
      toast.success(`User role updated to ${role} successfully`);
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    
    try {
      await deleteUserMutation.mutateAsync(user._id);
      toast.success("User deleted successfully");
      router.push("/dashboard/users");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9E0C]"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/users")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Button>
        </div>
        <div className="text-center py-16">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            User not found
          </h3>
          <p className="text-red-500 mb-4">
            The user you're looking for doesn't exist or has been deleted.
          </p>
          <Button 
            onClick={() => router.push("/dashboard/users")}
            className="bg-[#FF9E0C] hover:bg-[#FF9E0C] text-white"
          >
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/users")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">User Details & Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleStatusUpdate(!user.isActive)}
            className={user.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
          >
            {user.isActive ? <UserX className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
            {user.isActive ? "Deactivate" : "Activate"}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleRoleUpdate(user.role === "admin" ? "user" : "admin")}
            className="text-blue-600 hover:text-blue-700"
          >
            <Shield className="w-4 h-4 mr-2" />
            Make {user.role === "admin" ? "User" : "Admin"}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-24 h-24 bg-[#FF9E0C] rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-500">{user.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant={user.role === "admin" ? "destructive" : "outline"}>
                    {user.role}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{user.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Age: {user.age}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Joined: {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">First Name</label>
                  <p className="text-sm">{user.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Name</label>
                  <p className="text-sm">{user.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm">{user.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-sm">{formatDate(user.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Verified</label>
                  <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                    {user.isEmailVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">{user.address.street}</p>
                <p className="text-sm">
                  {user.address.city}, {user.address.state} {user.address.zipCode}
                </p>
                <p className="text-sm">{user.address.country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Driver License */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Driver License
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">License Number</label>
                  <p className="text-sm">{user.driverLicense.number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                  <p className="text-sm">{formatDate(user.driverLicense.expiryDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Issuing Country</label>
                  <p className="text-sm">{user.driverLicense.issuingCountry}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Preferred Car Types</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.preferences.preferredCarTypes.length > 0 ? (
                      user.preferences.preferredCarTypes.map((type, index) => (
                        <Badge key={index} variant="outline">{type}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No preferences set</span>
                    )}
                  </div>
                </div>
                {user.preferences.preferredFuelType && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Preferred Fuel Type</label>
                    <p className="text-sm">{user.preferences.preferredFuelType}</p>
                  </div>
                )}
                {user.preferences.maxDailyBudget && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Max Daily Budget</label>
                    <p className="text-sm">{formatCurrency(user.preferences.maxDailyBudget)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rental History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Rental History ({user.rentalHistory.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.rentalHistory.length > 0 ? (
                <div className="space-y-4">
                  {user.rentalHistory.map((rental) => (
                    <div key={rental._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{rental.carId.name}</h4>
                          <p className="text-sm text-gray-500">{rental.carId.brand}</p>
                        </div>
                        <Badge variant="outline">{rental.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-gray-500">Start:</span> {formatDate(rental.startDate)}
                        </div>
                        <div>
                          <span className="text-gray-500">End:</span> {formatDate(rental.endDate)}
                        </div>
                        <div>
                          <span className="text-gray-500">Total Cost:</span> {formatCurrency(rental.totalCost)}
                        </div>
                        <div>
                          <span className="text-gray-500">Rental ID:</span> {rental.rentalId._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No rental history found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone and will remove all user data including rental history."
        itemName={`${user.firstName} ${user.lastName} (${user.email})`}
      />
    </div>
  );
}
