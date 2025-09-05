import { Play } from "lucide-react";

const VideoPlayer = () => {
  const stats = [
    {
      number: "20k+",
      label: "Happy customers",
    },
    {
      number: "540+",
      label: "Count of cars",
    },
    {
      number: "25+",
      label: "Years of experience",
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 sm:space-y-16 lg:space-y-24">
          <div className="flex justify-center">
            <div className="relative w-full max-w-4xl">
              <div className="relative bg-gray-200 rounded-xl sm:rounded-2xl overflow-hidden aspect-video">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <button className="w-16 h-16 sm:w-20 sm:h-20 bg-[#5937E0] rounded-full flex items-center justify-center shadow-lg hover:bg-[#4A2EC8] transition-colors duration-200 group">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1 group-hover:scale-110 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-32">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[#5937E0] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoPlayer;
