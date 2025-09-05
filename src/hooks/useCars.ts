import { useQuery } from "@tanstack/react-query";
import { fetchCars, fetchCarById, fetchSimilarCars, searchCars } from "@/lib/crud/cars";

export interface CarSearchParams {
     brand?: string;
     gearBox?: string;
     fuel?: string;
     minPrice?: number;
     maxPrice?: number;
}

export interface TechnicalSpecs {
     gearBox: string;
     fuel: string;
     doors: number;
     airConditioner: boolean;
     seats: number;
     distance: string;
}

export interface Equipment {
     ABS: boolean;
     airBags: boolean;
     airConditioning: boolean;
     cruiseControl: boolean;
}

export interface Car {
     _id: string;
     name: string;
     brand: string;
     pricePerDay: number;
     isAvailable: boolean;
     images: string[];
     technicalSpecs: TechnicalSpecs;
     equipment: Equipment;
     __v: number;
}

export interface CarsResponse {
     success: boolean;
     count: number;
     data: Car[];
}

export interface CarResponse {
     success: boolean;
     data: Car;
}

export const useCars = () => {
     return useQuery<CarsResponse>({
          queryKey: ["cars"],
          queryFn: fetchCars,
     });
};

export const useCar = (id: string) => {
     return useQuery<CarResponse>({
          queryKey: ["cars", id],
          queryFn: () => fetchCarById(id),
          enabled: !!id,
     });
};

export const useSimilarCars = (id: string) => {
     return useQuery<CarsResponse>({
          queryKey: ["similarCars", id],
          queryFn: () => fetchSimilarCars(id),
          enabled: !!id,
     });
};

export const useSearchCars = (searchParams: CarSearchParams) => {
     return useQuery<CarsResponse>({
          queryKey: ["searchCars", searchParams],
          queryFn: () => searchCars(searchParams),
          enabled: Object.keys(searchParams).some(key => searchParams[key as keyof CarSearchParams] !== undefined),
     });
};
