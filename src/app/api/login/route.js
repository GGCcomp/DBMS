import connectMongo from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { User } from "@/models/user";

export async function POST(request) {
    await connectMongo();
    try {
      const { email, password } = await request.json(); 
  
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: "No user found!", ok: false }, { status: 404 });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return NextResponse.json({ message: "Email or password is incorrect!", ok: false }, { status: 401 });
      }
  
      return NextResponse.json({ email: user.email, name: user.name, ok: true }); // Ensure the response contains necessary fields
    } catch (e) {
      console.error("Error during authentication:", e.message);
      return NextResponse.json({ message: "Something went wrong!", error: e.message, ok: false }, { status: 500 });
    }
  };