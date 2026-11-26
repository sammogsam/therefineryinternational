import { NextResponse } from "next/server";
import { Resend } from "resend";

const ITEMS_TO_BRING = [
  "Towel",
  "Pyjamas / Night gown / Cardigan",
  "Toothbrush & Toothpaste",
  "Toilet soap & Sponge",
  "Toilet roll",
  "Cover cloth",
  "Bathroom Slippers",
  "Comb / brush",
  "Plate, Cup & Cutlery",
  "Sport wear",
  "Body cream & hair cream",
  "Bible, jotter and pen",
  "Sanitary Pad (for girls)",
  "Wears to change",
  "The right mindset",
  "Your personal registration code (printed or on your phone)",
];

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const {
      primaryContactName,
      email,
      category,
      registrationCode,
      totalAttendees,
    } = await request.json();

    if (!email || !registrationCode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const formattedCategory = String(category || "guest").replace(/_/g, " ");
    const itemsHtml = ITEMS_TO_BRING.map(
      (item) => `<li style="margin-bottom: 6px;">${item}</li>`
    ).join("");

    const { data, error } = await resend.emails.send({
      from: "The Refinery International <noreply@therefineryinternational.com>",
      to: [email],
      subject: `Camp Meeting Registration Confirmed — Code: ${registrationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937; line-height: 1.6;">
          <div style="background-color: #f97316; padding: 28px 24px; text-align: center; border-radius: 16px 16px 0 0;">
            <p style="margin: 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #ffedd5; font-weight: bold;">
              The Refinery International
            </p>
            <h1 style="margin: 8px 0 0; font-size: 24px; color: #ffffff;">
              Camp Meeting Registration Confirmed
            </h1>
          </div>

          <div style="padding: 28px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px; background-color: #ffffff;">
            <p>Dear <strong>${primaryContactName}</strong>,</p>
            <p>
              Thank you for registering for the upcoming Camp Meeting under the
              <strong style="text-transform: capitalize;">${formattedCategory}</strong> category
              (Total Attendees: <strong>${totalAttendees || 1}</strong>).
            </p>

            <div style="margin: 24px 0; padding: 20px; border: 2px dashed #fdba74; background-color: #fff7ed; border-radius: 12px; text-align: center;">
              <p style="margin: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #ea580c;">
                Your Personal Registration Code
              </p>
              <p style="margin: 8px 0; font-family: monospace; font-size: 30px; font-weight: 800; letter-spacing: 4px; color: #111827;">
                ${registrationCode}
              </p>
              <p style="margin: 0; font-size: 13px; color: #4b5563;">
                Please bring this code to the camp ground. Our team will verify that it matches your name before granting entry.
              </p>
            </div>

            <div style="margin-bottom: 24px; padding: 18px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
              <h2 style="margin: 0 0 10px; font-size: 16px; color: #111827;">
                Camp Schedule & Venue
              </h2>
              <p style="margin: 4px 0; font-size: 14px;">
                <strong>Camp Opens:</strong> 7:00 AM, Monday, 21st December, 2026
              </p>
              <p style="margin: 4px 0; font-size: 14px;">
                <strong>Camp Closes:</strong> 7:00 AM, Thursday, 24th December, 2026
              </p>
              <p style="margin: 4px 0; font-size: 14px;">
                <strong>Venue:</strong> University Demonstration Secondary School, Ikere-Ekiti
              </p>
              <p style="margin: 4px 0; font-size: 14px;">
                <strong>Enquiries:</strong> Olabisi (08162666731), Iyanu (09132963923), Ilesanmi (08142963814)
              </p>
            </div>

            <div style="margin-bottom: 24px;">
              <h2 style="margin: 0 0 10px; font-size: 16px; color: #111827;">
                Items to Bring to the Camp Meeting
              </h2>
              <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #374151;">
                ${itemsHtml}
              </ol>
            </div>

            <p style="font-size: 13px; color: #6b7280; margin-top: 24px;">
              We look forward to welcoming you! Keep an eye on your email and phone for any further updates from our team.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Email route error:", err);
    return NextResponse.json(
      { error: "Failed to send confirmation email" },
      { status: 500 }
    );
  }
}