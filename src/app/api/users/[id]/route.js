import { NextResponse } from 'next/server';
import connectMongo from "@/lib/db";
import { User } from '@/models/user';

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

export async function DELETE(req, {params}){
    try{
        await connectMongo();
        const {id} = params;
        await User.findByIdAndDelete(id)
        return NextResponse.json({ok: true});
    }catch(err){
        return NextResponse.json({ error: "Error removing user:", err }, { status: 500 })
    }
}