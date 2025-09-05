const AboutText = () => {
  const features = [
    {
      title: "Variety Brands",
      description:
        "Platea non auctor fermentum sollicitudin. Eget adipiscing augue sit quam natoque ornare cursus viverra odio",
    },
    {
      title: "Awesome Support",
      description:
        "Diam quam gravida ultricies velit duis consequat integer. Est aliquam posuere vel rhoncus massa volutpat in",
    },
    {
      title: "Maximum Freedom",
      description:
        "Vitae pretium nulla sed quam id nisl semper. Vel non in proin egestas dis.faucibus rhoncus. Iaculis dignissim aenean pellentesque nisl",
    },
    {
      title: "Flexibility on the go",
      description:
        "Eget adipiscing augue sit quam natoque ornare cursus viverra odio. Diam quam gravida ultricies velit",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Where every drive feels extraordinary
            </h2>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutText;
