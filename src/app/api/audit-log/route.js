import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { AuditLog } from "@/models/user";
import { getServerSession } from "next-auth";

export async function POST(req) {
  await connectMongo();
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { action, details } = await req.json();
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : "Unknown";

    const { name, department, role } = session.user;

    const logEntry = new AuditLog({
      user: { name, department, role },
      action,
      details,
      ipAddress,
    });

    await logEntry.save();

    return NextResponse.json({ message: "Log queued for batch update" }, { status: 202 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};


export async function GET(req) {
  await connectMongo();

  try {
    const { searchParams } = new URL(req.url);
    const filters = {};

    if (searchParams.has("action")) {
      filters.action = searchParams.get("action");
    }

    if (searchParams.has("name")) {
      filters["user.name"] = {
        $regex: new RegExp(searchParams.get("name"), "i"),
      };
    }

    if (searchParams.has("department")) {
      filters["user.department"] = searchParams.get("department");
    }

    if (searchParams.has("startDate") && searchParams.has("endDate")) {
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the entire end date

        filters.createdAt = { $gte: start, $lte: end };
      }
    }

    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    console.log("Filters Applied:", filters);

    const logs = await AuditLog.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({ logs, ok: true }, { status: 200 });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}





