import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import TicketTable from '../components/TicketTable';
import TicketFilter from '../components/TicketFilter';
import { subscribeToTickets } from '../services/firebaseService';

const HomePage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterParams, setFilterParams] = useState({});

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to real-time updates from Firebase
    const unsubscribe = subscribeToTickets((updatedTickets) => {
      setTickets(updatedTickets);
      setLoading(false);
    }, filterParams);
    
    // Clean up subscription when component unmounts or filters change
    return () => unsubscribe();
  }, [filterParams]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Smart Ticket Routing Dashboard
        </Typography>
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <TicketFilter onFilterChange={setFilterParams} />
        </Paper>
        
        <TicketTable tickets={tickets} loading={loading} />
      </Box>
    </Container>
  );
};

export default HomePage;
