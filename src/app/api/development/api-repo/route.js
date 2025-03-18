import { NextResponse } from 'next/server';
import connectMongo from "@/lib/db";
import { ApiRepo } from '@/models/development'; // Mongoose model for logs

// GET Logs
export async function GET() {
    await connectMongo();
    const logs = await ApiRepo.findOne({}); // Use `.findOne()` to return a single object
    return NextResponse.json(logs || {
        documentation: [],
        versionControl: [],
        testingLogs: [],
        integrations: []
    });
}


// POST a new log
export async function POST(req) {
    await connectMongo();
    const { type, data } = await req.json();
    const updatedLog = await ApiRepo.findOneAndUpdate(
        {},
        { $push: { [type]: data } },
        { new: true, upsert: true }
    );
    return NextResponse.json(updatedLog);
}

// DELETE a log entry
export async function DELETE(req) {
    await connectMongo();
    const { type, index } = await req.json();
    const log = await ApiRepo.findOne({});
    log[type].splice(index, 1);
    await log.save();
    return NextResponse.json({ message: 'Deleted successfully' });
}
