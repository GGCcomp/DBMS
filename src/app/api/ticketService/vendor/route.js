import { NextResponse } from "next/server";
import sendEmail from "@/lib/email";
import Imap from 'node-imap';
import { inspect } from 'util';
import connectMongo from "@/lib/db";
import { VendorTicket } from "@/models/ticket";

const imap = new Imap({
    user: 'ashu.t.dev@gmail.com',  // Replace with your email
    password: process.env.SMTP_PASS,    // Replace with your password
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
  });

export async function POST(req) {
  try {
    await connectMongo();
    const { subject, vendorEmail, message } = await req.json();

    // Create ticket in DB
    const ticket = await VendorTicket.create({
      subject,
      vendorEmail,
      messages: [{ sender: "system", content: message }],
    });

    await sendEmail(vendorEmail, subject, message);

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Function to process emails

async function processEmails() {
    await connectMongo();
  
    function openInbox(cb) {
      imap.openBox('INBOX', true, cb);
    }
  
    imap.once('ready', function () {
      openInbox(function (err, box) {
        if (err) throw err;
  
        // Fetch only the latest 2 unseen emails
        imap.search(['UNSEEN'], function (err, results) {
          if (err) throw err;
  
          const latestTwoEmails = results.slice(-2); // Get the last 2 emails
  
          const fetch = imap.fetch(latestTwoEmails, {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
            struct: true,
          });
  
          fetch.on('message', function (msg, seqno) {
            let from, subject;
            let prefix = `( #${seqno} ) `;
  
            msg.on('body', function (stream) {
              let buffer = '';
              stream.on('data', function (chunk) {
                buffer += chunk.toString('utf8');
              });
              stream.once('end', async function () {
                const parsed = Imap.parseHeader(buffer);
                from = parsed.from[0];
                subject = parsed.subject[0];
  
                // Check if a ticket with the same subject and vendorEmail already exists
                const existingTicket = await VendorTicket.findOne({
                  subject: subject,
                  vendorEmail: from
                });
  
                if (existingTicket) {
                  console.log(`Ticket already exists for email: ${subject}`);
                } else {
                  // If no ticket exists, create a new ticket
                  try {
                    const ticket = await VendorTicket.create({
                      subject: subject,
                      vendorEmail: from,
                      messages: [{ sender: "system", content: `Subject: ${subject}` }],
                    });
                    console.log(`Ticket created for email: ${subject}`);
                  } catch (err) {
                    console.log('Error creating ticket:', err);
                  }
                }
              });
            });
  
            msg.once('attributes', function (attrs) {
              console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });
  
            msg.once('end', function () {
              console.log(prefix + 'Finished');
            });
          });
  
          fetch.once('error', function (err) {
            console.log('Fetch error: ' + err);
          });
  
          fetch.once('end', function () {
            console.log('Done fetching messages!');
          });
        });
      });
    });
  
    imap.once('error', function (err) {
      console.log('IMAP Error: ' + err);
    });
  
    imap.once('end', function () {
      console.log('Connection ended');
    });
  
    imap.connect();
  }
  

// Use GET to process unread emails
export async function GET() {
  try {
    await processEmails();
    const tickets = await VendorTicket.find();
    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
