const EmailTemplate = (email, otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Email Verification - CassieTheRailGooner</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 20px;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .email-wrapper {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 8px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 520px;
      width: 100%;
    }

    .container {
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      position: relative;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 32px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.3;
    }

    .header-content {
      position: relative;
      z-index: 1;
    }

    .logo-container {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 16px 32px;
      display: inline-block;
      margin-bottom: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .logo {
      color: #ffffff;
      font-size: 28px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .tagline {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      font-weight: 500;
      margin: 0;
      opacity: 0.8;
    }

    .content {
      padding: 48px 32px;
      text-align: center;
    }

    .greeting {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 12px 0;
      line-height: 1.3;
    }

    .greeting .email-highlight {
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 16px;
      color: #64748b;
      margin: 0 0 32px 0;
      line-height: 1.5;
    }

    .otp-section {
      margin: 32px 0;
      position: relative;
    }

    .otp-label {
      font-size: 16px;
      font-weight: 600;
      color: #475569;
      margin: 0 0 16px 0;
    }

    .otp-container {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border: 3px dashed #cbd5e1;
      border-radius: 20px;
      padding: 32px 24px;
      margin: 0 auto 16px;
      max-width: 300px;
      position: relative;
    }

    .otp-container::before {
      content: '🔐';
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      background: #ffffff;
      padding: 8px 12px;
      border-radius: 50%;
      font-size: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .otp-code {
      background: #ffffff;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
      display: inline-block;
      border: 2px solid #e2e8f0;
    }

    .otp-digits {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #1e293b;
      font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
      margin: 0;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .otp-expiry {
      font-size: 14px;
      color: #f59e0b;
      margin: 12px 0 0 0;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .instructions {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 16px;
      padding: 24px;
      margin: 32px 0;
      border: 1px solid #bae6fd;
      text-align: left;
    }

    .instructions-title {
      font-size: 16px;
      font-weight: 700;
      color: #0c4a6e;
      margin: 0 0 12px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .instructions-list {
      font-size: 14px;
      color: #0369a1;
      line-height: 1.6;
      margin: 0;
    }

    .button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 14px;
      font-size: 16px;
      font-weight: 700;
      display: inline-block;
      margin: 24px 0;
      box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px -5px rgba(102, 126, 234, 0.5);
    }

    .security-notice {
      background: linear-gradient(135deg, #fef3cd 0%, #fde68a 100%);
      border: 2px solid #f59e0b;
      border-radius: 12px;
      padding: 20px;
      margin: 32px 0;
      text-align: left;
    }

    .security-notice-content {
      font-size: 14px;
      color: #92400e;
      margin: 0;
      line-height: 1.5;
      font-weight: 500;
    }

    .footer-section {
      background: #f8fafc;
      padding: 32px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
    }

    .note {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 16px 0;
      line-height: 1.5;
    }

    .support-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s ease;
    }

    .support-link:hover {
      color: #764ba2;
    }

    .footer {
      font-size: 13px;
      color: #94a3b8;
      margin: 8px 0 0 0;
      line-height: 1.4;
    }

    .divider {
      width: 60px;
      height: 4px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 2px;
      margin: 24px auto;
      opacity: 0.6;
    }

    @media (max-width: 600px) {
      body {
        padding: 10px;
      }
      
      .content {
        padding: 32px 24px;
      }
      
      .greeting {
        font-size: 20px;
      }
      
      .otp-digits {
        font-size: 28px;
        letter-spacing: 4px;
      }
      
      .otp-container {
        padding: 24px 16px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <!-- Header Section -->
      <div class="header">
        <div class="header-content">
          <div class="logo-container">
            <h1 class="logo">🚂 CassieTheRailGooner</h1>
          </div>
          <p class="tagline">Your Journey Verification</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content">
        <h2 class="greeting">
          Hello, <span class="email-highlight">${email}</span>! 👋
        </h2>
        <p class="subtitle">
          We're excited to have you aboard! Here's your verification code to complete your journey setup.
        </p>

        <!-- OTP Section -->
        <div class="otp-section">
          <p class="otp-label">Your Verification Code</p>
          <div class="otp-container">
            <div class="otp-code">
              <div class="otp-digits">${otp}</div>
            </div>
            <p class="otp-expiry">⏰ Expires in 10 minutes</p>
          </div>
        </div>

        <!-- Instructions -->
        <div class="instructions">
          <h3 class="instructions-title">
            📋 How to verify your account:
          </h3>
          <div class="instructions-list">
            <strong>1.</strong> Return to the app or website<br>
            <strong>2.</strong> Enter the 6-digit code above<br>
            <strong>3.</strong> Complete your account setup<br>
            <strong>4.</strong> Start your rail journey adventure!
          </div>
        </div>

        <!-- CTA Button -->
        <a href="#" class="button">✨ Verify Account Now</a>

        <div class="divider"></div>

        <!-- Security Notice -->
        <div class="security-notice">
          <p class="security-notice-content">
            🛡️ <strong>Security Reminder:</strong> Never share this verification code with anyone. CassieTheRailGooner will never ask for your verification code via phone, email, or any other method.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer-section">
        <p class="note">
          Didn't request this verification? You can safely ignore this email or 
          <a href="mailto:support@cassietherailgooner.com" class="support-link">contact our support team</a>.
        </p>
        
        <p class="footer">
          Need help? <a href="mailto:support@cassietherailgooner.com" class="support-link">Contact Support</a>
        </p>
        <p class="footer">
          © 2024 CassieTheRailGooner. All rights reserved.<br>
          <small>This email was sent to ${email}</small>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

export default EmailTemplate;
