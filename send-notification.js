const nodemailer = require('nodemailer');

// Function to send email notifications
async function sendEmails(assignees) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const mailOptions = {
    from: 'asgardeotest3@gmail.com', // sender's email address
    subject: 'Update Required: Deploy to stage',
    text: 'Please update the issue status to "Deploy to stage" to proceed with staging deployment.'
  };

  assignees.forEach(assignee => {
    mailOptions.to = `${assignee.name} <${assignee.email}>`;
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  });
}

module.exports = sendEmails;
