// pages/api/jobs/search.ts (or app/api/jobs/search/route.ts for App Router)

import { NextApiRequest, NextApiResponse } from "next";

// Define interfaces for type safety
interface SearchParams {
  keywords?: string;
  location?: string;
  category?: string;
  employerid?: string;
  distancefromlocation?: number;
  resultstoreturn?: number;
  resultstoskip?: number;
}

interface ReedJobResult {
  jobId: number;
  employerId: number;
  employerName: string;
  jobTitle: string;
  locationName: string;
  minimumSalary?: number;
  maximumSalary?: number;
  currency: string;
  expirationDate: string;
  date: string;
  jobDescription: string;
  applications: number;
  jobUrl: string;
}

interface ReedApiResponse {
  results: ReedJobResult[];
  totalResults: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Extract search parameters from query
    const {
      keywords,
      location,
      category,
      employerid,
      distancefromlocation = 15,
      resultstoreturn = 20,
      resultstoskip = 0,
    } = req.query as SearchParams & { [key: string]: string };

    // Validate required parameters
    if (!keywords) {
      return res.status(400).json({
        error: "Keywords parameter is required",
      });
    }

    // Build query parameters for Reed API
    const searchParams = new URLSearchParams();
    searchParams.append("keywords", keywords);

    if (location) searchParams.append("locationName", location);
    if (category) searchParams.append("categoryName", category);
    if (employerid) searchParams.append("employerid", employerid);
    if (distancefromlocation)
      searchParams.append(
        "distancefromlocation",
        distancefromlocation.toString()
      );
    if (resultstoreturn)
      searchParams.append("resultstoreturn", resultstoreturn.toString());
    if (resultstoskip)
      searchParams.append("resultstoskip", resultstoskip.toString());

    // Get Reed API token from environment variables
    const REED_API_TOKEN = process.env.REED_API_TOKEN;

    if (!REED_API_TOKEN) {
      console.error("Reed API token not found in environment variables");
      return res.status(500).json({
        error: "API configuration error",
      });
    }

    // Create base64 encoded auth header (Reed API uses basic auth with token as username)
    const authHeader = Buffer.from(`${REED_API_TOKEN}:`).toString("base64");

    // Make request to Reed API
    const reedApiUrl = `https://www.reed.co.uk/api/1.0/search?${searchParams.toString()}`;

    const response = await fetch(reedApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
        "User-Agent": "JobSearchApp/1.0",
      },
    });

    if (!response.ok) {
      console.error("Reed API error:", response.status, response.statusText);
      return res.status(response.status).json({
        error: "Failed to fetch jobs from Reed API",
        details: response.statusText,
      });
    }

    const data: ReedApiResponse = await response.json();

    // Transform the data if needed (optional)
    const transformedResults = data.results.map((job) => ({
      id: job.jobId,
      title: job.jobTitle,
      company: job.employerName,
      location: job.locationName,
      salary: {
        min: job.minimumSalary,
        max: job.maximumSalary,
        currency: job.currency,
      },
      description: job.jobDescription,
      url: job.jobUrl,
      datePosted: job.date,
      expirationDate: job.expirationDate,
      applications: job.applications,
    }));

    // Return the results
    res.status(200).json({
      success: true,
      data: {
        jobs: transformedResults,
        totalResults: data.totalResults,
        currentPage:
          Math.floor(
            (Number(resultstoskip) || 0) / (Number(resultstoreturn) || 20)
          ) + 1,
        totalPages: Math.ceil(
          data.totalResults / (Number(resultstoreturn) || 20)
        ),
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// For App Router (app/api/jobs/search/route.ts), use this instead:

const REED_API_KEY =
  process.env.REED_API_KEY || "cd5270c8-4da8-4818-ab34-ec45d08e00bc";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const keywords = searchParams.get("keywords");
  const location = searchParams.get("location");
  const category = searchParams.get("category");
  const distancefromlocation = searchParams.get("distancefromlocation") || "15";
  const resultstoreturn = searchParams.get("resultstoreturn") || "20";
  const resultstoskip = searchParams.get("resultstoskip") || "0";

  if (!keywords) {
    return Response.json(
      { error: "Keywords parameter is required" },
      { status: 400 }
    );
  }

  const authHeader =
    "Basic " + Buffer.from(`${REED_API_KEY}:`).toString("base64");

  try {
    const reedParams = new URLSearchParams();
    reedParams.append("keywords", keywords);
    if (location) reedParams.append("locationName", location);
    if (category) reedParams.append("categoryName", category);
    reedParams.append("distancefromlocation", distancefromlocation);
    reedParams.append("resultstoreturn", resultstoreturn);
    reedParams.append("resultstoskip", resultstoskip);

    const response = await fetch(
      `https://www.reed.co.uk/api/1.0/search?${reedParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: `Reed API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform the data
    const transformedResults = data.results.map((job: any) => ({
      id: job.jobId,
      title: job.jobTitle,
      company: job.employerName,
      location: job.locationName,
      salary: {
        min: job.minimumSalary,
        max: job.maximumSalary,
        currency: job.currency || "GBP",
      },
      description: job.jobDescription,
      url: job.jobUrl,
      datePosted: job.date,
      expirationDate: job.expirationDate,
      applications: job.applications,
    }));

    return Response.json(
      {
        success: true,
        data: {
          jobs: transformedResults,
          totalResults: data.totalResults,
          currentPage:
            Math.floor(Number(resultstoskip) / Number(resultstoreturn)) + 1,
          totalPages: Math.ceil(data.totalResults / Number(resultstoreturn)),
        },
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
