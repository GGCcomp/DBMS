import { NextResponse } from 'next/server';
import connectMongo from "@/lib/db";
import { Leave } from '@/models/announcement';

export async function GET(req, {params}){
  try{
    const {id} = params;
    await connectMongo();
    const leaves = await Leave.find({email: id});
    return NextResponse.json(leaves);
  }catch(err){
    console.log(err);
    return NextResponse.json({message: "something went wrong", error: err.message})
  }
}

export async function PATCH(req, { params }) {
    try {
      const { id } = params; // Extract the `id` from the URL parameters
      const { approval } = await req.json(); // Extract the approval status from the request body
  
      // Validate the approval value
      if (!['approved', 'rejected'].includes(approval)) {
        return NextResponse.json({ message: 'Invalid approval value' }, { status: 400 });
      }
  
      // Connect to MongoDB
      await connectMongo();
  
      // Find and update the leave request with the given ID
      const updatedLeave = await Leave.findByIdAndUpdate(
        id,
        { approval }, // Update the approval status
        { new: true } // Return the updated document
      );
  
      // If the leave request wasn't found
      if (!updatedLeave) {
        return NextResponse.json({ message: 'Leave request not found' }, { status: 404 });
      }
  
      // Return the updated leave request
      return NextResponse.json(updatedLeave);
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
    }
  }

  export async function PUT(req, {params}){
    try{
      const { id } = params; // Extract the `id` from the URL parameters
      const payload = await req.json();
      await connectMongo();

      const updatedLeave = await Leave.findByIdAndUpdate(
        id,
        { $set: payload }, // Update the approval status
        { new: true } // Return the updated document
      );

      if (!updatedLeave) {
        return NextResponse.json({ message: 'Leave request not found' }, { status: 404 });
      }

      return NextResponse.json({ok: true});
    }catch(error){
      return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
    }
  }