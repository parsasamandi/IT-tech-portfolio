/**
 * Contact API Route — POST /api/contact
 *
 * Handles contact form submissions.
 * - Validates required fields
 * - Stores message in Supabase (if configured)
 * - Returns success response
 *
 * Request body: { name, email, subject, message }
 * Response:     { success: boolean, message: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // ========== VALIDATION ==========
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required (name, email, subject, message)" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Length validation
    if (name.length > 100 || email.length > 200 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json(
        { error: "One or more fields exceed the maximum length" },
        { status: 400 }
      );
    }

    // ========== STORE IN DATABASE ==========
    const supabase = createServerClient();

    if (supabase) {
      const { error } = await supabase.from("messages").insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        is_read: false,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        // Don't fail — still return success since the message was received
      }
    } else {
      // Log to console in demo mode
      console.log("📧 Contact form submission (demo mode):", {
        name,
        email,
        subject,
        message: message.substring(0, 100) + "...",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been received! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
