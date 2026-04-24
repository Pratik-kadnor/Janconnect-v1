const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For development, use Ethereal (fake SMTP service)
  // For production, use real SMTP service like Gmail, SendGrid, etc.
  
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    // Production: Use real SMTP
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development: Log to console instead of sending email
    return {
      sendMail: async (mailOptions) => {
        console.log('\n📧 ========== EMAIL NOTIFICATION ==========');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('-------------------------------------------');
        console.log(mailOptions.text);
        console.log('===========================================\n');
        return { messageId: 'dev-' + Date.now() };
      }
    };
  }
};

// Send account approval email
const sendApprovalEmail = async (user) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || '"JanConnect" <noreply@janconnect.gov.in>',
    to: user.email,
    subject: '🎉 Your JanConnect Account Has Been Approved',
    text: `
Dear ${user.name},

Great news! Your JanConnect account has been approved by the administrator.

Account Details:
- Email: ${user.email}
- Role: ${user.role}
${user.agency ? `- Agency: ${user.agency.name || user.agency}` : ''}
${user.state ? `- State: ${user.state}` : ''}

You can now log in to the JanConnect portal using your credentials:
👉 Login URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}/login

If you have any questions or need assistance, please contact the support team.

Best regards,
JanConnect Team
Ministry of Social Justice & Empowerment
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #007B8A 0%, #005662 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border: 1px solid #e0e0e0;
    }
    .details {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .details p {
      margin: 8px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: #007B8A;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
    .success-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="success-icon">✅</div>
    <h1>Account Approved!</h1>
  </div>
  
  <div class="content">
    <p>Dear <strong>${user.name}</strong>,</p>
    
    <p>Great news! Your JanConnect account has been <strong>approved</strong> by the administrator.</p>
    
    <div class="details">
      <h3>📋 Your Account Details:</h3>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Role:</strong> ${user.role}</p>
      ${user.agency ? `<p><strong>Agency:</strong> ${user.agency.name || user.agency}</p>` : ''}
      ${user.state ? `<p><strong>State:</strong> ${user.state}</p>` : ''}
    </div>
    
    <p>You can now log in to the JanConnect portal using your credentials:</p>
    
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login" class="button">
        🔐 Login to JanConnect
      </a>
    </div>
    
    <p>If you have any questions or need assistance, please contact the support team.</p>
    
    <p>Best regards,<br>
    <strong>JanConnect Team</strong><br>
    Ministry of Social Justice & Empowerment</p>
  </div>
  
  <div class="footer">
    <p>This is an automated email from JanConnect. Please do not reply to this email.</p>
    <p>&copy; ${new Date().getFullYear()} Ministry of Social Justice & Empowerment. All rights reserved.</p>
  </div>
</body>
</html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Approval email sent to:', user.email);
    return info;
  } catch (error) {
    console.error('❌ Error sending approval email:', error.message);
    throw error;
  }
};

// Send account rejection email
const sendRejectionEmail = async (user, reason = '') => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || '"JanConnect" <noreply@janconnect.gov.in>',
    to: user.email,
    subject: 'JanConnect Account Registration Update',
    text: `
Dear ${user.name},

We regret to inform you that your JanConnect account registration has not been approved.

${reason ? `Reason: ${reason}` : ''}

If you believe this is an error or would like more information, please contact the administrator.

Best regards,
JanConnect Team
Ministry of Social Justice & Empowerment
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border: 1px solid #e0e0e0;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>❌ Account Registration Update</h1>
  </div>
  
  <div class="content">
    <p>Dear <strong>${user.name}</strong>,</p>
    
    <p>We regret to inform you that your JanConnect account registration has not been approved.</p>
    
    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    
    <p>If you believe this is an error or would like more information, please contact the administrator.</p>
    
    <p>Best regards,<br>
    <strong>JanConnect Team</strong><br>
    Ministry of Social Justice & Empowerment</p>
  </div>
  
  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} Ministry of Social Justice & Empowerment. All rights reserved.</p>
  </div>
</body>
</html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Rejection email sent to:', user.email);
    return info;
  } catch (error) {
    console.error('❌ Error sending rejection email:', error.message);
    throw error;
  }
};

module.exports = {
  sendApprovalEmail,
  sendRejectionEmail,
};
