import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import { User } from "@/models/user";

export async function POST(req) {
    try {
        await connectMongo();
        const { email } = await req.json();
        if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

        // Find user
        let user = await User.findOne({ email });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5-minute expiry

        // Update user OTP
        user.approvalOTP = otp;
        user.approvalOTPExpires = otpExpires;
        await user.save();

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "ashu.t.dev@gmail.com", // Use environment variable
                pass: process.env.SMTP_PASS,
            },
        });

        // Email message
        const mailOptions = {
            from: "ashu.t.dev@gmail.com", // Use env variable
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "OTP sent successfully" });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
