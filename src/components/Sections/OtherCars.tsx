import { ArrowRight } from "lucide-react";
import CarCard from "../CarCard";
import { useSimilarCars } from "@/hooks/useCars";
import Loading from "@/components/ui/loading";

interface OtherCarsProps {
  currentCarId?: string;
}

const OtherCars = ({ currentCarId }: OtherCarsProps) => {
  const {
    data: similarCarsResponse,
    isLoading,
    error,
  } = useSimilarCars(currentCarId || "");
  const similarCars = Array.isArray(similarCarsResponse)
    ? similarCarsResponse
    : similarCarsResponse?.data || [];

  console.log("similarCarsResponse", similarCarsResponse);
  console.log("similarCars", similarCars);
  console.log("similarCars.length", similarCars.length);

  if (!currentCarId) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
            <div className="mb-6 sm:mb-0">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Similar cars
              </h2>
            </div>
          </div>
          <Loading
            variant="loading"
            title="Loading similar cars..."
            message="Please wait while we find cars similar to this one."
            size="sm"
          />
        </div>
      </section>
    );
  }

  if (similarCars.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <div className="mb-6 sm:mb-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Similar cars
            </h2>
          </div>

          <button className="flex items-center gap-2 font-semibold transition-colors duration-200 group">
            <span>View more</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarCars.map((car) => (
            <CarCard
              key={car._id}
              id={car._id}
              name={car.name}
              type={car.brand}
              image={
                car.images &&
                car.images.length > 0 &&
                process.env.NEXT_PUBLIC_API_BASE_URL
                  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${car.images[0]}`
                  : "/car.png"
              }
              price={car.pricePerDay}
              transmission={car.technicalSpecs.gearBox}
              fuelType={car.technicalSpecs.fuel}
              air={
                car.technicalSpecs.airConditioner ? "Air Conditioner" : "No AC"
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherCars;
