import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export async function POST(req) {
  const body = await req.json();

  // Absolute path to your template in the /app/api/utils directory
  const templatePath = path.join(process.cwd(), 'src', 'app', 'api', 'utils', 'interns_joining_letter.docx');

  let content;
  try {
    content = fs.readFileSync(templatePath, 'binary');
  } catch (err) {
    console.log(err);
    
    return NextResponse.json({ error: 'Template file not found.' }, { status: 500 });
  }

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  // Set dynamic data from frontend
  doc.setData({
    candidate_name: body.candidate_name.toUpperCase(),
    position: body.position.toUpperCase(),
    department: body.department.toUpperCase(),
    lead_name: body.lead_name.toUpperCase(),
    lead_department: body.lead_department.toUpperCase(),
    application_date: body.application_date,
    commence_date: body.commence_date,
  });

  try {
    doc.render();
  } catch (error) {
    console.log(err);
    return NextResponse.json({ error: 'Failed to render template.', error }, { status: 500 });
  }

  const buffer = doc.getZip().generate({ type: 'nodebuffer' });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename=Offer_Letter_${body.candidate_name}.docx`,
    },
  });
}

//NDA Download Route
export async function GET() {
  const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'utils', 'NDA_InnateGamma.pdf');

  try {
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="NDA(Innate Gamma).pdf"',
      },
    });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error: 'File not found.' }, { status: 404 });
  }
}
