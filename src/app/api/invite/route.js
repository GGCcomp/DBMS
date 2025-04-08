import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import connectMongo from "@/lib/db";
import { Invitation } from "@/models/invitation";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, department, role } = await request.json();
    if (!email || !role || !department) {
      return NextResponse.json({ error: "Email and role are required" }, { status: 400 });
    }

    let privateKey = Math.floor(1000 + Math.random() * 9000); 
    privateKey = `IG-${privateKey}`;

    // Connect to the database
    await connectMongo();

    // Generate a token (JWT)
    const token = jwt.sign(
      { email, department, role },
      process.env.JWT_SECRET, // Use a secret key from your environment variables
      { expiresIn: "24h" } // Token valid for 24 hours
    );

    await Invitation.create({ email, department, role, token, expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),  privateKey });

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ashu.t.dev@gmail.com",
        pass: process.env.SMTP_PASS,
      },
    });

    // Compose the email content
    const mailOptions = {
      from: "ashu.t.dev@gmail.com",
      to: email,
      subject: "Invitation to Join",
      html: `
        <p>Hello, ${email}</p>
        <p>You have been invited to join our platform as a <strong>${role}</strong> in <strong>${department}</strong> department.</p>
        <p>Please click the link below to complete your registration:</p>
        <a href="${process.env.NEXT_PUBLIC_HOST_URL}/register?token=${token}">Complete Registration</a>
        <p>This is your private key: ${privateKey}, Please use it to register yourself.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Thank you,</p>
        <p>Nivesh Jano Team</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Invitation created and email sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending email:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
