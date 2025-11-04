import {
  Sprout,
  Disc3,
  ShoppingBag,
  HardHat,
  Building2,
  GraduationCap,
  DollarSign,
  Bus,
} from "lucide-react";
import { Figtree } from "next/font/google";
import Link from "next/link";

const figtree = Figtree({ subsets: ["latin"] });
export default function JobCategory() {
  const categories = [
    {
      icon: Sprout,
      title: "Agriculture",
      jobs: "1254 jobs",
    },
    {
      icon: Disc3,
      title: "Metal Production",
      jobs: "816 jobs",
    },
    {
      icon: ShoppingBag,
      title: "Commerce",
      jobs: "2082 obs",
    },
    {
      icon: HardHat,
      title: "Construction",
      jobs: "1520 jobs",
    },
    {
      icon: Building2,
      title: "Hotels & Tourism",
      jobs: "1022 jobs",
    },
    {
      icon: GraduationCap,
      title: "Education",
      jobs: "1496 jobs",
    },
    {
      icon: DollarSign,
      title: "Financial Services",
      jobs: "1529 jobs",
    },
    {
      icon: Bus,
      title: "Transport",
      jobs: "1244 jobs",
    },
  ];

  return (
    <div className="min-h-screen  bg-[#309689]  py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`${figtree.className}  text-4xl font-bold text-white font- mb-4`}
          >
            Browse by Category
          </h1>
          <p className={`${figtree.className} text-white max-w-2xl mx-auto`}>
            At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
            Blandit a massa elementum id scel...
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link key={index} href={`/category/${category.title}`}>
                <div
                  key={index}
                  className={` ${figtree.className} bg-white rounded-2xl p-8 text-center hover:shadow-lg  justify-center  items-center flex flex-col transition-shadow duration-300 cursor-pointer group`}
                >
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <IconComponent
                      size={40}
                      className="text-teal-600 group-hover:text-teal-700 transition-colors"
                    />
                  </div>
                  <h3 className="text-xl  font-semibold text-gray-900 mb-4">
                    {category.title}
                  </h3>
                  <p className="w-22 text-[#309689]  bg-[#309689]/10 rounded-full font-medium">
                    {category.jobs}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
