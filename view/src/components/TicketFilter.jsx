import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button, 
  Box,
  CircularProgress
} from '@mui/material';
import { getTeams, getStatuses } from '../services/firebaseService';

const TicketFilter = ({ onFilterChange }) => {
  const [team, setTeam] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [teams, setTeams] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const teamsData = await getTeams();
        const statusesData = await getStatuses();
        
        setTeams(teamsData);
        setStatuses(statusesData);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilterOptions();
  }, []);
  
  const handleApplyFilter = () => {
    onFilterChange({
      team: team || undefined,
      status: status || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined
    });
  };
  
  const handleClearFilter = () => {
    setTeam('');
    setStatus('');
    setDateFrom('');
    setDateTo('');
    onFilterChange({});
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }
  
  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel id="team-select-label">Team</InputLabel>
            <Select
              labelId="team-select-label"
              id="team-select"
              value={team}
              label="Team"
              onChange={(e) => setTeam(e.target.value)}
            >
              <MenuItem value=""><em>Any</em></MenuItem>
              {teams.map(team => (
                <MenuItem key={team} value={team}>{team}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value=""><em>Any</em></MenuItem>
              {statuses.map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            id="date-from"
            label="From Date"
            type="date"
            fullWidth
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            id="date-to"
            label="To Date"
            type="date"
            fullWidth
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={2}>
          <Box display="flex" gap={1}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleApplyFilter}
              fullWidth
            >
              Apply
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleClearFilter}
              fullWidth
            >
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TicketFilter;
