"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch } from "react-redux";
import { useUpdateUserProfile } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, MapPin, CreditCard, Car, Save, X } from "lucide-react";
import { toast } from "sonner";
import { User as UserType, ProfileUpdateData } from "@/lib/api/users";
import { updateUserSuccess } from "@/store/authSlice";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  profileImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
  driverLicense: z.object({
    number: z.string().optional(),
    expiryDate: z.string().optional(),
    issuingCountry: z.string().optional(),
  }).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  preferences: z.object({
    preferredCarTypes: z.array(z.string()).optional(),
    preferredFuelType: z.string().optional(),
    maxDailyBudget: z.number().min(0).optional(),
  }).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: UserType;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const updateProfileMutation = useUpdateUserProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
      profileImage: user.profileImage || "",
      driverLicense: {
        number: user.driverLicense?.number || "",
        expiryDate: user.driverLicense?.expiryDate ? new Date(user.driverLicense.expiryDate).toISOString().split('T')[0] : "",
        issuingCountry: user.driverLicense?.issuingCountry || "",
      },
      address: {
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zipCode || "",
        country: user.address?.country || "",
      },
      preferences: {
        preferredCarTypes: user.preferences?.preferredCarTypes || [],
        preferredFuelType: user.preferences?.preferredFuelType || "",
        maxDailyBudget: user.preferences?.maxDailyBudget || 0,
      },
    },
  });

  const watchedPreferences = watch("preferences");

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const updateData: ProfileUpdateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
        profileImage: data.profileImage || undefined,
        driverLicense: data.driverLicense?.number ? {
          number: data.driverLicense.number,
          expiryDate: data.driverLicense.expiryDate || undefined,
          issuingCountry: data.driverLicense.issuingCountry || undefined,
        } : undefined,
        address: data.address?.street ? {
          street: data.address.street,
          city: data.address.city || undefined,
          state: data.address.state || undefined,
          zipCode: data.address.zipCode || undefined,
          country: data.address.country || undefined,
        } : undefined,
        preferences: data.preferences?.preferredCarTypes?.length ? {
          preferredCarTypes: data.preferences.preferredCarTypes,
          preferredFuelType: data.preferences.preferredFuelType || undefined,
          maxDailyBudget: data.preferences.maxDailyBudget || undefined,
        } : undefined,
      };

      const result = await updateProfileMutation.mutateAsync(updateData);
      
      if (result.data) {
        dispatch(updateUserSuccess(result.data));
      }
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const addCarType = () => {
    const currentTypes = watchedPreferences?.preferredCarTypes || [];
    setValue("preferences.preferredCarTypes", [...currentTypes, ""]);
  };

  const removeCarType = (index: number) => {
    const currentTypes = watchedPreferences?.preferredCarTypes || [];
    const newTypes = currentTypes.filter((_, i) => i !== index);
    setValue("preferences.preferredCarTypes", newTypes);
  };

  const updateCarType = (index: number, value: string) => {
    const currentTypes = watchedPreferences?.preferredCarTypes || [];
    const newTypes = [...currentTypes];
    newTypes[index] = value;
    setValue("preferences.preferredCarTypes", newTypes);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Edit Profile</h3>
          <p className="text-sm text-gray-600">Update your personal information and preferences</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <User className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                    className={errors.dateOfBirth ? "border-red-500" : ""}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="profileImage">Profile Image URL</Label>
                  <Input
                    id="profileImage"
                    {...register("profileImage")}
                    className={errors.profileImage ? "border-red-500" : ""}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.profileImage && (
                    <p className="text-sm text-red-500 mt-1">{errors.profileImage.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address.street">Street Address</Label>
                <Input
                  id="address.street"
                  {...register("address.street")}
                  className={errors.address?.street ? "border-red-500" : ""}
                />
                {errors.address?.street && (
                  <p className="text-sm text-red-500 mt-1">{errors.address.street.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address.city">City</Label>
                  <Input
                    id="address.city"
                    {...register("address.city")}
                    className={errors.address?.city ? "border-red-500" : ""}
                  />
                  {errors.address?.city && (
                    <p className="text-sm text-red-500 mt-1">{errors.address.city.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="address.state">State</Label>
                  <Input
                    id="address.state"
                    {...register("address.state")}
                    className={errors.address?.state ? "border-red-500" : ""}
                  />
                  {errors.address?.state && (
                    <p className="text-sm text-red-500 mt-1">{errors.address.state.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address.zipCode">ZIP Code</Label>
                  <Input
                    id="address.zipCode"
                    {...register("address.zipCode")}
                    className={errors.address?.zipCode ? "border-red-500" : ""}
                  />
                  {errors.address?.zipCode && (
                    <p className="text-sm text-red-500 mt-1">{errors.address.zipCode.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="address.country">Country</Label>
                  <Input
                    id="address.country"
                    {...register("address.country")}
                    className={errors.address?.country ? "border-red-500" : ""}
                  />
                  {errors.address?.country && (
                    <p className="text-sm text-red-500 mt-1">{errors.address.country.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver License Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Driver License
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="driverLicense.number">License Number</Label>
                  <Input
                    id="driverLicense.number"
                    {...register("driverLicense.number")}
                    className={errors.driverLicense?.number ? "border-red-500" : ""}
                  />
                  {errors.driverLicense?.number && (
                    <p className="text-sm text-red-500 mt-1">{errors.driverLicense.number.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="driverLicense.expiryDate">Expiry Date</Label>
                  <Input
                    id="driverLicense.expiryDate"
                    type="date"
                    {...register("driverLicense.expiryDate")}
                    className={errors.driverLicense?.expiryDate ? "border-red-500" : ""}
                  />
                  {errors.driverLicense?.expiryDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.driverLicense.expiryDate.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="driverLicense.issuingCountry">Issuing Country</Label>
                  <Input
                    id="driverLicense.issuingCountry"
                    {...register("driverLicense.issuingCountry")}
                    className={errors.driverLicense?.issuingCountry ? "border-red-500" : ""}
                  />
                  {errors.driverLicense?.issuingCountry && (
                    <p className="text-sm text-red-500 mt-1">{errors.driverLicense.issuingCountry.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rental Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Rental Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Preferred Car Types</Label>
                <div className="space-y-2">
                  {watchedPreferences?.preferredCarTypes?.map((type, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={type}
                        onChange={(e) => updateCarType(index, e.target.value)}
                        placeholder="e.g., Sedan, SUV, Hatchback"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeCarType(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCarType}
                    className="w-full"
                  >
                    Add Car Type
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferences.preferredFuelType">Preferred Fuel Type</Label>
                  <Select
                    value={watchedPreferences?.preferredFuelType || ""}
                    onValueChange={(value) => setValue("preferences.preferredFuelType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preferences.maxDailyBudget">Max Daily Budget ($)</Label>
                  <Input
                    id="preferences.maxDailyBudget"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("preferences.maxDailyBudget", { valueAsNumber: true })}
                    className={errors.preferences?.maxDailyBudget ? "border-red-500" : ""}
                  />
                  {errors.preferences?.maxDailyBudget && (
                    <p className="text-sm text-red-500 mt-1">{errors.preferences.maxDailyBudget.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
