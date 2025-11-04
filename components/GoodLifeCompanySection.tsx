import { Figtree } from "next/font/google";

const figtree = Figtree({ subsets: ["latin"] });

export default function GoodLifeCompanySection() {
  const stats = [
    {
      number: "12k+",
      title: "Clients worldwide",
      description:
        "At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum...",
    },
    {
      number: "20k+",
      title: "Active resume",
      description:
        "At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum...",
    },
    {
      number: "18k+",
      title: "Companies",
      description:
        "At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum...",
    },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 py-16 px-4 ${figtree.className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Main Content Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Image */}
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700 rounded-3xl shadow-2xl relative overflow-hidden">
              {/* Blurred overlay effect */}
              <div className="absolute inset-4 bg-gradient-to-br from-gray-200/20 via-gray-400/30 to-gray-900/50 rounded-2xl backdrop-blur-md"></div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Good Life Begins With A Good Company
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Ultricies purus dolor viverra mi laoreet at cursus justo. Ultrices
              purus diam egestas amet faucibus tempor blandit. Elit velit mauris
              aliquam est diam. Leo sagittis consectetur diam morbi erat aenean.
              Vulputate praesent congue faucibus in euismod feugiat euismod
              volutpat...
            </p>
            <div className="flex items-center space-x-4 pt-4">
              <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Search Job
              </button>
              <button className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                Learn more
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-left">
              <div className="text-5xl font-bold text-teal-600 mb-4">
                {stat.number}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {stat.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
