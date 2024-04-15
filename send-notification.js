const nodemailer = require('nodemailer');

// Function to send a test email
async function sendTestEmail() {
  // Create a transporter using Gmail SMTP settings
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // Email options (change as needed)
  const mailOptions = {
    from: 'asgardeotest3@gmail.com', // Sender's email address
    to: 'testasgardeo21@gmail.com', // Recipient's email address (your own email or a test email)
    subject: 'Test Email from GitHub Actions',
    text: 'This is a test email sent from GitHub Actions.'
  };

  try {
    // Send the test email
    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent:', info.response);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

// Call the function to send the test email
sendTestEmail();
