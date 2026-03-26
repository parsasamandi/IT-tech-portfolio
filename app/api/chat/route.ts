/**
 * Chat API Route — POST /api/chat
 *
 * Handles AI chat conversations.
 * - When OPENAI_API_KEY is configured: calls OpenAI GPT API
 * - Otherwise: returns intelligent mock responses (demo mode)
 *
 * Request body: { messages: [{ role, content }] }
 * Response:     { message: string }
 */
import { NextRequest, NextResponse } from "next/server";

/** System prompt for the AI assistant */
const SYSTEM_PROMPT = `You are a helpful AI assistant for SYPLAT, a professional technology solutions and IT services company. You help visitors learn about services, projects, and technologies. Be concise, friendly, and professional. If asked about pricing or specific project details, suggest they use the contact form for a detailed consultation.`;

/** Mock responses for demo mode (when no OpenAI key is configured) */
const MOCK_RESPONSES: Record<string, string> = {
  default:
    "Thanks for your message! I can help you with information about our services, technologies, and projects. What would you like to know more about?",
  services:
    "We offer a wide range of services including Web Development, Backend & API design, Cloud & DevOps, Mobile Development, Cybersecurity, and AI/ML solutions. Each solution is tailored to your specific needs. Would you like to know more about any specific service?",
  projects:
    "We've completed over 150 projects across industries like e-commerce, healthcare, fintech, and more. Check out our Projects section to see our latest work, or contact us to discuss your project idea!",
  pricing:
    "Our pricing varies based on project scope and complexity. I'd recommend filling out our contact form with your project details, and our team will provide a detailed quote within 24 hours.",
  tech: "Our tech stack includes React, Next.js, TypeScript, Node.js, Python, PostgreSQL, AWS, Docker, Kubernetes, and more. We choose the best technologies for each project's needs.",
  contact:
    "You can reach us through the contact form on our website, email us at contact@itportfolio.dev, or call us at +1 (555) 123-4567. We typically respond within 24 hours!",
  hello:
    "Hello there! 👋 Welcome to ITTech. I'm here to help you learn about our services and how we can help with your tech needs. What can I assist you with?",
};

/**
 * Determine the best mock response based on the user's message.
 */
function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return MOCK_RESPONSES.hello;
  }
  if (lower.includes("service") || lower.includes("offer") || lower.includes("do you")) {
    return MOCK_RESPONSES.services;
  }
  if (lower.includes("project") || lower.includes("portfolio") || lower.includes("work")) {
    return MOCK_RESPONSES.projects;
  }
  if (lower.includes("price") || lower.includes("cost") || lower.includes("budget") || lower.includes("quote")) {
    return MOCK_RESPONSES.pricing;
  }
  if (lower.includes("tech") || lower.includes("stack") || lower.includes("language") || lower.includes("framework")) {
    return MOCK_RESPONSES.tech;
  }
  if (lower.includes("contact") || lower.includes("email") || lower.includes("phone") || lower.includes("reach")) {
    return MOCK_RESPONSES.contact;
  }

  return MOCK_RESPONSES.default;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && apiKey !== "sk-your-openai-key-here") {
      // ========== OPENAI MODE ==========
      try {
        const openAIResponse = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...messages.slice(-10), // Keep last 10 messages for context
              ],
              max_tokens: 300,
              temperature: 0.7,
            }),
          }
        );

        if (!openAIResponse.ok) {
          const errorData = await openAIResponse.json();
          console.error("OpenAI API error:", errorData);
          throw new Error("OpenAI API request failed");
        }

        const data = await openAIResponse.json();
        const aiMessage = data.choices[0].message.content;

        return NextResponse.json({ message: aiMessage });
      } catch (error) {
        console.error("OpenAI error, falling back to mock:", error);
        // Fall through to mock response
      }
    }

    // ========== DEMO MODE (mock responses) ==========
    // Add a small delay to simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockResponse = getMockResponse(lastMessage.content);
    return NextResponse.json({ message: mockResponse });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
