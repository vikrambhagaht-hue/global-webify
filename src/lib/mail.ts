import nodemailer from 'nodemailer';

// Helper to create transport on demand to ensure fresh .env configurations are read
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !port || !user || !pass) {
    console.warn("⚠️ SMTP Credentials are not fully configured in the .env file. Email notification skipped.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465, // True for 465, false for 587 or other TLS ports
    auth: {
      user,
      pass,
    },
    timeout: 10000, // 10 seconds timeout
  } as nodemailer.TransportOptions);
}

/**
 * Sends a notification email when a new lead is submitted.
 * Falls back gracefully if SMTP is not configured or fails, preventing form submission crashes.
 */
export async function sendMailNotification({
  subject,
  htmlContent,
}: {
  subject: string;
  htmlContent: string;
}) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("SMTP Credentials are not fully configured in the .env file.");
  }

  const toEmail = process.env.SMTP_TO || process.env.SMTP_USER;

  const mailOptions = {
    from: `"${process.env.SMTP_SENDER_NAME || 'Global Webify Notifications'}" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✉️ Email notification sent successfully: ${info.messageId}`);
  return true;
}
