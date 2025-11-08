import React, { useState, useEffect } from "react";
import { X, Calendar, Mail, Rss } from "lucide-react";

export default function EventFilters({ isOpen, onClose, onApply, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    hideRecurring: false,
    sortBy: "Date",
    dateRange: "all",
    startDate: "",
    endDate: "",
    experience: "All Experiences",
    eventType: "All Event Types",
    subject: "All Subjects",
    audience: "All Audiences",
    ...initialFilters
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    // Count active filters (excluding defaults)
    let count = 0;
    if (filters.hideRecurring) count++;
    if (filters.sortBy !== "Date") count++;
    if (filters.dateRange !== "all") count++;
    if (filters.experience !== "All Experiences") count++;
    if (filters.eventType !== "All Event Types") count++;
    if (filters.subject !== "All Subjects") count++;
    if (filters.audience !== "All Audiences") count++;
    setActiveFiltersCount(count);
  }, [filters]);

  const sortOptions = [
    { value: "Date", label: "Date" },
    { value: "Title", label: "Title (A-Z)" },
    { value: "Popularity", label: "Popularity" },
    { value: "RecentlyAdded", label: "Recently Added" }
  ];
  
  const dateRangeOptions = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "thisWeek", label: "This Week" },
    { value: "thisMonth", label: "This Month" },
    { value: "nextMonth", label: "Next Month" },
    { value: "custom", label: "Custom Range" }
  ];

  const experienceOptions = [
    "All Experiences",
    "In-Person",
    "Virtual",
    "Hybrid"
  ];

  const eventTypeOptions = [
    "All Event Types",
    "Lecture/Presentation/Talk",
    "Workshop",
    "Conference",
    "Seminar",
    "Performance",
    "Exhibition",
    "Social Event",
    "Career Fair",
    "Networking",
    "Sports",
    "Cultural Event"
  ];

  const subjectOptions = [
    "All Subjects",
    "Arts & Humanities",
    "Business & Economics",
    "Engineering",
    "Health & Medicine",
    "Law & Government",
    "Natural Sciences",
    "Social Sciences",
    "Technology & Innovation",
    "Education",
    "Environment & Sustainability"
  ];

  const audienceOptions = [
    "All Audiences",
    "Students",
    "Faculty & Staff",
    "Alumni",
    "Public",
    "Prospective Students",
    "Graduate Students",
    "Undergraduate Students"
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    // Process filters before applying
    const processedFilters = {
      ...filters,
      // Convert date range to actual dates if needed
      ...(filters.dateRange === "today" && {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      }),
      ...(filters.dateRange === "tomorrow" && {
        startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
      }),
      ...(filters.dateRange === "thisWeek" && {
        startDate: getStartOfWeek().toISOString().split('T')[0],
        endDate: getEndOfWeek().toISOString().split('T')[0]
      }),
      ...(filters.dateRange === "thisMonth" && {
        startDate: getStartOfMonth().toISOString().split('T')[0],
        endDate: getEndOfMonth().toISOString().split('T')[0]
      })
    };

    onApply(processedFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      hideRecurring: false,
      sortBy: "Date",
      dateRange: "all",
      startDate: "",
      endDate: "",
      experience: "All Experiences",
      eventType: "All Event Types",
      subject: "All Subjects",
      audience: "All Audiences"
    };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  // Helper functions for date calculations
  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    return new Date(now.setDate(diff));
  };

  const getEndOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() + (6 - day);
    return new Date(now.setDate(diff));
  };

  const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const getEndOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  };

  // Export filters functionality
  const handleExportToCalendar = (type) => {
    console.log(`Exporting filtered events to ${type}`);
    // Implement calendar export logic here
    alert(`Export to ${type} - Feature coming soon!`);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Filter Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-[320px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">Filter results</h2>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-[#8C1515] text-white text-xs font-bold rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Close filters"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Filters Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Hide Recurring Events Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hideRecurring"
                checked={filters.hideRecurring}
                onChange={(e) => handleFilterChange('hideRecurring', e.target.checked)}
                className="w-4 h-4 text-[#8C1515] border-gray-300 rounded focus:ring-[#8C1515]"
              />
              <label htmlFor="hideRecurring" className="text-sm text-[#006CB8] cursor-pointer">
                Hide recurring events
              </label>
            </div>

            {/* View Options Icons */}
            <div className="flex items-center gap-2 pt-2">
              <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Grid view">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="List view">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Calendar view">
                <Calendar size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Sort by
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                When
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-transparent"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Custom Date Range */}
            {filters.dateRange === "custom" && (
              <div className="space-y-3 pl-2 border-l-2 border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1515]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1515]"
                  />
                </div>
              </div>
            )}

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Experience
              </label>
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-transparent"
              >
                {experienceOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Event Types */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Event Types
              </label>
              <select
                value={filters.eventType}
                onChange={(e) => handleFilterChange('eventType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-transparent"
              >
                {eventTypeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Subject
              </label>
              <select
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-transparent"
              >
                {subjectOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Audience */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Audience
              </label>
              <select
                value={filters.audience}
                onChange={(e) => handleFilterChange('audience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-transparent"
              >
                {audienceOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Subscribe to Results */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Subscribe to Displayed Results
              </p>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleExportToCalendar('Google Calendar')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
                  title="Google Calendar"
                >
                  <Calendar size={20} className="text-[#006CB8]" />
                </button>
                <button 
                  onClick={() => handleExportToCalendar('iCal')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
                  title="iCal"
                >
                  <Calendar size={20} className="text-[#006CB8]" />
                </button>
                <button 
                  onClick={() => handleExportToCalendar('Email')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
                  title="Email"
                >
                  <Mail size={20} className="text-[#006CB8]" />
                </button>
                <button 
                  onClick={() => handleExportToCalendar('RSS')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
                  title="RSS"
                >
                  <Rss size={20} className="text-[#006CB8]" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-[#8C1515] text-white rounded hover:bg-[#7A1212] transition-colors font-medium text-sm"
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}