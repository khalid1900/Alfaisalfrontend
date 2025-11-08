import api from '../utils/api';

export const eventService = {
  // Create Event
  createEvent: async (eventData) => {
    const response = await api.post('/events/post', eventData);
    return response.data;
  },

  // Get All Events (Public)
  getAllEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  // Get Single Event
  getEventById: async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  // Get Published Events
  getPublishedEvents: async () => {
    const response = await api.get('/events/published');
    return response.data;
  },

  // Get Draft Events (Admin)
  getDraftEvents: async () => {
    const response = await api.get('/events/admin/drafts');
    return response.data;
  },

  // Get All Events (Admin)
  getAllEventsAdmin: async () => {
    const response = await api.get('/events/admin/all');
    return response.data;
  },

  // Get Pending Events (SuperAdmin)
  getPendingEvents: async () => {
    const response = await api.get('/events/admin/pending');
    return response.data;
  },

  // Edit Event
  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  },

  // Delete Event
  deleteEvent: async (eventId) => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },

  // Approve Event (SuperAdmin)
  approveEvent: async (eventId) => {
    console.log(eventId,"in servcie.........")
    // const response = await api.put(`/events/${eventId}/approve`, {});
    const response = await api.put(`/events/${eventId}/approve`);

    return response.data;
  },

  // Reject Event (SuperAdmin)
  rejectEvent: async (eventId, reason) => {
    const response = await api.put(`/events/${eventId}/reject`, { reason });
    return response.data;
  },

  // Search Events
  searchEvents: async (query, category, subject) => {
    const response = await api.get('/events/search', {
      params: { query, category, subject },
    });
    return response.data;
  },

  // Get Events by Date Range
  getEventsByDateRange: async (startDate, endDate) => {
    const response = await api.get('/events/date-range', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Register for Event
  registerForEvent: async (eventId, name, email, phone) => {
    const response = await api.post(`/events/${eventId}/register`, {
      name,
      email,
      phone,
    });
    return response.data;
  },

  // Get Event Attendees
  getEventAttendees: async (eventId) => {
    const response = await api.get(`/events/${eventId}/attendees`);
    return response.data;
  },

  // Update Attendee Status
  updateAttendeeStatus: async (attendeeId, status) => {
    const response = await api.put(`/events/attendee/${attendeeId}/status`, {
      status,
    });
    return response.data;
  },
};

