import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
  });
}

const from =
  process.env.SMTP_FROM ||
  process.env.SMTP_USER ||
  "EDSEC ICT Institute <no-reply@edsecict.com>";

export async function sendEdsecEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn("EDSEC_EMAIL_NOT_CONFIGURED", { to, subject });
    return { sent: false, configured: false };
  }

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return { sent: true, configured: true };
}

export async function sendApplicantActivationEmail({
  to,
  name,
  course,
  activationUrl,
}: {
  to: string;
  name: string;
  course: string;
  activationUrl: string;
}) {
  return sendEdsecEmail({
    to,
    subject: "Complete your EDSEC applicant account setup",
    text: `Hello ${name},\n\nYour application for ${course} has been received by EDSEC ICT Institute. Set your password using this secure link:\n\n${activationUrl}\n\nThe link expires in 72 hours.\n\nEDSEC ICT Institute\nInnovate. Educate. Elevate.`,
    html: `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a"><div style="max-width:620px;margin:40px auto;background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:32px"><h1 style="margin:0;color:#0f4fd8">EDSEC ICT Institute</h1><p style="color:#64748b">Innovate. Educate. Elevate.</p><h2>Your application has been received</h2><p>Hello ${escapeHtml(name)},</p><p>Thank you for applying for <strong>${escapeHtml(course)}</strong>. We have created your EDSEC applicant account.</p><p>Set your password to access your applicant portal and track your application:</p><p><a href="${escapeAttribute(activationUrl)}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 20px;border-radius:10px;font-weight:700">Set My Password</a></p><p style="color:#64748b;font-size:13px">This secure setup link expires in 72 hours.</p><p>EDSEC ICT Institute</p></div></body></html>`,
  });
}

export async function sendApplicationApprovedEmail({
  to,
  name,
  course,
  studentNumber,
  activationUrl,
}: {
  to: string;
  name: string;
  course: string;
  studentNumber: string;
  activationUrl?: string;
}) {
  const setupBlock = activationUrl
    ? `<p><a href="${escapeAttribute(activationUrl)}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 20px;border-radius:10px;font-weight:700">Set My Password</a></p><p style="color:#64748b;font-size:13px">Use this secure link to create your password before signing in.</p>`
    : `<p>Your EDSEC account is ready. Sign in using the password you already set.</p>`;

  return sendEdsecEmail({
    to,
    subject: "Your EDSEC application has been approved",
    text: `Hello ${name},\n\nCongratulations. Your application for ${course} has been approved.\nStudent number: ${studentNumber}\n\n${activationUrl ? `Set your password here: ${activationUrl}\n\n` : ""}You can then sign in to your EDSEC student dashboard.\n\nEDSEC ICT Institute`,
    html: `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a"><div style="max-width:620px;margin:40px auto;background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:32px"><h1 style="margin:0;color:#0f4fd8">Application Approved</h1><p>Hello ${escapeHtml(name)},</p><p>Congratulations. Your application for <strong>${escapeHtml(course)}</strong> has been approved.</p><div style="background:#eff6ff;border-radius:12px;padding:16px"><strong>Student Number:</strong> ${escapeHtml(studentNumber)}</div>${setupBlock}<p>You are now part of the EDSEC student community.</p><p>EDSEC ICT Institute<br>Innovate. Educate. Elevate.</p></div></body></html>`,
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value);
}
