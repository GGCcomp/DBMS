import { NextResponse } from 'next/server';
import connectMongo from "@/lib/db";
import { Invitation } from '@/models/invitation';

export async function GET() {
  try {
    await connectMongo();
    const invitations = await Invitation.find({}, { email: 1, role: 1, expiryDate: 1, _id: 0 });
    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
