import nodemailer from "nodemailer";

export async function sendInterviewEmails({
  candidateName,
  email,
  position,
  interviewDate,
  meetingLink,
  interviewer,
  interviewerEmail,
}) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Or use SMTP options
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Candidate email
  const candidateMailOptions = {
    from: `"HR Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Interview Scheduled for ${position}`,
    text: `Dear ${candidateName},\n\nYour interview for the position of ${position} has been scheduled on ${interviewDate}.\n\nMeeting Link: ${meetingLink}\n\nBest regards,\nHR Team`,
  };

  // Interviewer(s) email
  const interviewerMailOptions = interviewerEmail.map((intEmail, index) => ({
    from: `"HR Team" <${process.env.EMAIL_USER}>`,
    to: intEmail,
    subject: `Interview Scheduled with ${candidateName}`,
    text: `Dear ${interviewer[index] || "Interviewer"},\n\nYou have been scheduled to interview ${candidateName} for the ${position} role on ${interviewDate}.\n\nMeeting Link: ${meetingLink}\n\nBest regards,\nHR Team`,
  }));

  // Send emails
  await transporter.sendMail(candidateMailOptions);
  await Promise.all(interviewerMailOptions.map((opt) => transporter.sendMail(opt)));
}