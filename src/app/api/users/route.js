import { NextResponse } from 'next/server';
import connectMongo from "@/lib/db";
import { User } from '@/models/user';

export async function GET(req) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 6;

    const total = await User.countDocuments();

    const users = await User.find()
      .populate("leaves")
      .skip((page - 1) * limit)
      .limit(limit)

    return NextResponse.json(
      {
        users,
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
    console.error("❌ Error fetching users:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

