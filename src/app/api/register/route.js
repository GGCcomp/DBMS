import connectMongo from "@/lib/db";
import { User } from '@/models/user';
import { Invitation } from '@/models/invitation';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { NextResponse } from 'next/server';


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Extract the role
        const { email, department, role } = decoded;

        return NextResponse.json({ message: "Token verified", email, department, role }, { status: 200 });
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }
}


export async function POST(req) {
    try {
        const { name, email, password, department, role, token } = await req.json();

        if (!name || !email || !password || !department || !role) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        await connectMongo();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Optional: Validate the token for invited users
        if (token) {
            const invitation = await Invitation.findOne({ token, isUsed: false });
            if (!invitation || invitation.role !== role) {
                return NextResponse.json({ error: 'Invalid or expired invitation token' }, { status: 400 });
            }
            invitation.isUsed = true;
            await invitation.save();
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({ name, email, password: hashedPassword, department, role });

        return NextResponse.json({ message: 'User registered successfully', user }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
