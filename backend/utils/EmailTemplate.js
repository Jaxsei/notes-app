const EmailTemplate = (email, otp) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 500px;
            margin: 30px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
          }
          .otp {
            font-size: 22px;
            font-weight: bold;
            color: #333;
            background: #f8f8f8;
            display: inline-block;
            padding: 10px 20px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            font-size: 12px;
            color: #777;
            margin-top: 20px;
          }
          a {
            color: #4CAF50;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">CassieTheRailGooner</div>
          <p>Dear <strong>${email}</strong>,</p>
          <p>Your verification code is:</p>
          <div class="otp">${otp}</div>
          <p>Please enter this code to complete your verification.</p>
          <p>If you didn’t request this, you can safely ignore this email.</p>
          <div class="footer">
            <p>Need help? <a href="mailto:${process.env.EMAIL_USER}">Contact Support</a></p>
            <p>&copy; 2024 CassieTheRailGooner. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export default EmailTemplate;
