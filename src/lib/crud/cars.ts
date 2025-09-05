import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

import type { CarsResponse, CarSearchParams } from "@/hooks/useCars";



export const fetchCars = async () => {
     try {
          console.log('Fetching cars from:', `${API_URL}/api/cars`);
          const { data } = await axios.get(`${API_URL}/api/cars`);
          console.log('Cars response:', data);
          return data;
     } catch (error) {
          console.error('Error fetching cars:', error);
          throw error;
     }
};

export const fetchCarById = async (id: string) => {
     try {
          console.log('Fetching car by ID from:', `${API_URL}/api/cars/${id}`);
          const { data } = await axios.get(`${API_URL}/api/cars/${id}`);
          console.log('Car by ID response:', data);
          return data;
     } catch (error) {
          console.error('Error fetching car by ID:', error);
          throw error;
     }
};

export const fetchSimilarCars = async (id: string) => {
     try {
          console.log('Fetching similar cars:', `${API_URL}/api/cars/${id}/similar`);
          const { data } = await axios.get(`${API_URL}/api/cars/${id}/similar`);
          console.log('Similar cars response:', data);
          return data;
     } catch (error) {
          console.error('Error fetching similar cars:', error);
          throw error;
     }
};



export const searchCars = async (searchParams: CarSearchParams): Promise<CarsResponse> => {
     try {
          const queryParams = new URLSearchParams();

          if (searchParams.brand) queryParams.append('brand', searchParams.brand);
          if (searchParams.gearBox) queryParams.append('gearBox', searchParams.gearBox);
          if (searchParams.fuel) queryParams.append('fuel', searchParams.fuel);
          if (searchParams.minPrice) queryParams.append('minPrice', searchParams.minPrice.toString());
          if (searchParams.maxPrice) queryParams.append('maxPrice', searchParams.maxPrice.toString());

          const url = `${API_URL}/api/cars/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
          console.log('Searching cars:', url);

          const { data } = await axios.get(url);
          console.log('Search response:', data);

          return data;
     } catch (error) {
          console.error('Error searching cars:', error);
          throw error;
     }
};

export interface CarData {
  name: string;
  brand: string;
  pricePerDay: number;
  technicalSpecs: {
    gearBox: string;
    fuel: string;
    doors: number;
    seats: number;
    airConditioner: boolean;
    distance: string;
  };
  equipment: {
    ABS: boolean;
    airBags: boolean;
    airConditioning: boolean;
    cruiseControl: boolean;
  };
  images?: File[];
  description?: string;
  isAvailable?: boolean;
}

export const createCar = async (carData: CarData) => {
  try {
    console.log('Creating car:', carData);
    
    const formData = new FormData();
    formData.append('name', carData.name);
    formData.append('brand', carData.brand);
    formData.append('pricePerDay', carData.pricePerDay.toString());
    formData.append('technicalSpecs', JSON.stringify(carData.technicalSpecs));
    formData.append('equipment', JSON.stringify(carData.equipment));
    
    if (carData.description) {
      formData.append('description', carData.description);
    }
    
    if (carData.isAvailable !== undefined) {
      formData.append('isAvailable', carData.isAvailable.toString());
    }
    
    if (carData.images && carData.images.length > 0) {
      carData.images.forEach((image, index) => {
        formData.append('images', image);
      });
    }
    
    const { data } = await axios.post(`${API_URL}/api/cars`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Car created:', data);
    return data;
  } catch (error) {
    console.error('Error creating car:', error);
    throw error;
  }
};

export const updateCar = async (id: string, carData: Partial<CarData>) => {
  try {
    console.log('Updating car:', id, carData);
    const { data } = await axios.put(`${API_URL}/api/cars/${id}`, carData);
    console.log('Car updated:', data);
    return data;
  } catch (error) {
    console.error('Error updating car:', error);
    throw error;
  }
};

export const deleteCar = async (id: string) => {
  try {
    console.log('Deleting car:', id);
    const { data } = await axios.delete(`${API_URL}/api/cars/${id}`);
    console.log('Car deleted:', data);
    return data;
  } catch (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
};
