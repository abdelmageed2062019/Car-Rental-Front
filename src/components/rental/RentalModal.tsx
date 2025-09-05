"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  FileText,
  Car,
  CheckCircle,
} from "lucide-react";
import RentalForm from "./RentalForm";

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId: string;
  carName: string;
  carBrand: string;
  pricePerDay: number;
}

const RentalModal = ({
  isOpen,
  onClose,
  carId,
  carName,
  carBrand,
  pricePerDay,
}: RentalModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Rent {carBrand} {carName}
          </DialogTitle>
        </DialogHeader>

        <RentalForm
          carId={carId}
          carName={carName}
          carBrand={carBrand}
          pricePerDay={pricePerDay}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RentalModal;
