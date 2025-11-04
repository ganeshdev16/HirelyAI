// app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";

const REED_API_KEY =
  process.env.REED_API_KEY || "cd5270c8-4da8-4818-ab34-ec45d08e00bc";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get parameters from the request
  const keywords = searchParams.get("keywords") || "";
  const locationName = searchParams.get("locationName") || "";
  const resultsToTake = searchParams.get("resultsToTake") || "20";
  const resultsToSkip = searchParams.get("resultsToSkip") || "0";

  // Build Reed API URL
  const reedUrl = new URL("https://www.reed.co.uk/api/1.0/search");

  if (keywords) {
    reedUrl.searchParams.append("keywords", keywords);
  }
  if (locationName) {
    reedUrl.searchParams.append("locationName", locationName);
  }
  reedUrl.searchParams.append("resultsToTake", resultsToTake);
  reedUrl.searchParams.append("resultsToSkip", resultsToSkip);

  // Encode API Key as Basic Auth
  const authHeader =
    "Basic " + Buffer.from(`${REED_API_KEY}:`).toString("base64");

  try {
    const response = await fetch(reedUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error("Reed API Error:", response.status, response.statusText);
      return NextResponse.json(
        { error: `Reed API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the data with CORS headers
    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Error fetching from Reed API:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
