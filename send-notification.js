// const Octokit = require('@octokit/rest').Octokit;
// const nodemailer = require('nodemailer');

// // Create an Octokit instance with authentication
// const octokit = new Octokit({
//   auth: process.env.GITHUB_TOKEN
// });

// // Function to fetch issues with specific labels
// async function fetchIssues() {
//   const { data } = await octokit.issues.listForRepo({
//     owner: 'your-organization',
//     repo: 'your-repository',
//     labels: 'ready to deploy in stage, Deployed to dev'
//   });
//   return data;
// }

// // Function to extract assignees and their email addresses
// function extractAssignees(issues) {
//   const assignees = [];
//   issues.forEach(issue => {
//     issue.assignees.forEach(assignee => {
//       assignees.push({
//         name: assignee.login,
//         email: assignee.email
//       });
//     });
//   });
//   return assignees;
// }

// // Function to send email notifications
// async function sendEmails(assignees) {
//   const transporter = nodemailer.createTransport({
//     service: 'SMTP',
//     host: 'smtp.gmail.com',
//     port: 587,
//     auth: {
//       user: process.env.SMTP_USERNAME,
//       pass: process.env.SMTP_PASSWORD
//     }
//   });

//   const mailOptions = {
//     from: 'asgardeotest3@gmail.com',
//     to: 'testasgardeo21@gmail.com', // Recipient's email address
//     subject: 'Update Required: Deploy to stage',
//     text: 'Please update the issue status to "Deploy to stage" to proceed with staging deployment.'
//   };

  // assignees.forEach(assignee => {
  //   mailOptions.to = `${assignee.name} <${assignee.email}>`;
  //   transporter.sendMail(mailOptions, (error, info) => {
  //     if (error) {
  //       console.error('Error sending email:', error);
  //     } else {
  //       console.log('Email sent:', info.response);
  //     }
  //   });
  // });
//}

// // Main function to orchestrate the workflow
// async function main() {
//   try {
//     const issues = await fetchIssues();
//     const assignees = extractAssignees(issues);
//     await sendEmails(assignees);
//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// }

// // Run the main function
// main();

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
