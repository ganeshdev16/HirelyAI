"use client";
import React, { useState } from "react";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  X,
  Menu,
  BriefcaseBusiness,
} from "lucide-react";
import { Figtree } from "next/font/google";
import Footer from "@/components/Footer";
import LogoStrip from "@/components/LogoStrip";
import NavBar from "@/components/NavBar";

const figtree = Figtree({ subsets: ["latin"] });

export default function BusinessLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Message sent successfully!");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className={`min-h-screen bg-white ${figtree.className}`}>
      {/* Header/Navigation - Black section */}
      <header className="bg-black text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex justify-center items-center gap-2 sm:gap-4 z-20">
            <BriefcaseBusiness
              color="white"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
            <h2
              className={`text-[16px] sm:text-[20px] font-semibold text-white`}
            >
              <span className="hidden sm:inline">Career Connect</span>
              <span className="sm:hidden">CC</span>
            </h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Home
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Services
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Contact
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              <a
                href="#"
                className="hover:text-gray-300 transition-colors py-2"
              >
                Home
              </a>
              <a
                href="#"
                className="hover:text-gray-300 transition-colors py-2"
              >
                About
              </a>
              <a
                href="#"
                className="hover:text-gray-300 transition-colors py-2"
              >
                Services
              </a>
              <a
                href="#"
                className="hover:text-gray-300 transition-colors py-2"
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                You Will Grow, You Will Succeed. We Promise That
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Pellentesque arcu facilisis nunc mi proin. Dignissim mattis in
                lectus tincidunt tincidunt ultrices. Diam convallis morbi
                pellentesque adipiscing
              </p>
            </div>

            {/* Contact Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Call for inquiry */}
              <div className="flex items-start space-x-3">
                <div className="bg-teal-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Call for inquiry
                  </h3>
                  <p className="text-gray-600">+257 388-6895</p>
                </div>
              </div>

              {/* Send us email */}
              <div className="flex items-start space-x-3">
                <div className="bg-teal-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Send us email
                  </h3>
                  <p className="text-gray-600">kramulous@sbcglobal.net</p>
                </div>
              </div>

              {/* Opening hours */}
              <div className="flex items-start space-x-3">
                <div className="bg-teal-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Opening hours
                  </h3>
                  <p className="text-gray-600">Mon - Fri: 10AM - 10PM</p>
                </div>
              </div>

              {/* Office */}
              <div className="flex items-start space-x-3">
                <div className="bg-teal-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                  <p className="text-gray-600">
                    19 North Road Piscataway, NY 08854
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Contact Form */}
          <div className="bg-gray-50 p-8 rounded-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Contact Info
              </h2>
              <p className="text-gray-600">
                Nibh dis faucibus proin lorem tristique
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Your last name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your E-mail address"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your message..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 transition-colors focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Map placeholder */}
          <div className="bg-gray-300 h-64 md:h-96 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Simple map visualization */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-blue-200 to-gray-300"></div>

            {/* Map landmarks */}
            <div className="absolute top-16 left-16 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Juniper Valley Park
            </div>

            <div className="absolute top-32 right-24 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Kew Gardens
            </div>

            <div className="absolute bottom-32 left-32 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Forest Park
            </div>

            {/* Main location marker */}
            <div className="relative z-10 bg-white p-4 rounded-lg shadow-xl border-2 border-teal-500">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-red-500" />
                <span className="font-bold text-gray-900">
                  Forest Hills Stadium
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Piscataway, NY 08854</p>
            </div>

            {/* Highway indicators */}
            <div className="absolute top-8 right-8 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
              495
            </div>
            <div className="absolute bottom-8 left-8 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
              25
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos Section */}
      <section>
        <LogoStrip />
      </section>

      <Footer />
    </div>
  );
}
