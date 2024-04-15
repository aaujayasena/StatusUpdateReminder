const { graphql } = require('@octokit/graphql');
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

// Function to fetch issues from GitHub project board using GraphQL
async function fetchIssues() {
  try {
    console.log('Fetching issues from GitHub project board using GraphQL...');
  
    const response = await graphql({
      query: `
        query {
          repository(owner: "aaujayasena", name: "StatusUpdateReminder") {
            project(number: 2) {
              columns(first: 10) {
                nodes {
                  cards(first: 100) {
                    nodes {
                      content {
                        ... on Issue {
                          title
                          assignees(first: 10) {
                            nodes {
                              name
                              email
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      headers: {
        authorization: process.env.TOKEN
      }
    });

    const columns = response.repository.project.columns.nodes;
    const issues = columns.flatMap(column =>
      column.cards.nodes.map(card => card.content)
    );

    console.log(`Fetched ${issues.length} issues successfully from project board.`);
    
    return issues;
  } catch (error) {
    console.error('Error fetching issues from project board:', error.message);
    throw error; // Propagate the error to the caller
  }
}

// Main function to orchestrate the workflow
async function main() {
  try {
    // Fetch issues from project board
    const issues = await fetchIssues();

    // Extract assignees from fetched issues and send email notifications
    const assignees = issues.flatMap(issue => issue.assignees.nodes);
    sendEmails(assignees);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Call the main function to start the process
main();
