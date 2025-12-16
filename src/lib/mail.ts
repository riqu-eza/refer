import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendResetEmail(
  to: string,
  resetLink: string
) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>
          Click the button below to reset it:
        </p>
        <p>
          <a
            href="${resetLink}"
            style="
              display: inline-block;
              padding: 10px 16px;
              background: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 4px;
            "
          >
            Reset Password
          </a>
        </p>
        <p>
          This link expires in <strong>30 minutes</strong>.
        </p>
        <p>
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
