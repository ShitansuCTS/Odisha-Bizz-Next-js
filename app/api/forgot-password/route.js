import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/UserModel";
import { connectDB } from "@/lib/dbConnect";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 🔐 Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 Min

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    const resetLink = `${process.env.BASE_URL}/admin/reset-password/${resetToken}`;

    // 📧 Send Email using Resend
    await resend.emails.send({
      from: "Odisha Biz <noreply@odishabiz.com>",
      to: user.email,
      subject: "Password Reset Request",
      html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#012a7a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#012a7a;padding: 20px 0;">
      <tr>
        <td align="center">
          <!-- Main Container -->
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td style="background-color:#b6985a;padding:30px;text-align:center;color:#ffffff;font-size:24px;font-weight:bold;">
                Odisha Biz
              </td>
            </tr>
            
            <!-- Body -->
            <tr>
              <td style="padding:40px;color:#333333;line-height:1.6;font-size:16px;">
                <p>Hello <strong>${user.name || "User"}</strong>,</p>
                <p>We received a request to reset your password. Click the button below to set a new password:</p>
                
                <p style="text-align:center;margin:30px 0;">
                  <a href="${resetLink}" style="padding:12px 25px; background:#012a7a; color:white;text-decoration:none;border-radius:5px;font-weight:bold;display:inline-block;">
                    Reset Password
                  </a>
                </p>
                
                <p>If you did not request this, please ignore this email.</p>
                
                <p style="color:#999999;font-size:14px;">This link will expire in 15 minutes for your security.</p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color:#f9f9f9;padding:20px;text-align:center;color:#777777;font-size:12px;">
                &copy; ${new Date().getFullYear()} Odisha Biz. All rights reserved.<br>
                <a href="https://odishabiz.com" style="color:#b6985a;text-decoration:none;">Visit our website</a>
              </td>
            </tr>
          </table>
          <!-- End Main Container -->
        </td>
      </tr>
    </table>
  </body>
  </html>
      `
    });

    return NextResponse.json({ message: "Reset link sent successfully!" });

  } catch (err) {
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}
