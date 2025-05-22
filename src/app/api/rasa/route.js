import { NextResponse } from "next/server";
import { Rasa } from "@/models/rasa";
import connectMongo from "@/lib/db";


export async function GET() {
  await connectMongo();

  try {
    const questions = await Rasa.find();
    console.log(questions);
    return NextResponse.json(questions, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch Rasa questions:", err);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}