import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Simple pattern matching for common questions about the website
    let response = "";
    const lowerMessage = message.toLowerCase();

    // Check for greetings
    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
      response = `Hello! Welcome to HirelyAI! I'm here to help you navigate our job search platform. You can ask me about finding jobs, saving listings, our features, or how to get started. What would you like to know?`;
    }
    // Check for questions about searching/finding jobs
    else if (
      lowerMessage.includes("search") ||
      lowerMessage.includes("find") ||
      (lowerMessage.includes("how") && lowerMessage.includes("job"))
    ) {
      response = `Finding jobs on HirelyAI is easy! Here's how:

1. **Browse Categories**: Visit our homepage and explore job categories like Technology, Healthcare, Finance, and more.

2. **Use Search**: Click "Get Your Dream Job" or use the search feature to find jobs by title, location, or keywords.

3. **Filter Results**: Narrow down your search by location, salary range, and job type.

4. **View Details**: Click on any job to see full details, requirements, and company information.

Start your job search now by clicking "Get Your Dream Job" on the homepage!`;
    }
    // Check for questions about saving jobs
    else if (
      lowerMessage.includes("save") ||
      lowerMessage.includes("bookmark") ||
      lowerMessage.includes("saved jobs")
    ) {
      response = `You can save jobs for later! Here's how:

📌 **Save Jobs**: Click the bookmark icon on any job listing to save it.

📋 **View Saved Jobs**: Access all your saved jobs by clicking "Saved Jobs" in the navigation menu.

🗑️ **Manage Saved Jobs**: Remove jobs from your saved list anytime.

All your saved jobs are stored locally on your device, so they'll be there when you return!`;
    }
    // Check for questions about features
    else if (
      lowerMessage.includes("feature") ||
      lowerMessage.includes("what do you offer") ||
      lowerMessage.includes("what can")
    ) {
      response = `HirelyAI offers these powerful features:

✨ **Job Search**: Browse thousands of job listings across multiple categories
🔖 **Save Jobs**: Bookmark jobs you're interested in for later
🤖 **AI Chatbot**: Get instant answers about job details and our platform
📍 **Location Filter**: Find jobs in your preferred location
💰 **Salary Information**: See salary ranges for positions
📱 **Responsive Design**: Use HirelyAI on any device
🔍 **Smart Search**: Filter by keywords, location, and category

Everything you need to find your dream job!`;
    }
    // Check for questions about the platform/website
    else if (
      lowerMessage.includes("about") ||
      lowerMessage.includes("hirely") ||
      lowerMessage.includes("what is") ||
      lowerMessage.includes("tell me")
    ) {
      response = `HirelyAI is your intelligent job search platform! 🚀

**Our Mission**: Connecting Talent with Opportunity - We help job seekers find their perfect career match.

**What Makes Us Special**:
• Curated job listings from top employers
• AI-powered assistance to answer your questions
• Easy-to-use interface with powerful search features
• Save and organize your favorite job listings
• Multiple job categories to explore

We're here to make your job search easier, faster, and more successful. Start exploring opportunities today!`;
    }
    // Check for questions about getting started
    else if (
      lowerMessage.includes("start") ||
      lowerMessage.includes("begin") ||
      lowerMessage.includes("how to use")
    ) {
      response = `Getting started with HirelyAI is simple! 🎯

**Step 1**: Browse job categories on the homepage or click "Get Your Dream Job"

**Step 2**: Use filters to narrow down jobs by location, salary, or keywords

**Step 3**: Click on jobs that interest you to view full details

**Step 4**: Save jobs you like by clicking the bookmark icon

**Step 5**: When ready, click "Apply" to submit your application

**Pro Tip**: Check the "Saved Jobs" section to review all your bookmarked opportunities in one place!`;
    }
    // Check for questions about categories
    else if (
      lowerMessage.includes("categor") ||
      lowerMessage.includes("industry") ||
      lowerMessage.includes("field")
    ) {
      response = `We offer jobs across many categories! 🏢

Popular categories include:
• 💻 Technology & IT
• 🏥 Healthcare & Medical
• 💼 Financial Services
• 🏗️ Construction & Engineering
• 🎨 Media & Creative
• 📚 Education
• 🏨 Hotels & Tourism
• 🛍️ Commerce & Retail
• And many more!

Browse all categories on our homepage to find opportunities in your field!`;
    }
    // Check for questions about applying
    else if (
      lowerMessage.includes("apply") ||
      lowerMessage.includes("application")
    ) {
      response = `Applying for jobs is straightforward! 📝

1. **Find a Job**: Search or browse to find a position you like
2. **Review Details**: Click "View Details" to read the full job description
3. **Use the Chatbot**: Ask our AI assistant any questions about the role
4. **Click Apply**: When ready, click the "Apply Now" button
5. **External Application**: You'll be directed to the employer's application page

💡 **Tip**: Save jobs you're interested in so you can come back to apply later!`;
    }
    // Check for questions about account/login
    else if (
      lowerMessage.includes("account") ||
      lowerMessage.includes("login") ||
      lowerMessage.includes("register") ||
      lowerMessage.includes("sign")
    ) {
      response = `Account features are available! 👤

You can **Login** or **Register** using the buttons in the top navigation bar.

**Benefits of having an account**:
• Personalized job recommendations
• Track your applications
• Enhanced profile features
• Faster application process

Click "Login" or "Register" in the top right corner to get started!`;
    }
    // Check for help/support questions
    else if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("support") ||
      lowerMessage.includes("contact")
    ) {
      response = `Need help? We're here for you! 💬

**Get Support**:
• Use this chatbot for instant answers
• Visit our "Contact Us" page in the navigation menu
• Check out the "About Us" section for more information

**Common Topics**:
• How to search for jobs
• Saving and managing job listings
• Application process
• Account features

What specific question can I help you with?`;
    }
    // Default response
    else {
      response = `Thanks for your question! I can help you with:

🔍 **Job Search**: How to find and filter jobs
🔖 **Saving Jobs**: Bookmarking and managing saved listings
✨ **Features**: Learn about what HirelyAI offers
🚀 **Getting Started**: How to use the platform
📋 **Categories**: Explore different job fields
💼 **Applying**: How to apply for positions

What would you like to know more about?`;
    }

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Website chatbot error:", error);

    return NextResponse.json(
      { error: "Failed to generate response", details: error?.message },
      { status: 500 }
    );
  }
}
