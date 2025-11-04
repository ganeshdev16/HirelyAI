"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  DollarSign,
  Clock,
  Building,
  Bookmark,
} from "lucide-react";

interface JobDetail {
  jobId: number;
  employerId: number;
  employerName: string;
  jobTitle: string;
  locationName: string;
  minimumSalary?: number;
  maximumSalary?: number;
  currency?: string;
  expirationDate: string;
  date: string;
  jobDescription: string;
  jobUrl: string;
}

interface JobDetailsPageProps {
  jobId: string;
}

const JobDetailsPage = ({ jobId }: JobDetailsPageProps) => {
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("JobDetailsPage mounted with ID:", jobId);

    const fetchJobDetails = async () => {
      if (!jobId) {
        setError("No job ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching job details for:", jobId);
        const response = await fetch(`/api/jobs/${jobId}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Failed to fetch job details: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Job details received:", data);
        setJob(data);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch job details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <span className="text-gray-600">Loading job details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500 mb-6">Job ID: {jobId}</p>
          <a
            href="/"
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Back to Jobs
          </a>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The job you're looking for doesn't exist.
          </p>
          <a
            href="/"
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Back to Jobs
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4"></h1>
            <p className="text-xl text-gray-300"></p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <a
            href="/"
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </a>
        </div>

        {/* Job Details Card */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-teal-600">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                <Building className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {job.jobTitle}
                </h1>
                <p className="text-xl text-gray-600">{job.employerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {getTimeAgo(job.date)}
              </span>
              <Bookmark className="w-6 h-6 text-gray-400 cursor-pointer hover:text-teal-600 transition-colors" />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{job.locationName}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <span>
                {formatSalary(
                  job.minimumSalary,
                  job.maximumSalary,
                  job.currency
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Full time</span>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Job Description
            </h2>
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: job.jobDescription || "No description available",
              }}
            />
          </div>

          {/* Apply Button */}
          <div className="flex gap-4">
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium"
            >
              Apply Now
            </a>
            <button className="px-6 py-3 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition-colors font-medium">
              Save Job
            </button>
          </div>
        </div>

        {/* Job Details Summary */}
      </div>
    </div>
  );
};

export default JobDetailsPage;
