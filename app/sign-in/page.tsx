"use client";
import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { auth } from "../../firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

const SigninPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();
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
      // Sign in user
      const userCredential = await signIn(formData.email, formData.password);
      console.log(userCredential);
      // Check if email is verified
      if (!userCredential.emailVerified) {
        // Optionally send verification email again
        await sendEmailVerification(userCredential);
        setErrors({
          general:
            "Please verify your email address. We've sent you a new verification email.",
        });
        return;
      }

      router.replace("/");
    } catch (error: any) {
      console.error("Error signing in:", error);

      // Handle specific Firebase errors
      switch (error.code) {
        case "auth/user-not-found":
          setErrors({ email: "No account found with this email address" });
          break;
        case "auth/wrong-password":
          setErrors({ password: "Invalid password" });
          break;
        case "auth/invalid-email":
          setErrors({ email: "Invalid email address" });
          break;
        case "auth/user-disabled":
          setErrors({ general: "This account has been disabled" });
          break;
        case "auth/too-many-requests":
          setErrors({
            general: "Too many failed attempts. Please try again later",
          });
          break;
        case "auth/invalid-credential":
          setErrors({ general: "Invalid email or password" });
          break;
        default:
          setErrors({ general: "An error occurred. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      setErrors({ resetEmail: "Email is required" });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setErrors({ resetEmail: "Please enter a valid email" });
      return;
    }

    setIsResettingPassword(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetEmailSent(true);
      setErrors({});
    } catch (error: any) {
      console.error("Error sending password reset email:", error);

      switch (error.code) {
        case "auth/user-not-found":
          setErrors({ resetEmail: "No account found with this email address" });
          break;
        case "auth/invalid-email":
          setErrors({ resetEmail: "Invalid email address" });
          break;
        default:
          setErrors({
            resetEmail: "Error sending reset email. Please try again.",
          });
      }
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Password Reset Form
  if (showResetForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-black text-white py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Reset Password
              </h1>
              <p className="text-lg text-gray-300">
                Enter your email to receive reset instructions
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-teal-600">
              {resetEmailSent ? (
                // Success Message
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Reset Email Sent
                  </h2>
                  <p className="text-gray-600 mb-4">
                    We've sent password reset instructions to:
                  </p>
                  <p className="text-teal-600 font-medium mb-6 break-all">
                    {resetEmail}
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setShowResetForm(false);
                        setResetEmailSent(false);
                        setResetEmail("");
                        setErrors({});
                      }}
                      className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors font-medium"
                    >
                      Back to Sign In
                    </button>
                    <button
                      onClick={() => {
                        setResetEmailSent(false);
                        setErrors({});
                      }}
                      className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Send to Different Email
                    </button>
                  </div>
                </div>
              ) : (
                // Reset Form
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Lock className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-gray-600">
                      Enter your email address and we'll send you instructions
                      to reset your password.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="resetEmail"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="resetEmail"
                        name="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          if (errors.resetEmail) {
                            setErrors((prev) => ({ ...prev, resetEmail: "" }));
                          }
                        }}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          errors.resetEmail
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    {errors.resetEmail && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.resetEmail}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handlePasswordReset}
                      disabled={isResettingPassword}
                      className="w-full flex items-center justify-center px-4 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResettingPassword ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        "Send Reset Instructions"
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setShowResetForm(false);
                        setResetEmail("");
                        setErrors({});
                      }}
                      className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Sign In Screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome Back
            </h1>
            <p className="text-lg text-gray-300">
              Sign in to your account to continue
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Signin Form */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-teal-600">
            <div className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
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
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetForm(true);
                      setResetEmail(formData.email);
                    }}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
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

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me for 30 days
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
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Signup Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/sign-up"
                  className="text-teal-600 hover:text-teal-700 font-medium underline"
                >
                  Create one here
                </a>
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Welcome Back! Here's What's Waiting
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-teal-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Your saved job applications and bookmarks
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-teal-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Personalized job recommendations
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-teal-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Application tracking and updates
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-teal-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Your complete professional profile
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
