import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { message, jobDetails } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Create a context-aware prompt for the chatbot
    const systemPrompt = `You are a helpful assistant that provides information about job postings. You have access to the following job details:

Job Title: ${jobDetails?.jobTitle || "N/A"}
Company: ${jobDetails?.employerName || "N/A"}
Location: ${jobDetails?.locationName || "N/A"}
Salary: ${jobDetails?.salary || "N/A"}
Description: ${jobDetails?.jobDescription || "N/A"}

Your role is to:
1. Provide concise, helpful summaries of the job details
2. Answer questions about the role, location, salary, and responsibilities
3. Help users understand if this job matches their interests
4. Keep responses brief and to the point (2-3 sentences max unless asked for details)

Be friendly, professional, and helpful.`;

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Combine system prompt and user message for Gemini
    const prompt = `${systemPrompt}\n\nUser Question: ${message}`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = result.response.text() || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Chatbot error:", error);

    // Handle specific API errors
    if (error?.status === 401 || error?.message?.includes("API key")) {
      return NextResponse.json(
        { error: "Invalid API key. Please set GEMINI_API_KEY in your environment variables." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate response", details: error?.message },
      { status: 500 }
    );
  }
}
