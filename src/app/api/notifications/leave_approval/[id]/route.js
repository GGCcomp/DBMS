import { NextResponse } from 'next/server';
import { User } from '@/models/user';
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.SERVICE_KEY);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(req, { params }) {
    try {
      const body = await req.json(); // Parse request body
      const { id } = params; // Extract user ID (email in this case) from params
      const { title, body: messageBody, link } = body; // Destructure notification data
  
      // Fetch the user with the given email
      const user = await User.findOne({ email: id });
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
  
      const token = user.fcmToken; // Get FCM token
      //console.log("FCM Token:", token);
  
      // Validate the required fields
      if (!token || !title || !messageBody || !link) {
        return NextResponse.json(
          { error: "Missing required fields or FCM token is invalid" },
          { status: 400 }
        );
      }
  
      // Create the notification payload
      const notificationPayload = {
        notification: {
          title,
          body: messageBody,
        },
        android: {
          notification: {
            click_action: link,
          },
        },
        webpush: {
          notification: {
            click_action: link,
          },
        },
      };
  
      // Send the notification to the single token
      try {
        const response = await admin.messaging().send({
          token, 
          notification: notificationPayload.notification,
          android: notificationPayload.android,
          webpush: notificationPayload.webpush,
        });
  
        //console.log("Notification Response:", response);
        return NextResponse.json(
          { message: "Notification sent successfully", response, ok: true },
          { status: 200 }
        );
      } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json(
          { error: "Failed to send notification", details: error.message },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      return NextResponse.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    }
  }
  
