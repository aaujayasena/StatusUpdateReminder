const { graphql } = require('@octokit/graphql');
const nodemailer = require('nodemailer');

// Your personal access token stored in GitHub Secrets
const token = process.env.GITHUB_TOKEN;

// Maximum number of retries
const MAX_RETRIES = 3;

// Function to send email notifications
async function sendEmails(assignees) {
  // Email sending logic remains the same
}

// Function to fetch issues from GitHub project board using GraphQL
async function fetchIssuesWithRetry(retryCount = 0) {
  try {
    console.log('Fetching issues from GitHub project board using GraphQL...');
  
    const response = await graphql({
      query: `
query {
          repository(owner: "aaujayasena", name: "StatusUpdateReminder") {
        projectsV2(number: 2) {
  nodes {
    items(first: 10) {
      nodes {
        fieldValueByName(name: "Status") {
          ... on ProjectV2ItemFieldSingleSelectValue {
            name
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
        authorization: `Bearer ${token}`
      }
    });

    console.log('GraphQL Response:', response);

    const columns = response.repository?.project?.columns?.nodes || [];
    const issues = columns.flatMap(column =>
      column.cards.nodes.map(card => card.content)
        .filter(issue => issue.state === 'In Progress' || issue.state === 'Ready')
    );

    console.log(`Fetched ${issues.length} issues successfully from project board.`);
    
    return issues;
  } catch (error) {
    // If retry count exceeded, throw the error
    if (retryCount >= MAX_RETRIES) {
      console.error('Error fetching issues from project board after maximum retries:', error.message);
      throw error;
    }

    // Retry after a delay
    console.log(`Error fetching issues from project board (retry ${retryCount + 1}/${MAX_RETRIES}). Retrying after 5 seconds...`);
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds delay
    return fetchIssuesWithRetry(retryCount + 1); // Retry with incremented retry count
  }
}

// Main function to orchestrate the workflow
async function main() {
  try {
    // Fetch issues from project board with retry
    const issues = await fetchIssuesWithRetry();

    // Extract assignees from fetched issues and send email notifications
    const assignees = issues.flatMap(issue => issue.assignees.nodes);
    sendEmails(assignees);
  } catch (error) {
    console.error('Error:', error.message);
    process.exitCode = 1; // Set exit code to indicate failure
  }
}

// Call the main function to start the process
main();
