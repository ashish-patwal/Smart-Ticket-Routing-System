import React from 'react';
import { Container, Typography, Box, Paper, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Assignment, Group, AutoAwesome, Help } from '@mui/icons-material';

const AboutPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About Smart Ticket Routing System
        </Typography>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            What is Smart Ticket Routing?
          </Typography>
          <Typography paragraph>
            The Smart Ticket Routing System is an intelligent solution that automatically assigns Jira tickets to the most relevant teams based on ticket content, historical data, and team expertise. This system helps reduce manual triage time and ensures tickets reach the right teams faster.
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h5" gutterBottom>
            Key Features
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><AutoAwesome /></ListItemIcon>
              <ListItemText 
                primary="Intelligent Routing" 
                secondary="Uses machine learning to analyze ticket content and route to appropriate teams" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Assignment /></ListItemIcon>
              <ListItemText 
                primary="Jira Integration" 
                secondary="Seamlessly works with your existing Jira workflow" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Group /></ListItemIcon>
              <ListItemText 
                primary="Team Workload Balancing" 
                secondary="Considers current team capacity when assigning tickets" 
              />
            </ListItem>
          </List>
        </Paper>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            How to Use
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon><Help /></ListItemIcon>
              <ListItemText 
                primary="Creating Tickets" 
                secondary="Create tickets normally in Jira. The system will automatically analyze and route them." 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Help /></ListItemIcon>
              <ListItemText 
                primary="Viewing Assignments" 
                secondary="Check the dashboard to see all ticket assignments and their status." 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Help /></ListItemIcon>
              <ListItemText 
                primary="Manual Override" 
                secondary="Team leads can manually reassign tickets if needed through the Jira interface." 
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default AboutPage;
