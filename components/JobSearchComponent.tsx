"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  Search,
  Briefcase,
  Users,
  Building,
  Loader2,
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: {
    min?: number;
    max?: number;
    currency: string;
  };
  description: string;
  url: string;
  datePosted: string;
  applications: number;
}

interface ApiResponse {
  success: boolean;
  data?: {
    jobs: Job[];
    totalResults: number;
    currentPage: number;
    totalPages: number;
  };
  error?: string;
}

const JobSearchComponent = () => {
  const [searchData, setSearchData] = useState({
    jobTitle: "",
    location: "",
    category: "",
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const handleInputChange = (field: string, value: string) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = async () => {
    // Check if job title is provided (required field)
    if (!searchData.jobTitle.trim()) {
      alert("Please enter a job title or company name");
      return;
    }

    setIsLoading(true);
    setError(null);
    setJobs([]);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("keywords", searchData.jobTitle);

      if (searchData.location) {
        params.append("location", searchData.location);
      }

      if (searchData.category) {
        params.append("category", searchData.category);
      }

      // Make API call to our Next.js API route
      const response = await fetch(`/api/jobs/search?${params.toString()}`);
      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to search jobs");
      }

      if (result.success && result.data) {
        setJobs(result.data.jobs);
        setTotalResults(result.data.totalResults);
      } else {
        throw new Error(result.error || "No data returned");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while searching for jobs";
      setError(errorMessage);
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSalary = (salary: Job["salary"]) => {
    if (!salary.min && !salary.max) return "Salary not specified";

    const formatter = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: salary.currency || "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    if (salary.min && salary.max) {
      return `${formatter.format(salary.min)} - ${formatter.format(
        salary.max
      )}`;
    } else if (salary.min) {
      return `From ${formatter.format(salary.min)}`;
    } else if (salary.max) {
      return `Up to ${formatter.format(salary.max)}`;
    }

    return "Salary not specified";
  };

  return (
    <div
      className="bg-teal-600 from-teal-600  flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 gap-6 lg:gap-8 relative min-h-screen py-8"
      style={{ fontFamily: "Figtree, sans-serif" }}
    >
      {/* Main Search Container */}
      <div className="w-full max-w-5xl bg-transparent rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center gap-6 lg:gap-8">
        {/* Hero Text */}
        <div className="flex flex-col justify-center items-center max-w-4xl">
          <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-3 sm:mb-4 text-center leading-tight">
            Find Your Dream Job Today!
          </h1>
          <p className="text-white font-normal text-sm sm:text-base lg:text-lg text-center max-w-2xl">
            Connecting Talent with Opportunity: Your Gateway to Career Success
          </p>
        </div>

        {/* Search Form Container */}
        <div className="w-full max-w-4xl">
          {/* Mobile First: Stack all inputs vertically on small screens */}
          <div className="flex flex-col gap-3 md:hidden">
            {/* Job Title Input - Mobile */}
            <div className="relative">
              <input
                type="text"
                placeholder="Job Title or Company *"
                value={searchData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                className="w-full h-14 px-4 pr-12 text-gray-700 placeholder-gray-400 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-base transition-all duration-200"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Location Dropdown - Mobile */}
            <div className="relative">
              <select
                value={searchData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full h-14 px-4 pr-12 text-gray-700 border-2 border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none cursor-pointer text-base bg-white transition-all duration-200"
              >
                <option value="">Select Location (Optional)</option>
                <option value="London">London</option>
                <option value="Manchester">Manchester</option>
                <option value="Birmingham">Birmingham</option>
                <option value="Edinburgh">Edinburgh</option>
                <option value="Bristol">Bristol</option>
                <option value="Remote">Remote</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Category Dropdown - Mobile */}
            <div className="relative">
              <select
                value={searchData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full h-14 px-4 pr-12 text-gray-700 border-2 border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none cursor-pointer text-base bg-white transition-all duration-200"
              >
                <option value="">Select Category (Optional)</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Engineering">Engineering</option>
                <option value="Healthcare">Healthcare</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Search Button - Mobile */}
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full h-14 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:bg-teal-400 disabled:cursor-not-allowed text-white flex items-center justify-center gap-3 font-semibold rounded-lg transition-all duration-200 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Search Jobs</span>
                </>
              )}
            </button>
          </div>

          {/* Desktop Layout: Single Row */}
          <div className="hidden md:flex bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            {/* Job Title Input - Desktop */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Job Title or Company *"
                value={searchData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                className="w-full h-20 px-6 pr-12 text-gray-700 placeholder-gray-400 border-none focus:ring-0 focus:outline-none text-base bg-transparent"
              />
              <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200"></div>
            </div>

            {/* Location Dropdown - Desktop */}
            <div className="flex-1 relative">
              <select
                value={searchData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full h-20 px-6 pr-12 text-gray-700 border-none appearance-none focus:ring-0 focus:outline-none cursor-pointer text-base bg-transparent"
              >
                <option value="">Select Location (Optional)</option>
                <option value="London">London</option>
                <option value="Manchester">Manchester</option>
                <option value="Birmingham">Birmingham</option>
                <option value="Edinburgh">Edinburgh</option>
                <option value="Bristol">Bristol</option>
                <option value="Remote">Remote</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200"></div>
            </div>

            {/* Category Dropdown - Desktop */}
            <div className="flex-1 relative">
              <select
                value={searchData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full h-20 px-6 pr-12 text-gray-700 border-none appearance-none focus:ring-0 focus:outline-none cursor-pointer text-base bg-transparent"
              >
                <option value="">Select Category (Optional)</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Engineering">Engineering</option>
                <option value="Healthcare">Healthcare</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Search Button - Desktop */}
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex-shrink-0 px-8 h-20 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:bg-teal-400 disabled:cursor-not-allowed text-white flex items-center justify-center gap-3 font-semibold transition-all duration-200 text-base shadow-none hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Search Jobs</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {(jobs.length > 0 || error) && (
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium">Error: {error}</p>
            </div>
          )}

          {jobs.length > 0 && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Search Results
                </h2>
                <p className="text-gray-600">
                  Found {totalResults.toLocaleString()} jobs
                </p>
              </div>

              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-teal-600">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {job.title}
                        </a>
                      </h3>
                      <span className="text-sm text-gray-500">
                        {job.applications} applications
                      </span>
                    </div>

                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {job.company}
                    </p>
                    <p className="text-gray-600 mb-2">{job.location}</p>
                    <p className="text-teal-600 font-medium mb-3">
                      {formatSalary(job.salary)}
                    </p>

                    <p className="text-gray-700 line-clamp-3 mb-4">
                      {job.description
                        .replace(/<[^>]*>/g, "")
                        .substring(0, 200)}
                      ...
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Posted: {new Date(job.datePosted).toLocaleDateString()}
                      </span>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        View Job
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Feature Icons - Only show if no results */}
      {jobs.length === 0 && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-16 w-full max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <Briefcase className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-white text-lg sm:text-xl lg:text-2xl">
                208,500
              </h3>
              <p className="font-medium text-white/90 text-sm sm:text-base">
                Jobs
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <Users className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-white text-lg sm:text-xl lg:text-2xl">
                102,500
              </h3>
              <p className="font-medium text-white/90 text-sm sm:text-base">
                Candidates
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <Building className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-white text-lg sm:text-xl lg:text-2xl">
                208,500
              </h3>
              <p className="font-medium text-white/90 text-sm sm:text-base">
                Companies
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearchComponent;
