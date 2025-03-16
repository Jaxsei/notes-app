import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";
import EmailTemplate from "../utils/EmailTemplate.js"; // ✅ Import React Email Component
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP,
  },
});

export const resendEmail = async (email, otp) => {
  const htmlContent = EmailTemplate(email, otp) // ✅ Proper JSX Rendering

  const mailOptions = {
    from: `"CassieTheRailGooner" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Verify Your Email",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new ApiError(400, "Failed to send verification email");
  }
};
