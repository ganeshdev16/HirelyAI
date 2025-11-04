"use client";
import { NAVMENU } from "@/constants/navbar";
import { BriefcaseBusiness, Menu, X } from "lucide-react";
import { Figtree } from "next/font/google";
import { useState } from "react";
import CustomButton from "./CustomButton";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { auth } from "@/firebaseConfig";

const figtree = Figtree({ subsets: ["latin"] });

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authState } = useAuth();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="h-[80px] px-4 sm:px-6 lg:px-10 flex justify-between items-center relative">
      {/* App icon */}
      <div className="flex justify-center items-center gap-2 sm:gap-4 z-20">
        <BriefcaseBusiness color="white" className="w-5 h-5 sm:w-6 sm:h-6" />
        <h2
          className={`text-[16px] sm:text-[20px] ${figtree.className} font-semibold text-white`}
        >
          <span className="hidden sm:inline">Career Connect</span>
          <span className="sm:hidden">CC</span>
        </h2>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex justify-between items-center gap-6">
        {NAVMENU.map((item) => (
          <div key={item.id}>
            <Link
              href={item.href}
              className={`${figtree.className} text-gray-400 hover:text-white transition-colors text-[16px] font-normal cursor-pointer`}
            >
              {item.name}
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden sm:flex gap-2 lg:gap-4 z-20">
        {!authState.isAuthenticated && (
          <>
            <Link href={"/sign-in"}>
              <CustomButton size="md" variant="secondary">
                <p className="text-sm lg:text-base">Login</p>
              </CustomButton>
            </Link>

            <Link href={"/sign-up"}>
              <CustomButton size="md" variant="primary">
                <p className="text-sm lg:text-base">Register</p>
              </CustomButton>
            </Link>
          </>
        )}
      </div>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="sm:hidden z-20 p-2 text-white"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-teal-600 transform transition-transform duration-300 ease-in-out z-20 sm:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-20 px-6">
          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-6 mb-8">
            {NAVMENU.map((item) => (
              <div key={item.id} onClick={toggleMenu}>
                <p
                  className={`${figtree.className} text-white hover:text-white transition-colors text-[16px] font-normal cursor-pointer`}
                >
                  {item.name}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile Auth Buttons */}
          {!authState.isAuthenticated && (
            <div className="flex flex-col gap-4">
              <Link href={"/sign-in"} onClick={toggleMenu}>
                <CustomButton size="md" variant="secondary" className="w-full">
                  <p>Login</p>
                </CustomButton>
              </Link>

              <Link href={"/sign-up"} onClick={toggleMenu}>
                <CustomButton size="md" variant="primary" className="w-full">
                  <p>Register</p>
                </CustomButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
