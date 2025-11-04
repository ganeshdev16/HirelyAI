import { NextRequest, NextResponse } from "next/server";

const REED_API_KEY =
  process.env.REED_API_KEY || "cd5270c8-4da8-4818-ab34-ec45d08e00bc";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> } // Use Promise for params
) {
  const { jobId } = await context.params; // Await the params to resolve the Promise

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  const authHeader =
    "Basic " + Buffer.from(`${REED_API_KEY}:`).toString("base64");

  try {
    const response = await fetch(
      `https://www.reed.co.uk/api/1.0/jobs/${jobId}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Reed API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch job details" },
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
