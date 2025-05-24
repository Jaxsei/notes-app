const EmailTemplate = (email, otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Email Verification</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

    body {
      font-family: 'Inter', sans-serif;
      background: #f8fafc;
      margin: 0;
      padding: 40px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .container {
      max-width: 480px;
      background: #ffffff;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.1);
      text-align: center;
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #1d4ed8, #3b82f6);
      padding: 20px;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      color: white;
      font-size: 20px;
      font-weight: 700;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-top: 10px;
    }
    .text {
      font-size: 16px;
      color: #64748b;
      margin-top: 10px;
    }
    .otp-container {
      margin: 20px auto;
      padding: 12px;
      background: #f1f5f9;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 3px;
      color: #334155;
      width: 60%;
    }
    .button {
      background: #1d4ed8;
      color: #ffffff;
      padding: 12px 18px;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      display: inline-block;
      margin-top: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: all 0.3s;
    }
    .button:hover {
      background: #2563eb;
    }
    .note {
      font-size: 14px;
      color: #94a3b8;
      margin-top: 12px;
    }
    .footer {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 20px;
    }
    .link {
      color: #1d4ed8;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">CassieTheRailGooner</div>

    <p class="greeting">Hello, <strong>${email}</strong></p>
    <p class="text">Here is your email verification code:</p>

    <div class="otp-container">${otp}</div>

    <p class="text">Enter this code in the app to complete your verification.</p>

    <a href="#" class="button">Verify Email</a>

    <p class="note">If you didn’t request this, you can safely ignore this email.</p>

    <p class="footer">
      Need help? <a href="mailto:support@example.com" class="link">Contact Support</a>
    </p>
    <p class="footer">&copy; 2024 CassieTheRailGooner. All rights reserved.</p>
  </div>
</body>
</html>
`
    ;
};

export default EmailTemplate;
