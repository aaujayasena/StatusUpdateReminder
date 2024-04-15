// const nodemailer = require('nodemailer');

// // Function to send email notifications
// async function sendEmails(assignees) {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.SMTP_USERNAME,
//       pass: process.env.SMTP_PASSWORD
//     }
//   });

//   const mailOptions = {
//     from: 'asgardeotest3@gmail.com', // sender's email address
//     subject: 'Update Required: Deploy to stage',
//     text: 'Please update the issue status to "Deploy to stage" to proceed with staging deployment.'
//   };

//   assignees.forEach(assignee => {
//     mailOptions.to = `${assignee.name} <${assignee.email}>`;
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);
//       } else {
//         console.log('Email sent:', info.response);
//       }
//     });
//   });
// }

// module.exports = sendEmails;

const { Octokit } = require('@octokit/rest');
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

// Function to fetch issues from GitHub
async function fetchIssues() {
  const octokit = new Octokit({
    auth: process.env.TOKEN
  });

  try {
    console.log('Fetching issues from GitHub...');
  
    // Fetch issues from the "StatusUpdateReminder" repository with "Ready" or "In progress" status
    const { data } = await octokit.rest.issues.listForRepo({
      owner: 'aaujayasena', // Replace with your GitHub organization name
      repo: 'StatusUpdateReminder', // Repository name
      labels: 'dashboard-status:Ready,dashboard-status:In progress' // Filter by labels
    });

    console.log(`Fetched ${data.length} issues successfully.`);
    
    return data;
  } catch (error) {
    console.error('Error fetching issues:', error.message);
    throw error; // Propagate the error to the caller
  }
}

// Main function to orchestrate the workflow
async function main() {
  try {
    // Fetch issues from GitHub
    const issues = await fetchIssues();

    // Extract assignees from fetched issues and send email notifications
    const assignees = issues.flatMap(issue => issue.assignees);
    sendEmails(assignees);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Call the main function to start the process
main();

