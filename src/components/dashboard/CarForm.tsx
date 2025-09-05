"use client";

import { useState, useEffect, useRef } from "react";
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
import { CarData } from "@/lib/crud/cars";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface CarFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (carData: CarData) => void;
  car?: unknown; // Updated to handle existing car data
  title: string;
}

export default function CarForm({ isOpen, onClose, onSubmit, car, title }: CarFormProps) {
  const [formData, setFormData] = useState<CarData>({
    name: "",
    brand: "",
    pricePerDay: 0,
    technicalSpecs: {
      gearBox: "Automatic",
      fuel: "Petrol",
      doors: 4,
      seats: 5,
      airConditioner: true,
      distance: "Unlimited",
    },
    equipment: {
      ABS: true,
      airBags: true,
      airConditioning: true,
      cruiseControl: true,
    },
    images: [],
    description: "",
    isAvailable: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name || "",
        brand: car.brand || "",
        pricePerDay: car.pricePerDay || car.price || 0,
        technicalSpecs: {
          gearBox: car.technicalSpecs?.gearBox || car.gearBox || "Automatic",
          fuel: car.technicalSpecs?.fuel || car.fuel || "Petrol",
          doors: car.technicalSpecs?.doors || 4,
          seats: car.technicalSpecs?.seats || car.seats || 5,
          airConditioner: car.technicalSpecs?.airConditioner || true,
          distance: car.technicalSpecs?.distance || "Unlimited",
        },
        equipment: {
          ABS: car.equipment?.ABS || true,
          airBags: car.equipment?.airBags || true,
          airConditioning: car.equipment?.airConditioning || true,
          cruiseControl: car.equipment?.cruiseControl || true,
        },
        images: [],
        description: car.description || "",
        isAvailable: car.isAvailable !== undefined ? car.isAvailable : true,
      });
    } else {
      setFormData({
        name: "",
        brand: "",
        pricePerDay: 0,
        technicalSpecs: {
          gearBox: "Automatic",
          fuel: "Petrol",
          doors: 4,
          seats: 5,
          airConditioner: true,
          distance: "Unlimited",
        },
        equipment: {
          ABS: true,
          airBags: true,
          airConditioning: true,
          cruiseControl: true,
        },
        images: [],
        description: "",
        isAvailable: true,
      });
    }
    setImagePreviews([]);
  }, [car, isOpen]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 3 - formData.images!.length);
      const updatedImages = [...(formData.images || []), ...newFiles];
      
      setFormData(prev => ({
        ...prev,
        images: updatedImages,
      }));

      // Create previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images!.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      images: updatedImages,
    }));
    setImagePreviews(updatedPreviews);
  };

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

  const handleInputChange = (field: keyof CarData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTechnicalSpecsChange = (field: keyof CarData['technicalSpecs'], value: unknown) => {
    setFormData(prev => ({
      ...prev,
      technicalSpecs: {
        ...prev.technicalSpecs,
        [field]: value,
      },
    }));
  };

  const handleEquipmentChange = (field: keyof CarData['equipment'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [field]: value,
      },
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Car Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                placeholder="e.g., Toyota Camry"
              />
            </div>
            
            <div>
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                required
                placeholder="e.g., Toyota"
              />
            </div>
            
            <div>
              <Label htmlFor="pricePerDay">Price per day ($) *</Label>
              <Input
                id="pricePerDay"
                type="number"
                value={formData.pricePerDay}
                onChange={(e) => handleInputChange("pricePerDay", parseFloat(e.target.value))}
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <Label htmlFor="gearBox">Transmission *</Label>
              <Select
                value={formData.technicalSpecs.gearBox}
                onValueChange={(value) => handleTechnicalSpecsChange("gearBox", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="fuel">Fuel Type *</Label>
              <Select
                value={formData.technicalSpecs.fuel}
                onValueChange={(value) => handleTechnicalSpecsChange("fuel", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="doors">Number of Doors *</Label>
              <Input
                id="doors"
                type="number"
                value={formData.technicalSpecs.doors}
                onChange={(e) => handleTechnicalSpecsChange("doors", parseInt(e.target.value))}
                required
                min="2"
                max="5"
              />
            </div>
            
            <div>
              <Label htmlFor="seats">Number of Seats *</Label>
              <Input
                id="seats"
                type="number"
                value={formData.technicalSpecs.seats}
                onChange={(e) => handleTechnicalSpecsChange("seats", parseInt(e.target.value))}
                required
                min="1"
                max="9"
              />
            </div>
            
            <div>
              <Label htmlFor="distance">Distance *</Label>
              <Select
                value={formData.technicalSpecs.distance}
                onValueChange={(value) => handleTechnicalSpecsChange("distance", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unlimited">Unlimited</SelectItem>
                  <SelectItem value="Limited">Limited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Equipment Section */}
          <div>
            <Label className="text-base font-semibold">Equipment</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="abs"
                  checked={formData.equipment.ABS}
                  onChange={(e) => handleEquipmentChange("ABS", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="abs" className="text-sm">ABS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="airBags"
                  checked={formData.equipment.airBags}
                  onChange={(e) => handleEquipmentChange("airBags", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="airBags" className="text-sm">Air Bags</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="airConditioning"
                  checked={formData.equipment.airConditioning}
                  onChange={(e) => handleEquipmentChange("airConditioning", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="airConditioning" className="text-sm">Air Conditioning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="cruiseControl"
                  checked={formData.equipment.cruiseControl}
                  onChange={(e) => handleEquipmentChange("cruiseControl", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="cruiseControl" className="text-sm">Cruise Control</Label>
              </div>
            </div>
          </div>

          {/* Air Conditioner */}
          <div>
            <Label className="text-base font-semibold">Air Conditioner</Label>
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                id="airConditioner"
                checked={formData.technicalSpecs.airConditioner}
                onChange={(e) => handleTechnicalSpecsChange("airConditioner", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="airConditioner" className="text-sm">Has Air Conditioner</Label>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <Label className="text-base font-semibold">Car Images (Max 3)</Label>
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={formData.images!.length >= 3}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Images ({formData.images!.length}/3)
              </Button>
              
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Car description..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="isAvailable">Status</Label>
            <Select
              value={formData.isAvailable ? "available" : "unavailable"}
              onValueChange={(value) => handleInputChange("isAvailable", value === "available")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#FF9E0C] hover:bg-[#FF9E0C]">
              {isLoading ? "Saving..." : car ? "Update Car" : "Add Car"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
