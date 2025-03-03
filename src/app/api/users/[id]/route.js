import { NextResponse } from 'next/server';
import connectMongo from "@/lib/db";
import { User } from '@/models/user';

export async function GET(req, { params }) {
  try {
    await connectMongo();
    const { id } = params;
    const user = await User.findById(id).select("-password -fcmToken");
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: "Error finding user", err })
  }
};

export async function PATCH(req, { params }) {
  try {
    await connectMongo();
    const { id } = params;
    const { permission } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(id, { permission }, { new: true });

    if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, permission: updatedUser.permission });
  } catch (error) {
    return NextResponse.json({ error: "Error updating permission" }, { status: 500 });
  }
};

export async function PUT(req, {params}) {
  try{
    await connectMongo();
    const { id } = params;
    const { email, mobile } = await req.json();
    const updatedUser = await User.findByIdAndUpdate(id, { email, mobile }, { new: true }).select("-password -fcmToken");
    return NextResponse.json(updatedUser);
  }catch(err){
    return NextResponse.json({error: "Error updating", err})
  }
};

export async function DELETE(req, { params }) {
  try {
    await connectMongo();
    const { id } = params;
    await User.findByIdAndDelete(id)
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Error removing user:", err }, { status: 500 })
  }
}