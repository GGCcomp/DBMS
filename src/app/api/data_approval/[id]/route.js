import connectMongo from "@/lib/db";
import { Approval } from "@/models/approval";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    await connectMongo(); // Ensure the database connection
  
    try {
      const { id } = params;
      
      console.log(id);
      
      const { approval } = await request.json(); // Extract the `approval` value from the request body
  
      if (!id) {
        return NextResponse.json({ success: false, error: "ID is required" });
      }
  
      if (!['approved', 'rejected', 'pending'].includes(approval)) {
        return NextResponse.json({ 
          success: false, 
          error: "Invalid approval status. Allowed values: 'approved', 'rejected', 'pending'" 
        });
      }
  
      const updated = await Approval.findByIdAndUpdate(
        id,
        { $set: { approval, content: [] } },
        { new: true } // Return the updated document
      );
  
      if (!updated) {
        return NextResponse.json({ success: false, error: "Record not found" });
      }
  
      return NextResponse.json({ success: true, data: updated });
  
    } catch (error) {
      console.error("Error updating approval:", error);
      return NextResponse.json({ success: false, error: "Failed to update approval" });
    }
  }

  export async function GET(req, {params}) {
     try{
      const {id} = params;
      const approvalData = await Approval.find({email: id});
      return NextResponse.json(approvalData);
     }catch(err){
      console.log(err);
     }
  }
  