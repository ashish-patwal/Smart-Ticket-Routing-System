// Mock data for ticket routing system
export const getTickets = () => {
    return [
      {
        id: "TICKET-1001",
        created: "2023-11-15T09:23:45.000Z",
        updated: "2023-11-15T14:30:22.000Z",
        assignedTeam: "Frontend Team",
        creator: "John Smith",
        updater: "Sarah Johnson",
        status: "In Progress"
      },
      {
        id: "TICKET-1002",
        created: "2023-11-14T11:15:32.000Z",
        updated: "2023-11-16T08:45:12.000Z",
        assignedTeam: "Backend Team",
        creator: "Emily Davis",
        updater: "Michael Brown",
        status: "Open"
      },
      {
        id: "TICKET-1003",
        created: "2023-11-13T15:42:18.000Z",
        updated: "2023-11-15T16:22:30.000Z",
        assignedTeam: "DevOps Team",
        creator: "Robert Wilson",
        updater: "Jennifer Lee",
        status: "Resolved"
      },
      {
        id: "TICKET-1004",
        created: "2023-11-16T08:10:25.000Z",
        updated: "2023-11-16T10:35:40.000Z",
        assignedTeam: "QA Team",
        creator: "David Miller",
        updater: "David Miller",
        status: "In Progress"
      },
      {
        id: "TICKET-1005",
        created: "2023-11-12T13:55:30.000Z",
        updated: "2023-11-14T09:20:15.000Z",
        assignedTeam: "Security Team",
        creator: "Lisa Anderson",
        updater: "Thomas White",
        status: "Closed"
      },
      {
        id: "TICKET-1006",
        created: "2023-11-15T10:30:00.000Z",
        updated: "2023-11-15T11:45:22.000Z",
        assignedTeam: "Frontend Team",
        creator: "Kevin Martin",
        updater: "Kevin Martin",
        status: "Open"
      },
      {
        id: "TICKET-1007",
        created: "2023-11-14T16:20:10.000Z",
        updated: "2023-11-16T09:15:45.000Z",
        assignedTeam: "Backend Team",
        creator: "Amanda Clark",
        updater: "James Taylor",
        status: "In Progress"
      },
      {
        id: "TICKET-1008",
        created: "2023-11-13T09:05:55.000Z",
        updated: "2023-11-15T13:40:30.000Z",
        assignedTeam: "Product Team",
        creator: "Daniel Lewis",
        updater: "Patricia Moore",
        status: "Pending"
      },
      {
        id: "TICKET-1009",
        created: "2023-11-16T11:25:18.000Z",
        updated: "2023-11-16T14:10:05.000Z",
        assignedTeam: "UX Team",
        creator: "Michelle Walker",
        updater: "Michelle Walker",
        status: "Open"
      },
      {
        id: "TICKET-1010",
        created: "2023-11-11T14:50:22.000Z",
        updated: "2023-11-14T16:35:10.000Z",
        assignedTeam: "Infrastructure Team",
        creator: "Christopher Hall",
        updater: "Elizabeth Young",
        status: "Resolved"
      }
    ];
  };
  
  // Mock function to filter tickets
  export const filterTickets = (tickets, filters = {}) => {
    return tickets.filter(ticket => {
      // Filter by team
      if (filters.team && ticket.assignedTeam !== filters.team) {
        return false;
      }
      
      // Filter by status
      if (filters.status && ticket.status !== filters.status) {
        return false;
      }
      
      // Filter by date range
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        const ticketDate = new Date(ticket.created);
        if (ticketDate < fromDate) {
          return false;
        }
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        const ticketDate = new Date(ticket.created);
        if (ticketDate > toDate) {
          return false;
        }
      }
      
      return true;
    });
  };
  
  // Get available teams for filtering
  export const getTeams = () => {
    return [
      "Frontend Team",
      "Backend Team",
      "DevOps Team",
      "QA Team",
      "Security Team",
      "Product Team",
      "UX Team",
      "Infrastructure Team"
    ];
  };
  
  // Get available statuses for filtering
  export const getStatuses = () => {
    return [
      "Open",
      "In Progress",
      "Pending",
      "Resolved",
      "Closed"
    ];
  };
  