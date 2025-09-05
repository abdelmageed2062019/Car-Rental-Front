import Image from "next/image";
import { Snowflake, Fuel, Cog } from "lucide-react";
import Link from "next/link";
interface CarCardProps {
  id: string;
  name: string;
  type: string;
  image: string;
  price: number;
  transmission: string;
  fuelType: string;
  air: string;
}

const CarCard = ({
  id,
  name,
  type,
  image,
  price,
  transmission,
  fuelType,
  air,
}: CarCardProps) => {
  return (
    <Link href={`/vehicles/${id}`} className="block group">
      <div className="transition-all duration-300 overflow-hidden cursor-pointer">
        <div className="relative overflow-hidden flex justify-center items-center h-[200px]">
          <Image
            src={image}
            alt={name}
            width={300}
            height={200}
            className="py-10 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-6">
          <div className="mb-4 flex justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-600">{type}</p>
            </div>

            <div className="text-end">
              <span className="text-[#5937E0] text-2xl font-bold">
                ${price}
              </span>
              <p>per day</p>
            </div>
          </div>

          <div className="flex  justify-between items-center mb-6 ">
            <div className="flex items-center  gap-2">
              <Cog />
              <span className="text-sm text-gray-600">{transmission}</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel />
              <span className="text-sm text-gray-600">{fuelType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Snowflake />
              <span className="text-sm text-gray-600">{air}</span>
            </div>
          </div>

          <button className="w-full bg-[#5937E0] text-white py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-[#4a2fd1] transform hover:scale-105 ">
            Rent Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
