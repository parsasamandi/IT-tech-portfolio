/**
 * Contact-form email via Resend (Edge-safe fetch).
 * From must be on the verified sysplat.com domain; PLATFORM_CONTACT_EMAIL is the public inbox.
 */
import { PLATFORM_CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/constants";

const CONTACT_FROM =
  process.env.CONTACT_FROM_EMAIL || `SYSPLAT <${PLATFORM_CONTACT_EMAIL}>`;
const CONTACT_TO = process.env.CONTACT_TO_EMAIL || SOCIAL_LINKS.email;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactEmail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY is not configured" };
  }

  const { name, email, subject, message } = input;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      reply_to: email,
      subject: `[SYSPLAT] Website inquiry from ${name}`,
      text: [
        "A visitor submitted the contact form on sysplat.com.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        message,
        "",
        "Reply to this email to respond to the visitor.",
        "https://sysplat.com",
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;color:#0f172a;line-height:1.5">
          <p style="margin:0 0 16px">A visitor submitted the contact form on <a href="https://sysplat.com">sysplat.com</a>.</p>
          <p style="margin:0 0 8px"><strong>Name:</strong> ${safeName}</p>
          <p style="margin:0 0 8px"><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin:0 0 16px"><strong>Subject:</strong> ${safeSubject}</p>
          <p style="margin:0 0 24px">${safeMessage}</p>
          <p style="margin:0;font-size:13px;color:#64748b">Reply to this email to respond to the visitor.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Resend send failed:", response.status, body);
    return { sent: false, error: `Resend ${response.status}` };
  }

  return { sent: true };
}
