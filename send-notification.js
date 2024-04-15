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

// Function to fetch issues from GitHub project board
async function fetchIssues() {
  const octokit = new Octokit({
    auth: process.env.TOKEN
  });

  try {
    console.log('Fetching issues from GitHub project board...');
    
    // Get the project board columns (statuses)
    const { data: columns } = await octokit.projects.listColumns({
      project_id: '2' // Replace with the ID of your project board
    });

    // Find the IDs of the "Ready" and "In progress" columns
    const readyColumn = columns.find(column => column.name === 'Ready');
    const inProgressColumn = columns.find(column => column.name === 'In progress');

    // Fetch cards (issues) from the "Ready" and "In progress" columns
    const readyCards = await fetchCardsForColumn(octokit, readyColumn.id);
    const inProgressCards = await fetchCardsForColumn(octokit, inProgressColumn.id);

    // Combine the cards from both columns
    const issues = readyCards.concat(inProgressCards);

    console.log(`Fetched ${issues.length} issues successfully from project board:`);
    issues.forEach(issue => {
      console.log(`Issue Title: ${issue.title}`);
      console.log(`Assignees: ${issue.assignees.map(assignee => assignee.login).join(', ')}`);
    });
    
    return issues;
  } catch (error) {
    console.error('Error fetching issues from project board:', error.message);
    throw error; // Propagate the error to the caller
  }
}

// Function to fetch cards (issues) from a column (status) of project board
async function fetchCardsForColumn(octokit, columnId) {
  try {
    const { data: cards } = await octokit.projects.listCards({
      column_id: columnId
    });
    // Extract issue information from cards
    return cards.map(card => ({
      id: card.id,
      title: card.note,
      assignees: card.assignees // Extracting assignees from cards
    }));
  } catch (error) {
    throw new Error(`Error fetching cards for column ${columnId}: ${error.message}`);
  }
}

// Main function to orchestrate the workflow
async function main() {
  try {
    // Fetch issues from project board
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
