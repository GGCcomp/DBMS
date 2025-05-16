import { NextResponse } from 'next/server';
import connectMongo from "@/lib/db";
import { Leave } from '@/models/announcement';
import { User } from '@/models/user';

export async function GET(req) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 6;

    const total = await Leave.countDocuments();

    const leaves = await Leave.find()
      .skip((page - 1) * limit)
      .limit(limit)

    return NextResponse.json(
      {
        leaves,
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

export async function POST(request) {
    try {
        const payload = await request.json();
        await connectMongo();
        const user = await User.findOne({ email: payload.email });
        const leaveReq = new Leave(payload)
        await leaveReq.save();
        user.leaves.push(leaveReq._id);
        await user.save();
        return NextResponse.json({ message: "Leave Request Posted Sucessfully" }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "SOmething Went Wrong", error })
    }
}