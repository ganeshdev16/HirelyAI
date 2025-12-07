"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Figtree } from "next/font/google";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Shield,
  Palette,
  BarChart3,
  Globe,
  TrendingUp,
  Briefcase,
  Camera,
  Zap,
  Coffee,
  Apple,
  Loader2,
} from "lucide-react";
import { log } from "console";
import Link from "next/link";
import { saveJob, unsaveJob, isJobSaved, getSavedJobs } from "@/utils/savedJobs";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

const figtree = Figtree({ subsets: ["latin"] });

interface JobBoardProps {
  category: string;
}

interface Job {
  jobId: number;
  employerId: number;
  employerName: string;
  employerProfileId?: number;
  employerProfileName?: string;
  jobTitle: string;
  locationName: string;
  minimumSalary?: number;
  maximumSalary?: number;
  currency?: string;
  expirationDate: string;
  date: string;
  jobDescription: string;
  applications?: number;
  jobUrl: string;
}

interface ReedApiResponse {
  results: Job[];
  totalResults: number;
}

const JobBoard = ({ category }: JobBoardProps) => {
  const [salaryRange, setSalaryRange] = useState(50000);
  const [showMore, setShowMore] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set());
  const { authState } = useAuth();
  const router = useRouter();

  // Decode the category from URL encoding and provide a default
  const decodedCategory = decodeURIComponent(category);

  const fetchJobsFromReed = async (
    keywords: string = "",
    location: string = "",
    categoryKeyword: string = ""
  ) => {
    // Use your Next.js API route instead of calling Reed directly
    const url = new URL("/api/jobs", window.location.origin);

    // Build search keywords based on category and search term
    let searchKeywords = "";
    if (categoryKeyword && categoryKeyword !== "All Categories") {
      searchKeywords = categoryKeyword;
    }
    if (keywords) {
      searchKeywords = searchKeywords
        ? `${searchKeywords} ${keywords}`
        : keywords;
    }

    if (searchKeywords) {
      url.searchParams.append("keywords", searchKeywords);
    }
    if (location) {
      url.searchParams.append("locationName", location);
    }
    url.searchParams.append("resultsToTake", "20");

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data: ReedApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  };

  // Function to get category keyword for API search
  const getCategoryKeyword = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      "Hotels & Tourism": "hospitality tourism hotel",
      "Financial Services": "finance banking financial",
      Commerce: "sales retail commerce",
      Construction: "construction building",
      Media: "media marketing creative",
      Telecommunications: "telecom communications",
      Education: "education teaching",
      Healthcare: "healthcare medical",
      Technology: "IT technology software",
      Engineering: "engineering",
    };

    return categoryMap[category] || category;
  };

  // Function to get time ago string
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return "Just posted";
    }
  };

  // Function to format salary
  const formatSalary = (
    min?: number,
    max?: number,
    currency = "GBP"
  ): string => {
    const symbol = currency === "GBP" ? "£" : "$";
    if (min && max) {
      return `${symbol}${min.toLocaleString()}-${symbol}${max.toLocaleString()}`;
    } else if (min) {
      return `${symbol}${min.toLocaleString()}+`;
    }
    return "Competitive";
  };

  // Load saved job IDs when component mounts
  useEffect(() => {
    const loadSavedJobs = async () => {
      if (authState.isAuthenticated) {
        const saved = await getSavedJobs();
        setSavedJobIds(new Set(saved.map((job) => job.jobId)));
      }
    };
    loadSavedJobs();
  }, [authState.isAuthenticated]);

  // Handle save/unsave job
  const handleToggleSaveJob = async (job: Job) => {
    // Check if user is logged in
    if (!authState.isAuthenticated) {
      alert("Please login to save jobs");
      router.push("/sign-in");
      return;
    }

    const isSaved = savedJobIds.has(job.jobId);

    if (isSaved) {
      const success = await unsaveJob(job.jobId);
      if (success) {
        setSavedJobIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(job.jobId);
          return newSet;
        });
      }
    } else {
      const success = await saveJob({
        jobId: job.jobId,
        employerId: job.employerId,
        employerName: job.employerName,
        jobTitle: job.jobTitle,
        locationName: job.locationName,
        minimumSalary: job.minimumSalary,
        maximumSalary: job.maximumSalary,
        currency: job.currency,
        expirationDate: job.expirationDate,
        date: job.date,
        jobDescription: job.jobDescription,
        jobUrl: job.jobUrl,
      });

      if (success) {
        setSavedJobIds((prev) => new Set(prev).add(job.jobId));
      } else {
        alert("Failed to save job. Please try again.");
      }
    }
  };

  // Fetch jobs when component mounts or when category/search parameters change
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const categoryKeyword =
          decodedCategory === "All Categories"
            ? ""
            : getCategoryKeyword(decodedCategory);

        const data = await fetchJobsFromReed(
          searchTerm,
          selectedLocation,
          categoryKeyword
        );
        setJobs(data.results || []);
        console.log("jobs", jobs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch jobs");
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [decodedCategory, searchTerm, selectedLocation]);
  console.log("job", jobs);
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will trigger automatically via useEffect when searchTerm changes
  };

  const companies = [
    {
      name: "Instagram",
      icon: Camera,
      jobs: 8,
      description:
        "Elit velit mauris aliquam est diam morbi. Leo sagittis consectetur enim morbi erat.",
    },
    {
      name: "Tesla",
      icon: Zap,
      jobs: 15,
      description:
        "At pellentesque amet dolor odio cras imperdiet nisl. Ac magna aliquam massa leo.",
    },
    {
      name: "McDonald's",
      icon: Coffee,
      jobs: 12,
      description:
        "Odio aliquam tellus tellus rhoncus. Faucibus in viverra venenatis pretibium.",
    },
    {
      name: "Apple",
      icon: Apple,
      jobs: 9,
      description:
        "Et odio sem tellus ultrices posuere consequat. Tristique maxcupar sapien.",
    },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${figtree.className}`}>
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {decodedCategory === "All Categories"
                ? "Find Your Dream Job"
                : `${decodedCategory} Jobs`}
            </h1>
            <p className="text-xl text-gray-300">
              {decodedCategory === "All Categories"
                ? "Discover opportunities that match your skills"
                : `Discover ${decodedCategory.toLowerCase()} opportunities that match your skills`}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {/* Current Category Display */}
              {decodedCategory !== "All Categories" && (
                <div className="mb-6 p-3 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="text-sm font-medium text-teal-800">
                    Viewing: {decodedCategory}
                  </p>
                </div>
              )}

              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Job Title
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Job title or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </form>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">All locations</option>
                    <option value="London">London</option>
                    <option value="Manchester">Manchester</option>
                    <option value="Birmingham">Birmingham</option>
                    <option value="Leeds">Leeds</option>
                    <option value="Glasgow">Glasgow</option>
                    <option value="Bristol">Bristol</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Hiring Banner */}
              <div className="bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg p-6 text-white text-center">
                <h3 className="text-lg font-bold mb-2">WE ARE HIRING</h3>
                <p className="text-sm mb-4">Apply Today!</p>
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600">
                {loading ? (
                  "Loading jobs..."
                ) : (
                  <>
                    Showing {jobs.length} results
                    {decodedCategory !== "All Categories" &&
                      ` for ${decodedCategory}`}
                  </>
                )}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by</span>
                <div className="relative">
                  <select className="border border-gray-300 rounded-md px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none">
                    <option>latest</option>
                    <option>salary</option>
                    <option>relevance</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                <span className="ml-2 text-gray-600">Loading jobs...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-800 font-medium">Error loading jobs</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Job Listings */}
            {!loading && !error && (
              <div className="space-y-4">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div
                      key={job.jobId}
                      className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {job.jobTitle}
                            </h3>
                            <p className="text-gray-600">{job.employerName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(job.date)}
                          </span>
                          <Bookmark
                            className={`w-5 h-5 cursor-pointer transition-colors ${
                              savedJobIds.has(job.jobId)
                                ? "text-teal-600 fill-teal-600"
                                : "text-gray-400 hover:text-teal-600"
                            }`}
                            onClick={() => handleToggleSaveJob(job)}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">
                            {decodedCategory !== "All Categories"
                              ? decodedCategory
                              : "Job"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Full time</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>
                            {formatSalary(
                              job.minimumSalary,
                              job.maximumSalary,
                              job.currency
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.locationName}</span>
                        </div>
                      </div>

                      {/* Job Description Preview */}
                      <div className="mb-4">
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {job.jobDescription
                            .replace(/<[^>]*>/g, "")
                            .substring(0, 150)}
                          ...
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          {job.applications && (
                            <span>{job.applications} applications</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/jobs/${job.jobId}`}
                            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                          >
                            View Details
                          </Link>
                          <a
                            href={job.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition-colors"
                          >
                            Apply
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No jobs found
                      {decodedCategory !== "All Categories" &&
                        ` in ${decodedCategory}`}
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search criteria or check back later for
                      new opportunities.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination - only show if there are results */}
            {!loading && !error && jobs.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button className="w-8 h-8 bg-teal-600 text-white rounded flex items-center justify-center font-medium">
                  1
                </button>
                <button className="w-8 h-8 bg-gray-200 text-gray-600 rounded flex items-center justify-center hover:bg-gray-300 transition-colors">
                  2
                </button>
                <button className="px-3 py-1 text-gray-600 hover:text-teal-600 flex items-center gap-1 transition-colors">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Top Company Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Top Company
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At qui laboris pretium tincidunt amet libero ut aenean sequi.
              Blandit a massa elementum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companies.map((company) => {
              const IconComponent = company.icon;
              return (
                <div
                  key={company.name}
                  className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {company.description}
                  </p>
                  <p className="text-teal-600 font-medium">
                    {company.jobs} open jobs
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
