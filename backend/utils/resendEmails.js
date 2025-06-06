import nodemailer from "nodemailer";
import { ApiError } from './ApiError.js';
import EmailTemplate from '../utils/EmailTemplate.js';
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP,
    },
});
/**
 * Sends a verification email with the given OTP
 * @param email - Recipient's email address
 * @param otp - One-time password to send
 */
export const resendEmail = async (email, otp) => {
    try {
        const htmlContent = EmailTemplate(email, otp); // React Email Component as HTML
        const mailOptions = {
            from: `"CassieTheRailGooner" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🔐 Verify Your Email",
            html: htmlContent,
        };
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully");
    }
    catch (error) {
        console.error("❌ Error sending email:", error.message || error);
        throw new ApiError(400, "Failed to send verification email");
    }
};
//# sourceMappingURL=resendEmails.js.map