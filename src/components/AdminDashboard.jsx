import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useEvent } from '../hooks/useEvent';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Eye, Edit2, Trash2, Check, X, Shield, Users, Crown } from 'lucide-react';
import CreateEventForm from './CreateEventForm';
import { eventService } from '../services/eventService';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { events, loading, fetchAllEvents, deleteEvent, approveEvent, rejectEvent } = useEvent();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  // Determine if user is super admin
  const isSuperAdmin = user?.role === 'superadmin';

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const handleDeleteEvent = async (eventId) => {

    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const res = await eventService.deleteEvent(eventId);

      alert('Event deleted successfully');
      await fetchAllEvents();
    } catch (error) {
      console.error("❌ Delete Event Error:", error?.response?.data || error);
      alert('Failed to delete event');
    }
  };



  const handleApproveEvent = async (eventId) => {
    try {
      await eventService.approveEvent(eventId);
      await fetchAllEvents();
    } catch (error) {
      console.error("Approve event failed:", error.response?.data || error);
      alert('Failed to approve event');
    }
  };

  const handleRejectEvent = async (eventId) => {
    console.log("handleRejectEvent triggered for:", eventId);

    const reason = prompt('Enter rejection reason:');
    if (!reason) {
      console.log("Rejection canceled — no reason provided.");
      return;
    }

    try {
      console.log("Sending reject request...");
      const res = await eventService.rejectEvent(eventId, reason);
      console.log("RejectEvent Response:", res);
      await fetchAllEvents();
    } catch (error) {
      console.error("Reject Event Error:", error?.response?.data || error);
      alert('Failed to reject event');
    }
  };
  const handleOpenForm = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEditEvent = (event) => {
    // Regular admins can only edit their own pending events
    if (!isSuperAdmin && event.status !== 'pending') {
      alert('You can only edit pending events. Contact Super Admin for published events.');
      return;
    }
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
    // /events/:eventId
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleFormSuccess = async () => {
    await fetchAllEvents();
    handleFormClose();
  };

  const handleManageAdmins = () => {
    navigate('/admin/manageadmin');
  };

  // Filter events based on role
  const filteredEvents = events.filter(event => {
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`${isSuperAdmin ? 'bg-purple-900' : 'bg-blue-900'} text-white shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {isSuperAdmin ? <Crown size={24} /> : <Shield size={24} />}
              Al Faisal Events CMS
            </h2>
            <p className={`${isSuperAdmin ? 'text-purple-200' : 'text-blue-200'} text-sm`}>
              {isSuperAdmin ? '🔑 Super Admin Dashboard' : '👤 Admin Dashboard'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold flex items-center gap-2 justify-end">
                {user?.name}
                {isSuperAdmin && <span className="text-xs bg-yellow-400 text-purple-900 px-2 py-0.5 rounded font-bold">SUPER</span>}
              </p>
              <p className={`${isSuperAdmin ? 'text-purple-200' : 'text-blue-200'} text-sm`}>{user?.email}</p>
            </div>

            {/* Super Admin Only: Manage Admins Button */}
            {isSuperAdmin && (
              <button
                onClick={handleManageAdmins}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-purple-900 px-4 py-2 rounded-lg font-semibold transition"
              >
                <Users size={18} /> Manage Admins
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg font-semibold transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
            {!isSuperAdmin && (
              <p className="text-sm text-gray-600 mt-1">
                ⚠️ Events require Super Admin approval before publishing
              </p>
            )}
          </div>
          <button
            onClick={handleOpenForm}
            className={`flex items-center gap-2 text-white px-4 py-2 rounded-lg font-semibold transition ${isSuperAdmin ? 'bg-purple-700 hover:bg-purple-800' : 'bg-blue-700 hover:bg-blue-800'
              }`}
          >
            <Plus size={20} /> New Event
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${isSuperAdmin ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'} border-2 rounded-lg p-6`}>
            <p className="text-sm font-semibold opacity-80">Total Events</p>
            <p className={`text-4xl font-bold mt-2 ${isSuperAdmin ? 'text-purple-700' : 'text-blue-700'}`}>
              {events.length}
            </p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
            <p className="text-sm font-semibold opacity-80">
              {isSuperAdmin ? 'Awaiting Approval' : 'Your Pending'}
            </p>
            <p className="text-4xl font-bold mt-2 text-yellow-700">
              {events.filter(e => e.status === 'pending').length}
            </p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <p className="text-sm font-semibold opacity-80">
              {isSuperAdmin ? 'Approved/Published' : 'Published'}
            </p>
            <p className="text-4xl font-bold mt-2 text-green-700">
              {events.filter(e => e.status === 'approved' || e.status === 'published').length}
            </p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <p className="text-sm font-semibold opacity-80">Rejected</p>
            <p className="text-4xl font-bold mt-2 text-red-700">
              {events.filter(e => e.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Super Admin Info Banner */}
        {isSuperAdmin && events.filter(e => e.status === 'pending').length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-semibold">
                  You have {events.filter(e => e.status === 'pending').length} event(s) awaiting your approval
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Filter Bar */}
          <div className="p-6 border-b border-gray-200 space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`flex-1 border-2 border-gray-300 rounded px-4 py-2 focus:outline-none ${isSuperAdmin ? 'focus:border-purple-700' : 'focus:border-blue-700'
                  }`}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`border-2 border-gray-300 rounded px-4 py-2 focus:outline-none ${isSuperAdmin ? 'focus:border-purple-700' : 'focus:border-blue-700'
                  }`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-600">
                      Loading...
                    </td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-600">
                      No events found
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        {event.image ? (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400 text-center">No image</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 font-semibold line-clamp-1">
                          {event.title}
                        </p>
                        {event.featured && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded mt-1 inline-block">
                            ⭐ Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.category}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${event.status === 'published' || event.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : event.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {/* View Button - Both Roles */}
                          <button
                            onClick={() => handleViewEvent(event._id)}
                            className="p-2 text-blue-700 hover:bg-blue-50 rounded transition"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>

                          {/* Edit Button - Role-based restrictions */}
                          <button
                            onClick={() => handleEditEvent(event)}
                            className={`p-2 rounded transition ${!isSuperAdmin && event.status !== 'pending'
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-orange-700 hover:bg-orange-50'
                              }`}
                            title={!isSuperAdmin && event.status !== 'pending'
                              ? 'You can only edit pending events'
                              : 'Edit'}
                            disabled={!isSuperAdmin && event.status !== 'pending'}
                          >
                            <Edit2 size={18} />
                          </button>

                          {/* Super Admin Only: Approve/Reject Buttons */}
                          {isSuperAdmin && event.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveEvent(event._id)}
                                className="p-2 text-green-700 hover:bg-green-50 rounded transition"
                                title="Approve"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => handleRejectEvent(event._id)}
                                className="p-2 text-red-700 hover:bg-red-50 rounded transition"
                                title="Reject"
                              >
                                <X size={18} />
                              </button>
                            </>
                          )}

                          {/* Delete Button - Super Admin has full access, Regular Admin limited */}
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className={`p-2 rounded transition ${!isSuperAdmin && event.status !== 'pending'
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-red-700 hover:bg-red-50'
                              }`}
                            title={!isSuperAdmin && event.status !== 'pending'
                              ? 'You can only delete pending events'
                              : 'Delete'}
                            disabled={!isSuperAdmin && event.status !== 'pending'}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Event Form Modal */}
      {showForm && (
        <CreateEventForm
          isOpen={showForm}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          editingEvent={editingEvent}
        />
      )}
    </div>
  );
}