import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true, //ssl
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function sendEmail(to, subject, text) {
    try {
        await transporter.sendMail({
            from: "Support Team",
            to,
            subject,
            text,
        });
        console.log("✅ Email sent successfully");
    } catch (error) {
        console.error("❌ Email sending failed:", error);
    }
}

module.exports = sendEmail;