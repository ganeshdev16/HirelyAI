import { Figtree } from "next/font/google";
import React from "react";
const figtree = Figtree({ subsets: ["latin"] });

// Define the variant and size types
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

// Define the props interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
}

// Button component with variants
const CustomButton: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  ...props
}) => {
  // Base styles that apply to all buttons
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Variant styles with proper typing
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500",
    secondary:
      "bg-transparent text-white bg-transparent  hover:border border-white  focus:ring-gray-500",
    outline:
      "bg-transparent text-teal-500 border border-teal-500 hover:bg-teal-500 hover:text-white focus:ring-teal-500",
    ghost:
      "bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  // Size styles with proper typing
  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm rounded",
    md: "px-8 py-2 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl",
  };

  // Combine all styles
  const buttonClasses = `${baseStyles} ${figtree.className} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
export default CustomButton;
