const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : ['http://localhost:3000', 'http://localhost:5173'], // Include both React and Vite default ports
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Helper function to determine team based on Jira ticket
const determineTeam = (jiraTicket) => {
  const components = jiraTicket.fields.components || [];
  const labels = jiraTicket.fields.labels || [];
  const description = jiraIssue.fields.description || '';
  const summary = jiraIssue.fields.summary || '';
  
  // Simple routing logic - can be replaced with ML model later
  if (components.some(c => c.name.toLowerCase().includes('frontend'))) {
    return 'Frontend Team';
  } else if (components.some(c => c.name.toLowerCase().includes('backend'))) {
    return 'Backend Team';
  } else if (labels.includes('security')) {
    return 'Security Team';
  } else if (labels.includes('devops')) {
    return 'DevOps Team';
  } else if (description.toLowerCase().includes('database') || summary.toLowerCase().includes('database')) {
    return 'Database Team';
  }
  
  // Default team if no matches
  return 'Triage Team';
};

// Webhook endpoint for Jira
app.post('/api/jira-webhook', async (req, res) => {
  try {
    const jiraEvent = req.body;
    
    // Check if this is a relevant event (issue created/updated)
    if (jiraEvent.webhookEvent === 'jira:issue_created' || jiraEvent.webhookEvent === 'jira:issue_updated') {
      const issue = jiraEvent.issue;
      
      // Transform Jira ticket to our format
      const ticket = {
        jiraId: issue.key,
        title: issue.fields.summary,
        description: issue.fields.description || '',
        status: issue.fields.status.name,
        creator: issue.fields.creator.displayName,
        updater: issue.fields.updated ? issue.fields.updater.displayName : issue.fields.creator.displayName,
        assignedTeam: determineTeam(issue),
        priority: issue.fields.priority?.name || 'Medium',
        created: new Date(issue.fields.created).toISOString(),
        updated: new Date(issue.fields.updated || issue.fields.created).toISOString()
      };
      
      // Check if ticket already exists in Firebase by Jira ID
      const ticketsRef = db.collection('tickets');
      const snapshot = await ticketsRef.where('jiraId', '==', issue.key).limit(1).get();
      
      if (snapshot.empty) {
        // Create new ticket
        await ticketsRef.add(ticket);
        console.log(`Created new ticket for ${ticket.jiraId}`);
      } else {
        // Update existing ticket
        const docId = snapshot.docs[0].id;
        await ticketsRef.doc(docId).update(ticket);
        console.log(`Updated ticket for ${ticket.jiraId}`);
      }
      
      res.status(200).json({ success: true, message: 'Ticket processed successfully' });
    } else {
      // Not an event we're interested in
      res.status(200).json({ success: true, message: 'Event ignored' });
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to get all tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const { team, status } = req.query;
    let query = db.collection('tickets');
    
    // Apply filters if provided
    if (team) {
      query = query.where('assignedTeam', '==', team);
    }
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.orderBy('created', 'desc').get();
    const tickets = [];
    
    snapshot.forEach(doc => {
      tickets.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to get available teams
app.get('/api/teams', async (req, res) => {
  try {
    const snapshot = await db.collection('tickets').get();
    const teamsSet = new Set();
    
    snapshot.forEach(doc => {
      const team = doc.data().assignedTeam;
      if (team) teamsSet.add(team);
    });
    
    res.status(200).json(Array.from(teamsSet));
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to get available statuses
app.get('/api/statuses', async (req, res) => {
  try {
    const snapshot = await db.collection('tickets').get();
    const statusesSet = new Set();
    
    snapshot.forEach(doc => {
      const status = doc.data().status;
      if (status) statusesSet.add(status);
    });
    
    res.status(200).json(Array.from(statusesSet));
  } catch (error) {
    console.error('Error fetching statuses:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to update a ticket
app.put('/api/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Add updated timestamp
    updateData.updated = new Date().toISOString();
    
    await db.collection('tickets').doc(id).update(updateData);
    
    res.status(200).json({ success: true, message: 'Ticket updated successfully' });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing
