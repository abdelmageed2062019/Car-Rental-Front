"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  FileText,
  Car,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Loading from "@/components/ui/loading";
import { useBranches } from "@/hooks/useBranches";
import { createRental, CreateRentalData } from "@/lib/crud/rentals";
import { toast } from "sonner";

const rentalSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  pickup: z.object({
    location: z.string().min(1, "Pickup location is required"),
    branch: z.string().min(1, "Pickup branch is required"),
    time: z.string().min(1, "Pickup time is required"),
  }),
  return: z.object({
    location: z.string().min(1, "Return location is required"),
    branch: z.string().min(1, "Return branch is required"),
    time: z.string().min(1, "Return time is required"),
  }),
  driverInfo: z.object({
    licenseNumber: z.string().min(1, "License number is required"),
    licenseExpiry: z.string().min(1, "License expiry is required"),
  }),
  carCondition: z.object({
    pickup: z.object({
      mileage: z.string().min(1, "Mileage is required"),
    }),
  }),
  specialRequests: z.string().optional(),
  payment: z.object({
    method: z.string().min(1, "Payment method is required"),
  }),
});

type RentalFormData = z.infer<typeof rentalSchema>;

interface RentalFormProps {
  carId: string;
  carName: string;
  carBrand: string;
  pricePerDay: number;
  onClose: () => void;
}

const RentalForm = ({
  carId,
  carName,
  carBrand,
  pricePerDay,
  onClose,
}: RentalFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;

  // Fetch branches data
  const { data: branchesResponse, isLoading: branchesLoading } = useBranches();
  const branches = branchesResponse?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema),
    mode: "onChange",
  });

  const watchedValues = watch();

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof RentalFormData)[] => {
    switch (step) {
      case 1:
        return ["startDate", "endDate"];
      case 2:
        return ["pickup", "return", "driverInfo"];
      case 3:
        return ["carCondition", "specialRequests", "payment"];
      default:
        return [];
    }
  };

  const onSubmit = async (data: RentalFormData) => {
    setIsSubmitting(true);

    try {
      const rentalData: CreateRentalData = {
        carId,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        pickup: {
          location: data.pickup.location,
          branch: data.pickup.branch,
          time: new Date(`${data.startDate}T${data.pickup.time}`).toISOString(),
        },
        return: {
          location: data.return.location,
          branch: data.return.branch,
          time: new Date(`${data.endDate}T${data.return.time}`).toISOString(),
        },
        driverInfo: {
          licenseNumber: data.driverInfo.licenseNumber,
          licenseExpiry: new Date(data.driverInfo.licenseExpiry).toISOString(),
        },
        carCondition: {
          pickup: {
            mileage: parseInt(data.carCondition.pickup.mileage),
          },
        },
        specialRequests: data.specialRequests || "",
        payment: {
          method: data.payment.method,
        },
      };

      console.log("Submitting rental:", rentalData);

      // Make actual API call to create rental
      const response = await createRental(rentalData);

      if (response.success) {
        console.log("Rental created successfully:", response.message);
        toast.success("Rental Created Successfully!", {
          description:
            response.message || "Your car rental has been confirmed.",
          duration: 5000,
        });
        onClose();
      } else {
        throw new Error(response.message || "Failed to create rental");
      }
    } catch (error: unknown) {
      console.error("Error submitting rental:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Please try again later.";

      // Check if it's an auth error
      if (
        errorMessage.includes("Authentication token not found") ||
        errorMessage.includes("Please log in again")
      ) {
        toast.error("Authentication Required", {
          description:
            "Please log in to create a rental. Redirecting to login...",
          duration: 5000,
          action: {
            label: "Login",
            onClick: () => {
              // You can add navigation to login page here if needed
              console.log("Redirect to login");
            },
          },
        });
      } else {
        toast.error("Rental Creation Failed", {
          description: errorMessage,
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <Loading
        variant="auth"
        title="Processing rental..."
        message="Please wait while we process your rental request."
        size="md"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-6">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : index + 1 === currentStep
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1 < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  index + 1 < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Dates */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Select Rental Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                  className={errors.startDate ? "border-red-500" : ""}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  className={errors.endDate ? "border-red-500" : ""}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Pickup, Return & Driver Details */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Pickup, Return & Driver Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Pickup</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupLocation">Location</Label>
                  <Select
                    onValueChange={(value) => {
                      const selectedBranch = branches.find(
                        (branch) => branch._id === value
                      );
                      setValue("pickup.location", selectedBranch?.name || "");
                      setValue("pickup.branch", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pickup location" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchesLoading ? (
                        <SelectItem value="" disabled>
                          Loading branches...
                        </SelectItem>
                      ) : (
                        branches.map((branch) => (
                          <SelectItem key={branch._id} value={branch._id}>
                            {branch.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.pickup?.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pickup.location.message}
                    </p>
                  )}
                  {errors.pickup?.branch && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pickup.branch.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="pickupTime">Time</Label>
                  <Input
                    id="pickupTime"
                    type="time"
                    {...register("pickup.time")}
                    className={errors.pickup?.time ? "border-red-500" : ""}
                  />
                  {errors.pickup?.time && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pickup.time.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Return</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="returnLocation">Location</Label>
                  <Select
                    onValueChange={(value) => {
                      const selectedBranch = branches.find(
                        (branch) => branch._id === value
                      );
                      setValue("return.location", selectedBranch?.name || "");
                      setValue("return.branch", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select return location" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchesLoading ? (
                        <SelectItem value="" disabled>
                          Loading branches...
                        </SelectItem>
                      ) : (
                        branches.map((branch) => (
                          <SelectItem key={branch._id} value={branch._id}>
                            {branch.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.return?.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.return.location.message}
                    </p>
                  )}
                  {errors.return?.branch && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.return.branch.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="returnTime">Time</Label>
                  <Input
                    id="returnTime"
                    type="time"
                    {...register("return.time")}
                    className={errors.return?.time ? "border-red-500" : ""}
                  />
                  {errors.return?.time && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.return.time.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Driver Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="Enter your license number"
                    {...register("driverInfo.licenseNumber")}
                    className={
                      errors.driverInfo?.licenseNumber ? "border-red-500" : ""
                    }
                  />
                  {errors.driverInfo?.licenseNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.driverInfo.licenseNumber.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                  <Input
                    id="licenseExpiry"
                    type="date"
                    {...register("driverInfo.licenseExpiry")}
                    className={
                      errors.driverInfo?.licenseExpiry ? "border-red-500" : ""
                    }
                  />
                  {errors.driverInfo?.licenseExpiry && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.driverInfo.licenseExpiry.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Car Condition, Requests & Payment - WITH FORM */}
      {currentStep === 3 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Car Condition, Requests & Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="mileage">Current Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="15000"
                  {...register("carCondition.pickup.mileage")}
                  className={
                    errors.carCondition?.pickup?.mileage ? "border-red-500" : ""
                  }
                />
                {errors.carCondition?.pickup?.mileage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.carCondition.pickup.mileage.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="specialRequests">
                  Special Requests (Optional)
                </Label>
                <Textarea
                  id="specialRequests"
                  placeholder="GPS preferred, child seat, etc."
                  {...register("specialRequests")}
                  rows={3}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="paymentMethod">Select Payment Method</Label>
                <Select
                  onValueChange={(value) => setValue("payment.method", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
                {errors.payment?.method && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.payment.method.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit and Cancel Buttons for Final Step */}
          <div className="flex justify-center gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-8 py-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-8 py-3"
            >
              <CheckCircle className="w-4 h-4" />
              Confirm Rental
            </Button>
          </div>
        </form>
      )}

      {/* Navigation Buttons for Steps 1 & 2 */}
      {currentStep < totalSteps && (
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default RentalForm;
