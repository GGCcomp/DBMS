import { NextResponse } from 'next/server';
import connectMongo from "@/lib/db";
import { Invitation } from '@/models/invitation';

export async function GET(req) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 6;

    const total = await Invitation.countDocuments();

    const invitations = await Invitation.find(
      {},
      { email: 1, role: 1, expiryDate: 1, _id: 0 }
    )
      .sort({ createdAt: -1 }) 
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json(
      {
        invitations,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching invitations:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
