"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Phone, MapPin, CreditCard, Calendar } from "lucide-react";

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  role: "user" | "admin";
  password: string;
  confirmPassword: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  driverLicense: {
    number: string;
    expiryDate: string;
    issuingCountry: string;
  };
  preferences: {
    preferredCarTypes: string[];
    preferredFuelType: string;
    maxDailyBudget: number;
  };
}

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserFormData) => void;
  title: string;
}

const carTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Truck", "Van"];
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
const countries = ["USA", "Canada", "UK", "Germunknown", "France", "Japan", "Australia", "Other"];

export default function UserForm({ isOpen, onClose, onSubmit, title }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    role: "user",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    driverLicense: {
      number: "",
      expiryDate: "",
      issuingCountry: "USA",
    },
    preferences: {
      preferredCarTypes: [],
      preferredFuelType: "Petrol",
      maxDailyBudget: 100,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      // Reset form when dialog closes
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        role: "user",
        password: "",
        confirmPassword: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "USA",
        },
        driverLicense: {
          number: "",
          expiryDate: "",
          issuingCountry: "USA",
        },
        preferences: {
          preferredCarTypes: [],
          preferredFuelType: "Petrol",
          maxDailyBudget: 100,
        },
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.address.street.trim()) newErrors.street = "Street address is required";
    if (!formData.address.city.trim()) newErrors.city = "City is required";
    if (!formData.address.state.trim()) newErrors.state = "State is required";
    if (!formData.address.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!formData.driverLicense.number.trim()) newErrors.licenseNumber = "Driver license number is required";
    if (!formData.driverLicense.expiryDate) newErrors.licenseExpiry = "License expiry date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleAddressChange = (field: keyof UserFormData['address'], value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleDriverLicenseChange = (field: keyof UserFormData['driverLicense'], value: string) => {
    setFormData(prev => ({
      ...prev,
      driverLicense: {
        ...prev.driverLicense,
        [field]: value,
      },
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handlePreferencesChange = (field: keyof UserFormData['preferences'], value: unknown) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const handleCarTypeToggle = (carType: string) => {
    const currentTypes = formData.preferences.preferredCarTypes;
    const newTypes = currentTypes.includes(carType)
      ? currentTypes.filter(type => type !== carType)
      : [...currentTypes, carType];
    
    handlePreferencesChange("preferredCarTypes", newTypes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
              </div>
              
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                  className={errors.street ? "border-red-500" : ""}
                />
                {errors.street && <p className="text-sm text-red-500 mt-1">{errors.street}</p>}
              </div>
              
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
              </div>
              
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  className={errors.state ? "border-red-500" : ""}
                />
                {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
              </div>
              
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                  className={errors.zipCode ? "border-red-500" : ""}
                />
                {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
              </div>
              
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formData.address.country}
                  onValueChange={(value) => handleAddressChange("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Driver License */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Driver License
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.driverLicense.number}
                  onChange={(e) => handleDriverLicenseChange("number", e.target.value)}
                  className={errors.licenseNumber ? "border-red-500" : ""}
                />
                {errors.licenseNumber && <p className="text-sm text-red-500 mt-1">{errors.licenseNumber}</p>}
              </div>
              
              <div>
                <Label htmlFor="licenseExpiry">Expiry Date *</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={formData.driverLicense.expiryDate}
                  onChange={(e) => handleDriverLicenseChange("expiryDate", e.target.value)}
                  className={errors.licenseExpiry ? "border-red-500" : ""}
                />
                {errors.licenseExpiry && <p className="text-sm text-red-500 mt-1">{errors.licenseExpiry}</p>}
              </div>
              
              <div>
                <Label htmlFor="issuingCountry">Issuing Country *</Label>
                <Select
                  value={formData.driverLicense.issuingCountry}
                  onValueChange={(value) => handleDriverLicenseChange("issuingCountry", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferences</h3>
            <div className="space-y-4">
              <div>
                <Label>Preferred Car Types</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {carTypes.map((carType) => (
                    <label key={carType} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.preferences.preferredCarTypes.includes(carType)}
                        onChange={() => handleCarTypeToggle(carType)}
                        className="rounded"
                      />
                      <span className="text-sm">{carType}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="fuelType">Preferred Fuel Type</Label>
                <Select
                  value={formData.preferences.preferredFuelType}
                  onValueChange={(value) => handlePreferencesChange("preferredFuelType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((fuelType) => (
                      <SelectItem key={fuelType} value={fuelType}>{fuelType}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="maxBudget">Max Daily Budget ($)</Label>
                <Input
                  id="maxBudget"
                  type="number"
                  min="0"
                  step="10"
                  value={formData.preferences.maxDailyBudget}
                  onChange={(e) => handlePreferencesChange("maxDailyBudget", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#FF9E0C] hover:bg-[#FF9E0C]">
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
