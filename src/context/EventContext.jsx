import React, { createContext, useState } from 'react';
import { eventService } from '../services/eventService';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getAllEvents();
      setEvents(response.data || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const fetchPublishedEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getPublishedEvents();
      setEvents(response.data || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.createEvent(eventData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId, eventData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.updateEvent(eventId, eventData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.deleteEvent(eventId);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchEvents = async (query, category, subject) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.searchEvents(query, category, subject);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        error,
        searchTerm,       // ✅ provide it
        setSearchTerm,    // ✅ provide setter
        fetchAllEvents,
        fetchPublishedEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        searchEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
