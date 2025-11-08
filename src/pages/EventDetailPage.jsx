import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { eventService } from '../services/eventService';
import { formatDateTime } from "../utils/date";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await eventService.getEventById(eventId);
        setEvent(response.data);
      } catch (err) {
        setError('Failed to load event');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-xl">Loading event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="py-12">
        <h2 className="text-xl font-semibold">Event not found</h2>
        <p className="mt-2">Try browsing the <Link to="/events" className="text-sky-600 hover:underline">events list</Link>.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img 
            src={event.image || "/site/images/default-event.svg"} 
            alt={event.title} 
            className="w-full h-64 object-cover rounded-2xl mb-6" 
          />
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <div className="text-slate-600 mt-2">
            {formatDateTime(event.date)} — {event.location}
          </div>
          <div className="mt-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: event.description }}></div>
        </div>

        <aside className="space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <h3 className="font-semibold">Event details</h3>
            <dl className="mt-2 text-sm text-slate-700 space-y-1">
              <div><strong>Category:</strong> {event.category}</div>
              <div><strong>Speaker:</strong> {event.speaker}</div>
              <div><strong>Location:</strong> {event.location}</div>
              <div><strong>Audience:</strong> {event.audience}</div>
            </dl>
          </div>

          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <h3 className="font-semibold">Share</h3>
            <div className="mt-2 flex gap-2">
              <a 
                className="px-3 py-1 border rounded hover:bg-gray-50" 
                href={`mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(window.location.href)}`}
              >
                Email
              </a>
              <button 
                className="px-3 py-1 border rounded hover:bg-gray-50" 
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Link copied!');
                }}
              >
                Copy link
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}