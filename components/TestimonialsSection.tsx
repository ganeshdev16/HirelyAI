import { Figtree } from "next/font/google";
import { Star, Quote } from "lucide-react";

const figtree = Figtree({ subsets: ["latin"] });

export default function TestimonialsSection() {
  const testimonials = [
    {
      title: "Amazing services",
      content:
        "Metus faucibus sed turpis lectus feugiat tincidunt. Rhoncus sed tristique in dolor. Mus etiam et vestibulum venenatis",
      author: "Marco Kihn",
      role: "Happy Client",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      title: "Everything simple",
      content:
        "Mus etiam et vestibulum venenatis viverra ut. Elit morbi bibendum ullamcorper augue faucibus",
      author: "Kristin Hester",
      role: "Happy Client",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      title: "Awesome, thank you!",
      content:
        "Rhoncus sed tristique in dolor. Mus etiam et vestibulum venenatis viverra ut. Elit morbi bibendum ullamcorper augue faucibus. Nulla et tempor montes",
      author: "Zion Cisneros",
      role: "Happy Client",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
  ];

  return (
    <div className={`bg-gray-100 py-16 px-4 ${figtree.className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Testimonials from Our Customers
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
            Blandit a massa elementum id...
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm relative"
            >
              {/* Stars */}
              <div className="flex space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {testimonial.title}
              </h3>

              {/* Content */}
              <p className="text-gray-600 italic text-lg leading-relaxed mb-8">
                {testimonial.content}
              </p>

              {/* Quote Icon */}
              <div className="absolute bottom-8 right-8">
                <Quote className="w-12 h-12 text-teal-600 fill-current" />
              </div>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
