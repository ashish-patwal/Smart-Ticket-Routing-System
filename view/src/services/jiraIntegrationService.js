import { addTicket, updateTicket } from './firebaseService';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Process a ticket from Jira and store in Firebase
export const processJiraTicket = async (jiraTicket) => {
  try {
    // Transform Jira ticket to our format
    const transformedTicket = {
      jiraId: jiraTicket.key,
      title: jiraTicket.fields.summary,
      description: jiraTicket.fields.description,
      status: jiraTicket.fields.status.name,
      creator: jiraTicket.fields.creator.displayName,
      updater: jiraTicket.fields.updated ? jiraTicket.fields.updater.displayName : jiraTicket.fields.creator.displayName,
      assignedTeam: determineTeam(jiraTicket), // Implement your routing logic here
      priority: jiraTicket.fields.priority?.name || 'Medium',
      created: new Date(jiraTicket.fields.created).toISOString(),
      updated: new Date(jiraTicket.fields.updated || jiraTicket.fields.created).toISOString()
    };
    
    // Check if ticket already exists in Firebase by Jira ID
    // If it does, update it; if not, add it
    // This logic would need to be implemented with a query first
    
    // For now, we'll just add it as a new ticket
    const ticketId = await addTicket(transformedTicket);
    return ticketId;
  } catch (error) {
    console.error("Error processing Jira ticket: ", error);
    throw error;
  }
};

// Implement your team determination logic here
const determineTeam = (jiraTicket) => {
  // This is where your smart routing algorithm would go
  // For now, we'll use a simple example based on components or labels
  
  const components = jiraTicket.fields.components || [];
  const labels = jiraTicket.fields.labels || [];
  
  if (components.some(c => c.name.toLowerCase().includes('frontend'))) {
    return 'Frontend Team';
  } else if (components.some(c => c.name.toLowerCase().includes('backend'))) {
    return 'Backend Team';
  } else if (labels.includes('security')) {
    return 'Security Team';
  } else if (labels.includes('devops')) {
    return 'DevOps Team';
  }
  
  // Default team if no matches
  return 'Triage Team';
};
