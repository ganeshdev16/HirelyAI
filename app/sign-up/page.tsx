"use client";
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import { auth } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import Link from "next/link";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationScreen, setShowVerificationScreen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Send email verification
      await sendEmailVerification(userCredential.user);

      console.log("User created and verification email sent:", userCredential);

      // Show verification screen
      setVerificationEmail(formData.email);
      setShowVerificationScreen(true);
    } catch (error: any) {
      console.error("Error creating account:", error);

      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        setErrors({ email: "This email is already registered" });
      } else if (error.code === "auth/weak-password") {
        setErrors({ password: "Password is too weak" });
      } else {
        setErrors({ general: "An error occurred. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser) return;

    try {
      setIsLoading(true);
      await sendEmailVerification(auth.currentUser);
      alert("Verification email sent again!");
    } catch (error) {
      console.error("Error resending verification:", error);
      alert("Error sending verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Email Verification Screen
  if (showVerificationScreen) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-black text-white py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Verify Your Email
              </h1>
              <p className="text-lg text-gray-300">
                We've sent a verification link to your email
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-teal-600 text-center">
              {/* Mail Icon */}
              <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-teal-600" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Check Your Email
              </h2>

              <p className="text-gray-600 mb-4">
                We've sent a verification link to:
              </p>

              <p className="text-teal-600 font-medium mb-6 break-all">
                {verificationEmail}
              </p>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Next Steps:</strong>
                    <br />
                    1. Check your email inbox (and spam folder)
                    <br />
                    2. Click the verification link in the email
                    <br />
                    3. Return here and refresh to continue
                  </p>
                </div>

                <button
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Resend Verification Email"}
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  I've Verified My Email
                </button>

                <button
                  onClick={() => {
                    setShowVerificationScreen(false);
                    setFormData({
                      email: "",
                      password: "",
                      confirmPassword: "",
                    });
                    setErrors({});
                  }}
                  className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Back to Signup
                </button>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Email not received?</strong> Check your spam/junk
                  folder or try resending the verification email.
                </p>
                <p>
                  <strong>Wrong email?</strong> Go back and create a new account
                  with the correct email address.
                </p>
                <p>
                  <strong>Still having issues?</strong> Contact our support team
                  for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original Signup Screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Create Your Account
            </h1>
            <p className="text-lg text-gray-300">
              Join our platform and start your journey
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Signup Form */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-teal-600">
            <div className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="john.doe@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-teal-600 hover:text-teal-700 underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-teal-600 hover:text-teal-700 underline"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-teal-600 hover:text-teal-700 font-medium underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Why Join Our Platform?
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-teal-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Access thousands of job opportunities
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-teal-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Get personalized job recommendations
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-teal-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Save and track your applications
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-teal-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Build your professional profile
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
