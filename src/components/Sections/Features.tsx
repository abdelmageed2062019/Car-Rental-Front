import { Map, Wallet, Sofa } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Map className="w-10 h-10 " />,
      title: "Availability",
      description:
        "Diam tincidunt tincidunt erat at semper fermentum. Id ultricies quis.",
    },
    {
      icon: <Sofa className="w-10 h-10 " />,
      title: "Comfort",
      description:
        "Gravida auctor fermentum morbi vulputate ac egestas orci et convallis.",
    },
    {
      icon: <Wallet className="w-10 h-10 " />,
      title: "Savings",
      description:
        "Pretium convallis id diam sed commodo vestibulum lobortis volutpat.",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 rounded-xl  transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
