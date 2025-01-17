import connectMongo from "@/lib/db";
import { Approval } from "@/models/approval";
import { NextResponse } from "next/server";

export async function GET(request) {
    await connectMongo();
  
    try {
      // Parse query parameters for pagination
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page')) || 1; // Default to page 1
      const limit = parseInt(searchParams.get('limit')) || 10; // Default to 10 items per page
  
      // Calculate the starting index
      const skip = (page - 1) * limit;
  
      // Fetch the paginated data
      const approvalData = await Approval.find({})
        .skip(skip)
        .limit(limit)
        .exec();
  
      // Get the total count for pagination metadata
      const totalItems = await Approval.countDocuments({});
      const totalPages = Math.ceil(totalItems / limit);
  
      return NextResponse.json({
        success: true,
        approvalData,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      console.error("Error fetching approval data:", error);
      return NextResponse.json({ success: false, error: "Failed to fetch data" });
    }
  }
  

export async function POST(request) {
    await connectMongo();

    try {
        const payload = await request.json();
        
       const approvalData = new Approval(payload);
       await approvalData.save();

       return NextResponse.json({ success: true, message: "Data sent for approval" });

    } catch (error) {
        console.error("Error saving post:", error);
        return NextResponse.json({ success: false, error: "Failed to save post" });
    }
}