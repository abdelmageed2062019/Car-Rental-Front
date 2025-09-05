import Image from "next/image";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "How to choose the right car",
      category: "News",
      date: "12 April 2024",
      image: "/hero-img.png",
    },
    {
      id: 2,
      title: "Enjoy Speed, Choice & Total Control",
      category: "News",
      date: "12 April 2024",
      image: "/hero-img.png",
    },
    {
      id: 3,
      title: "Which plan is right for me?",
      category: "News",
      date: "12 April 2024",
      image: "/hero-img.png",
    },
  ];

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Latest blog posts & news
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-6">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500"></div>

                <h3 className="text-xl font-bold  transition-colors duration-200">
                  {post.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  <span className="font-medium ">{post.category}</span>
                  <span>/</span>
                  <span>{post.date}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
