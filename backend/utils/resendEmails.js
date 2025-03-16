import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";
import { asyncHandler } from "./asyncHandler.js";
import EmailTemplate from "./EmailTemplate.js"; // ✅ Import the new template
import dotenv from "dotenv";
dotenv.config();

//console.log("EMAIL_USER:", process.env.EMAIL_USER);
//console.log("EMAIL_APP:", process.env.EMAIL_APP);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_APP, // App Password
  },
});

export const resendEmail = async (email, otp) => {
  const htmlContent = EmailTemplate(email, otp); // ✅ Get HTML string

  //console.log('email:', email);
  const mailOptions = {
    from: `"CassieTheRailGooner" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Verify Your Email",
    html: htmlContent, // ✅ Use the generated HTML
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new ApiError(400, "Failed to send verification email");
  }
};
