import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const TICKETS_COLLECTION = "tickets";

// Get all tickets with real-time updates
export const subscribeToTickets = (callback, filterParams = {}) => {
  let ticketsQuery = collection(db, TICKETS_COLLECTION);

  // Apply filters if provided
  if (filterParams.team) {
    ticketsQuery = query(
      ticketsQuery,
      where("assignedTeam", "==", filterParams.team)
    );
  }

  if (filterParams.status) {
    ticketsQuery = query(
      ticketsQuery,
      where("status", "==", filterParams.status)
    );
  }

  // Always order by created date descending
  ticketsQuery = query(ticketsQuery, orderBy("created", "desc"));

  // Set up real-time listener
  const unsubscribe = onSnapshot(
    ticketsQuery,
    (snapshot) => {
      const tickets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(tickets);
    },
    (error) => {
      console.error("Error fetching tickets: ", error);
    }
  );

  // Return unsubscribe function to clean up listener when component unmounts
  return unsubscribe;
};

// Add a new ticket
export const addTicket = async (ticketData) => {
  try {
    const docRef = await addDoc(collection(db, TICKETS_COLLECTION), {
      ...ticketData,
      created: serverTimestamp(),
      updated: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding ticket: ", error);
    throw error;
  }
};

// Update an existing ticket
export const updateTicket = async (ticketId, ticketData) => {
  try {
    const ticketRef = doc(db, TICKETS_COLLECTION, ticketId);
    await updateDoc(ticketRef, {
      ...ticketData,
      updated: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating ticket: ", error);
    throw error;
  }
};

// Get available teams (for filtering)
export const getTeams = async () => {
  try {
    const teamsSet = new Set();
    const querySnapshot = await getDocs(collection(db, TICKETS_COLLECTION));

    querySnapshot.forEach((doc) => {
      const team = doc.data().assignedTeam;
      if (team) teamsSet.add(team);
    });

    return Array.from(teamsSet);
  } catch (error) {
    console.error("Error getting teams: ", error);
    return [];
  }
};

// Get available statuses (for filtering)
export const getStatuses = async () => {
  try {
    const statusesSet = new Set();
    const querySnapshot = await getDocs(collection(db, TICKETS_COLLECTION));

    querySnapshot.forEach((doc) => {
      const status = doc.data().status;
      if (status) statusesSet.add(status);
    });

    return Array.from(statusesSet);
  } catch (error) {
    console.error("Error getting statuses: ", error);
    return [];
  }
};
