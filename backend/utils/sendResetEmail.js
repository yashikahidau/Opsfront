const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendResetEmail(
  email,
  name,
  resetLink
) {
  await transporter.sendMail({
    from: `"Opsfront" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "Reset your Opsfront password",

    html: `
      <div
        style="
          max-width:600px;
          margin:auto;
          padding:40px;
          background:#121212;
          color:#ffffff;
          font-family:Arial,sans-serif;
          border-radius:18px;
        "
      >
        <h2 style="margin-bottom:12px;">
          Hi ${name},
        </h2>

        <p style="line-height:1.7;">
          We received a request to reset your
          password.
        </p>

        <p style="line-height:1.7;">
          Click the button below to create a new
          password.
        </p>

        <div
          style="
            margin:36px 0;
            text-align:center;
          "
        >
          <a
            href="${resetLink}"
            style="
              display:inline-block;
              background:#ffb048;
              color:#111;
              padding:14px 28px;
              text-decoration:none;
              border-radius:12px;
              font-weight:bold;
            "
          >
            Reset Password
          </a>
        </div>

        <p
          style="
            color:#9ca3af;
            line-height:1.7;
          "
        >
          This link expires in 15 minutes.
        </p>

        <p
          style="
            color:#9ca3af;
            line-height:1.7;
          "
        >
          If you didn't request this, you can safely
          ignore this email.
        </p>

        <hr
          style="
            border:none;
            border-top:1px solid #2d2d2d;
            margin:30px 0;
          "
        />

        <p
          style="
            color:#777;
            font-size:12px;
          "
        >
          © Opsfront
        </p>
      </div>
    `,
  });
}

module.exports = sendResetEmail;