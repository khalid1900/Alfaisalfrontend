import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { Calendar, MapPin, User, ArrowLeft } from 'lucide-react';

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventService.getEventById(eventId);
        setEvent(response.data);
      } catch (err) {
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Event not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-700 hover:underline font-semibold"
          >
            Go back to events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-900 mb-6"
        >
          <ArrowLeft size={20} /> Back to Eventssss
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          {event.speakerImage && (
            <div className="bg-gray-900 text-white grid grid-cols-3 gap-0">
              <img
                src={event.speakerImage}
                alt={event.speaker}
                className="w-full h-64 object-cover col-span-1"
              />
              <div className="col-span-2 p-8 flex flex-col justify-center">
                <div className="uppercase text-sm font-bold text-gray-400 mb-2">
                  {event.category}
                </div>
                <h1 className="text-3xl font-bold mb-3">{event.title}</h1>
                <p className="text-gray-300">Sponsored by {event.sponsor}</p>
              </div>
            </div>
          )}

          {/* Main Image */}
          {event.image && (
            <img src={event.image} alt={event.title} className="w-full h-96 object-cover" />
          )}

          {/* Content */}
          <div className="p-8">
            {/* Key Details */}
            <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-blue-700 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Date & Time</p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })} {event.time}
                    {event.endTime && ` - ${event.endTime}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-700 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Location</p>
                  <p className="text-gray-900 font-semibold">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{event.description}</p>
              <p className="text-gray-700 leading-relaxed">{event.details}</p>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Speaker Info */}
            {event.speaker && (
              <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <User size={20} className="text-blue-700 mt-1" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase">Speaker</p>
                    <p className="text-gray-900 font-semibold text-lg">{event.speaker}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Address */}
            {event.address && (
              <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">Full Address</h3>
                <p className="text-gray-700 whitespace-pre-line">{event.address}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-gray-600 mb-1">People Interested</p>
                <p className="text-2xl font-bold text-blue-700">{event.numberOfAttendees || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm font-semibold text-gray-600 mb-1">Event Type</p>
                <p className="text-lg font-bold text-green-700">
                  {event.inPerson ? '✓ In-Person' : 'Virtual'}
                </p>
              </div>
            </div>

            {/* Register Button */}
            {event.status === 'published' && (
              <button
                onClick={() => setShowRegistration(true)}
                className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition"
              >
                Register for Event
              </button>
            )}
          </div>
        </div>

        {/* Registration Modal */}
        {showRegistration && (
          <EventRegistrationModal
            event={event}
            onClose={() => setShowRegistration(false)}
            onSuccess={() => {
              setShowRegistration(false);
              alert('Successfully registered for the event!');
            }}
          />
        )}
      </div>
    </div>
  );
}