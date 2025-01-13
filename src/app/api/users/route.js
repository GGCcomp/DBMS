// /app/api/users/route.js
import { NextResponse } from 'next/server';
import connectMongo from "@/lib/db";
import { User } from '@/models/user';

export async function GET() {
  try {
    await connectMongo();
    const users = await User.find({}, { email: 1, role: 1, name: 1,leaves: 1,_id: 0 }).populate('leaves'); // Select only email and role
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
