import { NextResponse } from 'next/server';
import connectMongo from "@/lib/db";
import { Leave } from '@/models/announcement';
import { User } from '@/models/user';

export async function GET() {
    try {
        await connectMongo();
        const leaves = await Leave.find({});
        return NextResponse.json(leaves);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something Went Wrong", error })
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