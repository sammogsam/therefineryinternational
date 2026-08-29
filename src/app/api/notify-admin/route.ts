import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function POST(req: Request) {
  try {
    const { title, authorName, authorEmail, type } = await req.json();

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "sammogsam@gmail.com";

    await resend.emails.send({
      from: "The Refinery Portal <noreply@therefineryinternational.com>",
      to: [adminEmail],
      subject: `[Review Needed] New ${type} Submitted by ${authorName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #111; max-width: 600px; border: 1px solid #eee; border-radius: 16px;">
          <h2 style="color: #f97316; margin-top: 0;">The Refinery International</h2>
          <p style="font-size: 15px; line-height: 1.5;">
            A team member has submitted a new <strong>${type}</strong> for admin review.
          </p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 16px 0;" />
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Contributor:</strong> ${authorName} (${authorEmail})</p>
          <p><strong>Status:</strong> Pending Approval</p>
          <div style="margin-top: 24px;">
            <a href="https://therefineryinternational.com/admin/resources" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
              Review in Admin Dashboard
            </a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email notification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}