import React, { useState } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';

const TicketTable = ({ tickets, loading }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (tickets.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">No tickets found matching your criteria.</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="ticket table">
          <TableHead>
            <TableRow>
              <TableCell>Ticket Number</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Updated Date</TableCell>
              <TableCell>Assigned Team</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Updated By</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ticket) => (
                <TableRow hover key={ticket.id}>
                  <TableCell component="th" scope="row">
                    {ticket.id}
                  </TableCell>
                  <TableCell>{formatDate(ticket.created)}</TableCell>
                  <TableCell>{formatDate(ticket.updated)}</TableCell>
                  <TableCell>{ticket.assignedTeam}</TableCell>
                  <TableCell>{ticket.creator}</TableCell>
                  <TableCell>{ticket.updater}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tickets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TicketTable;
