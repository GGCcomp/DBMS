import { NextResponse } from 'next/server';
import { User } from '@/models/user';
import admin from 'firebase-admin';

// Parse the service account JSON from the environment variable
const serviceAccount = JSON.parse(process.env.SERVICE_KEY);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, body: messageBody, link } = body;

    const users = await User.find({ role: { $ne: 'admin' } });

    // Extract FCM tokens for all admins
    const tokens = users.map((user) => user.fcmToken).filter(Boolean);

    // Validate required fields
    if (!tokens.length || !title || !messageBody || !link) {
      return NextResponse.json(
        { error: 'Missing required fields or no valid admin tokens found' },
        { status: 400 }
      );
    }

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

    // Send notifications one by one
    const results = [];
    for (const token of tokens) {
      try {
        const response = await admin.messaging().send({
          token,
          ...notificationPayload,
        });
        results.push({ token, status: 'success', response });
      } catch (error) {
        results.push({ token, status: 'error', error: error.message });
      }
    }

    return NextResponse.json(
      { message: 'Notifications processed', results, ok: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification', details: error.message },
      { status: 500 }
    );
  }
}
