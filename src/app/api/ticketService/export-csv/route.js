import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import connectMongo from "@/lib/db";
import { Ticket } from "@/models/ticket";

export const runtime = "nodejs"; 

export async function GET() {
  try {
    await connectMongo();
    const tickets = await Ticket.find().lean().populate("agentId");

    // ✅ 1. Launch Puppeteer
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // ✅ 2. Create HTML for the PDF
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h2>Ticket Report</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Agent</th>
                <th>Created At</th>
                <th>Closed At</th>
              </tr>
            </thead>
            <tbody>
              ${tickets
                .map(
                  (ticket) => `
                <tr>
                  <td>${ticket.subject}</td>
                  <td>${ticket.status}</td>
                  <td>${ticket.priority}</td>
                  <td>${ticket.agentId.name || "Unassigned"}</td>
                  <td>${new Date(ticket.createdAt).toLocaleString()}</td>
                  <td>${new Date(ticket.closedAt).toLocaleString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // ✅ 3. Set page content and generate PDF
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: "A4" });

    // ✅ 4. Close Puppeteer
    await browser.close();

    // ✅ 5. Return PDF Response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="ticket_report.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
