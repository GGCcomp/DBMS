import connectMongo from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { User } from "@/models/user";
import { detectFraud } from "@/lib/fraudDetection";

export async function POST(request) {
  await connectMongo();
  try {
    const { email, password, fcmToken } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "No user found!", ok: false }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      await user.save();

      if (user.failedLoginAttempts > 3) {
        await detectFraud(user._id, user.email, { failedLoginAttempts: user.failedLoginAttempts }, "Failed Login");
      }

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // if (fcmToken && fcmToken !== user.fcmToken) {
    //   user.fcmToken = fcmToken;
    //   await user.save();
    // }
    user.failedLoginAttempts = 0;
    await user.save();

    return NextResponse.json({ id: user._id, email: user.email, name: user.name, department: user.department, role: user.role, permission: user.permission, ok: true });
  } catch (e) {
    console.error("Error during authentication:", e.message);
    return NextResponse.json({ message: "Something went wrong!", error: e.message, ok: false }, { status: 500 });
  }
};