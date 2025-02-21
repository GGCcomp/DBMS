import { NextResponse } from 'next/server';
import connectMongo from "@/lib/db";
import { User } from '@/models/user';

export async function GET() {
  try {
    await connectMongo();
    const users = await User.find({}, { fcmToken: 0, updatedAt: 0, __v: 0 }) 
      .populate("leaves");

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

