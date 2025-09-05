"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AUTH_ENDPOINTS } from "@/lib/api";
import Loading from "@/components/ui/loading";

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

export function RegisterForm({ onSwitchToLogin, onClose }: RegisterFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof RegisterFormData)[] => {
    switch (step) {
      case 1:
        return ["firstName", "lastName", "email"];
      case 2:
        return ["password", "confirmPassword", "phone"];
      case 3:
        return ["dateOfBirth", "driverLicense"];
      case 4:
        return ["address"];
      default:
        return [];
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    dispatch(registerStart());
    try {
      const res = await fetch(AUTH_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const json = await res.json();
        const userData = json.data || json.user;
        const token = json.token;

        if (userData && token) {
          dispatch(registerSuccess({ user: userData, token }));
          onClose();
        } else {
          dispatch(registerFailure("Invalid response format"));
        }
      } else {
        const err = await res.json();
        dispatch(
          registerFailure(err.error || err.message || "Registration failed")
        );
      }
    } catch {
      dispatch(registerFailure("Network error"));
    }
  };

  if (loading) {
    return (
      <Loading
        variant="auth"
        title="Creating account..."
        message="Please wait while we set up your account."
        size="md"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i + 1}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i + 1 === currentStep
                  ? "bg-[#5937E0] text-white"
                  : i + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {i + 1 < currentStep ? "✓" : i + 1}
            </div>
          ))}
        </div>
        <span className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div className="space-y-4">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">First Name</Label>
                <Input
                  placeholder="Enter your first name"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-2">Last Name</Label>
                <Input
                  placeholder="Enter your last name"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label className="mb-2">Email</Label>
              <Input
                type="email"
                placeholder="Enter your email address"
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Account Security
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-2">Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label className="mb-2">Phone</Label>
              <Input
                placeholder="Enter your phone number"
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Driver License Information
            </h3>
            <div>
              <Label className="mb-2">Date of Birth</Label>
              <Input
                type="date"
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
                {...register("dateOfBirth")}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">License Number</Label>
                <Input
                  placeholder="Enter license number"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register("driverLicense.number")}
                />
                {errors.driverLicense?.number && (
                  <p className="text-red-500 text-sm">
                    {errors.driverLicense.number.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-2">Expiry Date</Label>
                <Input
                  type="date"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register("driverLicense.expiryDate")}
                />
                {errors.driverLicense?.expiryDate && (
                  <p className="text-red-500 text-sm">
                    {errors.driverLicense.expiryDate.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label className="mb-2">Issuing Country</Label>
              <Input
                placeholder="Enter issuing country"
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
                {...register("driverLicense.issuingCountry")}
              />
              {errors.driverLicense?.issuingCountry && (
                <p className="text-red-500 text-sm">
                  {errors.driverLicense.issuingCountry.message}
                </p>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Address Information
              </h3>
              <div>
                <Label className="mb-2">Street Address</Label>
                <Input
                  placeholder="Enter street address"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register("address.street")}
                />
                {errors.address?.street && (
                  <p className="text-red-500 text-sm">
                    {errors.address.street.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">City</Label>
                  <Input
                    placeholder="Enter city"
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...register("address.city")}
                  />
                  {errors.address?.city && (
                    <p className="text-red-500 text-sm">
                      {errors.address.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-2">State</Label>
                  <Input
                    placeholder="Enter state"
                    className="focus-visible:ring-offset-0"
                    {...register("address.state")}
                  />
                  {errors.address?.state && (
                    <p className="text-red-500 text-sm">
                      {errors.address.state.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">ZIP Code</Label>
                  <Input
                    placeholder="Enter ZIP code"
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...register("address.zipCode")}
                  />
                  {errors.address?.zipCode && (
                    <p className="text-red-500 text-sm">
                      {errors.address.zipCode.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-2">Country</Label>
                  <Input
                    placeholder="Enter country"
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...register("address.country")}
                  />
                  {errors.address?.country && (
                    <p className="text-red-500 text-sm">
                      {errors.address.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="px-6"
              >
                Previous
              </Button>

              <Button type="submit" disabled={loading} className="px-6 ml-auto">
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
          </form>
        )}

        {currentStep < 4 && (
          <div className="flex justify-between pt-6">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="px-6"
              >
                Previous
              </Button>
            )}

            <Button type="button" onClick={nextStep} className="px-6 ml-auto">
              Next
            </Button>
          </div>
        )}

        <p className="text-sm text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
