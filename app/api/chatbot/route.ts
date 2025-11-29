import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, jobDetails } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Extract job details with defaults
    const jobTitle = jobDetails?.jobTitle || "this position";
    const company = jobDetails?.employerName || "the company";
    const location = jobDetails?.locationName || "the location";
    const salary = jobDetails?.salary || "Not specified";
    const description = jobDetails?.jobDescription || "";

    // Simple pattern matching for common questions
    let response = "";
    const lowerMessage = message.toLowerCase();

    // Check for greetings
    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
      response = `Hello! I'm here to help you learn about this ${jobTitle} position at ${company}. What would you like to know? You can ask about the role, location, salary, or company.`;
    }
    // Check for "what" questions about the job
    else if (lowerMessage.includes("what") && (lowerMessage.includes("job") || lowerMessage.includes("role") || lowerMessage.includes("position") || lowerMessage.includes("responsibilities"))) {
      response = `This is a ${jobTitle} position at ${company}. ${description ? description.substring(0, 250) + "..." : "Please check the full job description for detailed information about responsibilities and requirements."}`;
    }
    // Check for location questions
    else if (lowerMessage.includes("where") || lowerMessage.includes("location")) {
      response = `This position is located in ${location}.`;
    }
    // Check for salary questions
    else if (lowerMessage.includes("salary") || lowerMessage.includes("pay") || lowerMessage.includes("compensation") || lowerMessage.includes("wage")) {
      response = `The salary for this position is: ${salary}. ${salary === "Not specified" ? "Please contact the employer for specific compensation details." : ""}`;
    }
    // Check for company questions
    else if (lowerMessage.includes("company") || lowerMessage.includes("employer") || lowerMessage.includes("organization")) {
      response = `This position is with ${company}, located in ${location}. ${description ? "They are looking for someone for a " + jobTitle + " role." : "Check the job listing for more details about the company."}`;
    }
    // Check for application questions
    else if (lowerMessage.includes("apply") || lowerMessage.includes("how to") || lowerMessage.includes("application")) {
      response = `To apply for this ${jobTitle} position at ${company}, please use the apply button on the job listing page. Make sure to review the requirements before submitting your application.`;
    }
    // Check for requirements questions
    else if (lowerMessage.includes("requirement") || lowerMessage.includes("qualification") || lowerMessage.includes("skill") || lowerMessage.includes("experience")) {
      response = `For detailed requirements and qualifications for the ${jobTitle} position, please review the full job description. ${description ? description.substring(0, 200) + "..." : "Contact the employer for specific qualification details."}`;
    }
    // Check for benefits questions
    else if (lowerMessage.includes("benefit") || lowerMessage.includes("perk") || lowerMessage.includes("insurance")) {
      response = `For information about benefits and perks for this ${jobTitle} position at ${company}, please contact the employer directly or check the complete job listing.`;
    }
    // Summary or default response
    else {
      response = `This is a ${jobTitle} role at ${company} in ${location}. Salary: ${salary}. Feel free to ask me specific questions about the location, salary, responsibilities, or how to apply!`;
    }

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Chatbot error:", error);

    return NextResponse.json(
      { error: "Failed to generate response", details: error?.message },
      { status: 500 }
    );
  }
}
