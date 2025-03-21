import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import { PaymentDetail } from "@/models/paymentDetail";

export async function GET(req) {
  await connectMongo();

  try {
    const { searchParams } = new URL(req.url);
    const filters = {};

    if (searchParams.has("createdAt")) {
      const createdAt = new Date(searchParams.get("createdAt"));
      filters.createdAt = { $gte: createdAt }; 
    }
    if (searchParams.has("productName")) {
      filters.productName = new RegExp(searchParams.get("productName"), "i"); 
    }
    if (searchParams.has("email")) {
      filters.email = searchParams.get("email");
    }
    if (searchParams.has("userId")) {
      filters.userId = searchParams.get("userId");
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = 5;
    const skip = (page - 1) * limit;

    const payments = await PaymentDetail.find(filters).skip(skip).limit(limit);

    const totalCount = await PaymentDetail.countDocuments(filters);

    return NextResponse.json({
      data: payments,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (err) {
    return NextResponse.json({ message: "Something went wrong!", error: err.message }, { status: 500 });
  }
}
