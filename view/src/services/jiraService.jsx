import axios from 'axios';

// Configure axios with your Jira API base URL
const jiraApi = axios.create({
  baseURL: import.meta.env.JIRA_API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Authentication headers would go here
  }
});

// Fetch tickets with optional filtering
export const fetchTickets = async (filterParams = {}) => {
  try {
    // This is a placeholder. You'll need to implement the actual Jira API call
    // based on your Jira instance and authentication method
    const response = await jiraApi.get('/search', { 
      params: {
        jql: buildJqlFromFilters(filterParams),
        fields: 'key,created,updated,status,creator,assignee,customfield_team'
      } 
    });
    
    // Transform the Jira response to match our UI needs
    return response.data.issues.map(issue => ({
      id: issue.key,
      created: issue.fields.created,
      updated: issue.fields.updated,
      assignedTeam: issue.fields.customfield_team || 'Unassigned',
      creator: issue.fields.creator.displayName,
      updater: issue.fields.updated ? issue.fields.updater.displayName : 'N/A',
      status: issue.fields.status.name
    }));
  } catch (error) {
    console.error('Error fetching tickets from Jira:', error);
    throw error;
  }
};

// Helper function to build JQL from filter parameters
const buildJqlFromFilters = (filters) => {
  const conditions = [];
  
  if (filters.team) {
    conditions.push(`team = "${filters.team}"`);
  }
  
  if (filters.status) {
    conditions.push(`status = "${filters.status}"`);
  }
  
  if (filters.dateFrom) {
    conditions.push(`created >= "${filters.dateFrom}"`);
  }
  
  if (filters.dateTo) {
    conditions.push(`created <= "${filters.dateTo}"`);
  }
  
  return conditions.length > 0 ? conditions.join(' AND ') : 'order by created DESC';
};
