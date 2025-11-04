import { Figtree } from "next/font/google";
import { Briefcase } from "lucide-react";

const figtree = Figtree({ subsets: ["latin"] });

export default function Footer() {
  const companyLinks = [
    "About Us",
    "Our Team",
    "Partners",
    "For Candidates",
    "For Employers",
  ];

  const jobCategories = [
    "Telecomunications",
    "Hotels & Tourism",
    "Construction",
    "Education",
    "Financial Services",
  ];

  return (
    <footer className={`bg-black text-white py-16 px-4 ${figtree.className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Job</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Quis enim pellentesque viverra tellus eget malesuada facilisis.
              Congue nibh vivamus aliquet nunc mauris d...
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Company</h3>
            <ul className="space-y-4">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">
              Job Categories
            </h3>
            <ul className="space-y-4">
              {jobCategories.map((category, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-6">
              Eu nunc pretium vitae platea. Non netus elementum vulputate
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-600 transition-colors"
              />
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors">
                Subscribe now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-500 text-sm">
            © Copyright Job Portal 2024. Designed by Figma.guru
          </div>
          <div className="flex space-x-8">
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors text-sm underline"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors text-sm underline"
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
