import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import nodemailer from 'nodemailer';

// Configure SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 465,
  secure: true, //ssl
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS,
  }
});

export async function POST(req) {
  const body = await req.json();

  // Load the offer letter template
  const templatePath = path.join(process.cwd(), 'public', 'interns_joining_letter.docx');
  let content;
  try {
    content = fs.readFileSync(templatePath, 'binary');
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Template file not found.' }, { status: 500 });
  }

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  doc.setData({
    globe: "🌐",
    cal: "📅",
    candidate_name: body.candidate_name.toUpperCase(),
    position: body.position.toUpperCase(),
    department: body.department.toUpperCase(),
    lead_name: body.lead_name.toUpperCase(),
    lead_department: body.lead_department.toUpperCase(),
    application_date: body.application_date,
    commence_date: body.commence_date,
    mode: body.mode.toUpperCase()
  });

  try {
    doc.render();
  } catch (err) {
    return NextResponse.json({ error: 'Failed to render template.' }, { status: 500 });
  }

  const offerLetterBuffer = doc.getZip().generate({ type: 'nodebuffer' });

  // Load NDA PDF
  const ndaPath = path.join(process.cwd(), 'public', 'NDA_InnateGamma.pdf');
  let ndaBuffer;
  try {
    ndaBuffer = fs.readFileSync(ndaPath);
  } catch (err) {
    return NextResponse.json({ error: 'NDA file not found.' }, { status: 500 });
  }

  // Send email
  try {
    await transporter.sendMail({
      from: `"HR Department" <${process.env.EMAIL_USER}>`,
      to: body.email,
      subject: `Joining Letter and NDA - ${body.candidate_name}`,
      text: `Greetings - ${body.candidate_name},

Please find attached your Joining letter and the Non-Disclosure Agreement (NDA). We kindly request you to review, sign, and return the documents as confirmation of your acceptance.

As part of the onboarding process, please complete the following steps:

1. Update Your LinkedIn Profile: Kindly update your role and list ‘Nivesh Jano’ as your employer on LinkedIn.

2. Register on Our Website: Visit www.niveshjano.in and register either using DigiLocker (preferred) or by filling out the form manually.

3. Join IGVerse Platform: Once the above steps are completed, we will share a link to join IGVerse. You will use this portal to submit project reports and log your attendance.

Please feel free to reach out if you have any questions.

Human Resource
Nivesh Jano`,
      attachments: [
        {
          filename: `Offer_Letter_${body.candidate_name}.docx`,
          content: offerLetterBuffer,
          contentType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
        {
          filename: 'NDA_InnateGamma.pdf',
          content: ndaBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({ message: 'Email with attachments sent successfully.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}
