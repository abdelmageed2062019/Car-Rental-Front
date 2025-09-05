"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { BranchData } from "@/lib/crud/branches";
import { MapPin, Building2 } from "lucide-react";

interface BranchFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (branchData: BranchData) => void;
  branch?: unknown;
  title: string;
}

export default function BranchForm({ isOpen, onClose, onSubmit, branch, title }: BranchFormProps) {
  const [formData, setFormData] = useState<BranchData>({
    name: "",
    address: "",
    city: "",
    country: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name || "",
        address: branch.address || "",
        city: branch.city || "",
        country: branch.country || "",
        location: branch.location || {
          type: "Point",
          coordinates: [0, 0],
        },
      });
    } else {
      setFormData({
        name: "",
        address: "",
        city: "",
        country: "",
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
      });
    }
  }, [branch, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleInputChange = (field: keyof BranchData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (field: 'longitude' | 'latitude', value: number) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: field === 'longitude' 
          ? [value, prev.location.coordinates[1]]
          : [prev.location.coordinates[0], value]
      },
    }));
  };

  // Predefined coordinates for major cities
  const cityCoordinates: { [key: string]: [number, number] } = {
    "New York": [-74.0059, 40.7128],
    "Los Angeles": [-118.2437, 34.0522],
    "London": [-0.1276, 51.5074],
    "Paris": [2.3522, 48.8566],
    "Tokyo": [139.6917, 35.6895],
    "Dubai": [55.2708, 25.1972],
    "Cairo": [31.2357, 30.0444],
    "Miami": [-80.1918, 25.7617],
    "Chicago": [-87.6298, 41.8781],
    "Toronto": [-79.3832, 43.6532],
  };

  const handleCityChange = (city: string) => {
    setFormData(prev => ({
      ...prev,
      city,
      location: {
        ...prev.location,
        coordinates: cityCoordinates[city] || [0, 0]
      },
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Branch Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                placeholder="e.g., Downtown Branch"
              />
            </div>
            
            <div>
              <Label htmlFor="city">City *</Label>
              <Select
                value={formData.city}
                onValueChange={handleCityChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(cityCoordinates).map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="country">Country *</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleInputChange("country", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="Japan">Japan</SelectItem>
                  <SelectItem value="UAE">UAE</SelectItem>
                  <SelectItem value="Egypt">Egypt</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Germunknown">Germunknown</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Brazil">Brazil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
              placeholder="e.g., 456 Main Street, Suite 100"
            />
          </div>

          {/* Location Coordinates */}
          <div>
            <Label className="text-base font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location Coordinates
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="unknown"
                  value={formData.location.coordinates[0]}
                  onChange={(e) => handleLocationChange("longitude", parseFloat(e.target.value))}
                  placeholder="e.g., -74.0059"
                />
              </div>
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="unknown"
                  value={formData.location.coordinates[1]}
                  onChange={(e) => handleLocationChange("latitude", parseFloat(e.target.value))}
                  placeholder="e.g., 40.7128"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Coordinates will be auto-filled when you select a city, or you can enter them manually.
            </p>
          </div>

          {/* Preview */}
          {formData.location.coordinates[0] !== 0 && formData.location.coordinates[1] !== 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Location Preview</h4>
              <p className="text-sm text-gray-600">
                <strong>Address:</strong> {formData.address}, {formData.city}, {formData.country}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Coordinates:</strong> {formData.location.coordinates[0]}, {formData.location.coordinates[1]}
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#FF9E0C] hover:bg-[#FF9E0C]">
              {isLoading ? "Saving..." : branch ? "Update Branch" : "Add Branch"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
