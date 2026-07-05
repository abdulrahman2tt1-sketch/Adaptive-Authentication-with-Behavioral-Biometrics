const { BrevoClient } = require("@getbrevo/brevo");

const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

/**
 * Send a 6-digit OTP code to the user's email via Brevo transactional email.
 * @param {string} toEmail - recipient email address
 * @param {string} toName  - recipient display name
 * @param {string} otp     - the plain 6-digit code
 */
async function sendOTPEmail(toEmail, toName, otp) {
  const result = await client.transactionalEmails.sendTransacEmail({
    sender: {
      name: "LearnHub Security",
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [{ email: toEmail, name: toName || toEmail }],
    subject: "Your LearnHub Verification Code",
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f9;padding:40px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden;">
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">🔐 Verification Code</h1>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6;">
                      Hi <strong>${toName || "there"}</strong>,
                    </p>
                    <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">
                      Use the code below to complete your sign-in to <strong>LearnHub</strong>:
                    </p>
                    <!-- OTP Box -->
                    <div style="text-align:center;margin:0 0 24px;">
                      <div style="display:inline-block;background:#f0f0ff;border:2px dashed #6366f1;border-radius:12px;padding:16px 40px;letter-spacing:12px;font-size:36px;font-weight:800;color:#6366f1;">
                        ${otp}
                      </div>
                    </div>
                    <p style="margin:0 0 8px;color:#6b7280;font-size:14px;line-height:1.5;">
                      This code expires in <strong>5 minutes</strong>.
                    </p>
                    <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.5;">
                      If you didn't request this, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
                    <p style="margin:0;color:#9ca3af;font-size:12px;">
                      &copy; ${new Date().getFullYear()} LearnHub. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });

  return result;
}

module.exports = { sendOTPEmail };
