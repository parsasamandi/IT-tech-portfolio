/**
 * Contact API Route — POST /api/contact
 *
 * Handles contact form submissions.
 * - Validates required fields
 * - Emails support@sysplat.com via Resend (if configured; Cloudflare routes to ops mailbox)
 * - Stores message in Supabase (if configured)
 *
 * Request body: { name, email, subject, message }
 * Response:     { success: boolean, message: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { createServerClient } from "@/lib/supabase";

export const runtime = 'edge';

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

    const trimmed = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    };

    // ========== EMAIL + STORE ==========
    const emailResult = await sendContactEmail(trimmed);
    if (!emailResult.sent) {
      console.error("Contact email not sent:", emailResult.error);
    }

    const supabase = createServerClient();
    let stored = false;

    if (supabase) {
      const { error } = await supabase.from("messages").insert({
        ...trimmed,
        is_read: false,
      });

      if (error) {
        console.error("Supabase insert error:", error);
      } else {
        stored = true;
      }
    } else {
      console.log("📧 Contact form submission (demo mode):", {
        name: trimmed.name,
        email: trimmed.email,
        subject: trimmed.subject,
        message: trimmed.message.substring(0, 100) + "...",
      });
    }

    if (!emailResult.sent && !stored && (process.env.RESEND_API_KEY || supabase)) {
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 502 }
      );
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
