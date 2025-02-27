import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import { User } from "@/models/user";

export async function POST(req) {
    try {
        await connectMongo();
        const { email, enteredOTP } = await req.json();

        if (!email || !enteredOTP) {
            return NextResponse.json({ error: "Email & OTP are required" }, { status: 400 });
        }

        // Find the user
        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Check OTP validity
        if (!user.approvalOTP || user.approvalOTP !== enteredOTP) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        if (user.approvalOTPExpires < new Date()) {
            return NextResponse.json({ error: "OTP expired" }, { status: 400 });
        }

        // ✅ OTP is valid → Clear OTP fields
        user.approvalOTP = null;
        user.approvalOTPExpires = null;
        await user.save();

        return NextResponse.json({ success: true, message: "OTP verified successfully" });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
