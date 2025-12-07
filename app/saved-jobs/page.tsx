"use client";
import React, { useState, useEffect } from "react";
import {
  Bookmark,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Figtree } from "next/font/google";
import { getSavedJobs, unsaveJob, SavedJob } from "@/utils/savedJobs";
import NavBar from "@/components/NavBar";

const figtree = Figtree({ subsets: ["latin"] });

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const jobs = await getSavedJobs();
        setSavedJobs(jobs);
      } catch (error) {
        console.error("Error loading saved jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSavedJobs();
  }, []);

  const handleRemoveJob = async (jobId: number) => {
    const success = await unsaveJob(jobId);
    if (success) {
      setSavedJobs((prev) => prev.filter((job) => job.jobId !== jobId));
    }
  };

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
        <div className="text-gray-600">Loading saved jobs...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${figtree.className}`}>
      {/* Navigation */}
      <div className="bg-black">
        <NavBar />
      </div>

      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bookmark className="w-10 h-10" />
              <h1 className="text-4xl md:text-5xl font-bold">Saved Jobs</h1>
            </div>
            <p className="text-xl text-gray-300">
              Your bookmarked job opportunities
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Saved Jobs List */}
        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Saved Jobs Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start saving jobs you're interested in to view them here later
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-gray-600">
                {savedJobs.length} saved job{savedJobs.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-4">
              {savedJobs.map((job) => (
                <div
                  key={job.jobId}
                  className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {job.jobTitle}
                        </h3>
                        <p className="text-gray-600">{job.employerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-gray-500">
                        {getTimeAgo(job.date)}
                      </span>
                      <button
                        onClick={() => handleRemoveJob(job.jobId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove from saved jobs"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
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

                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span>Saved on {new Date(job.savedAt).toLocaleDateString()}</span>
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
