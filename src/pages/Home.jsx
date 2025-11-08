import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import EventCard from "../components/EventCard";
import EventFilters from "../components/EventFilters";
import { useEvent } from "../hooks/useEvent";

export default function Home() {
  const [activeTab, setActiveTab] = useState("trending");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [filteredEvents, setFilteredEvents] = useState([]);
  
  const { events, loading, error, fetchPublishedEvents ,searchTerm} = useEvent();
  
  useEffect(() => {
    fetchPublishedEvents();
  }, []);

useEffect(() => {
  let result = [...events];

  // 🔍 Apply search filter first
 if (searchTerm && searchTerm.trim()) {
  const q = searchTerm.toLowerCase();
  result = result.filter(
    (event) =>
      event.title?.toLowerCase().includes(q) ||
      event.venue?.toLowerCase().includes(q) ||
      event.category?.toLowerCase().includes(q) ||
      event.description?.toLowerCase().includes(q)
  );
}


  // 🧩 Apply other filters (existing logic)
  if (appliedFilters.hideRecurring) {
    result = result.filter((event) => !event.recurring);
  }

  if (appliedFilters.startDate && appliedFilters.endDate) {
    result = result.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate >= new Date(appliedFilters.startDate) &&
        eventDate <= new Date(appliedFilters.endDate)
      );
    });
  }

  if (appliedFilters.eventType && appliedFilters.eventType !== "All Event Types") {
    result = result.filter((event) => event.category === appliedFilters.eventType);
  }

  if (appliedFilters.subject && appliedFilters.subject !== "All Subjects") {
    result = result.filter((event) => event.subject === appliedFilters.subject);
  }

  if (appliedFilters.audience && appliedFilters.audience !== "All Audiences") {
    result = result.filter((event) => event.audience === appliedFilters.audience);
  }

  // 🔢 Sorting logic (keep same)
  if (appliedFilters.sortBy) {
    switch (appliedFilters.sortBy) {
      case "Date":
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "Title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Popularity":
        result.sort((a, b) => (b.interested || 0) - (a.interested || 0));
        break;
      case "RecentlyAdded":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
  }

  setFilteredEvents(result);
}, [events, appliedFilters, searchTerm]); // ✅ include searchTerm dependency


  const handleApplyFilters = (filters) => {
    console.log("Applying filters:", filters);
    setAppliedFilters(filters);
  };

  const handleRemoveFilter = (filterKey) => {
    const newFilters = { ...appliedFilters };
    delete newFilters[filterKey];
    setAppliedFilters(newFilters);
  };

  const displayEvents = filteredEvents.length > 0 ? filteredEvents : events;
  const featured = displayEvents.slice(0, 3);

  // Count active filters
  const activeFilterCount = Object.keys(appliedFilters).filter(key => {
    const value = appliedFilters[key];
    if (key === 'hideRecurring') return value === true;
    if (key === 'sortBy') return value !== "Date";
    if (key === 'dateRange') return value !== "all";
    return value && !value.includes("All");
  }).length;

  return (
    <div className="bg-white">
      <Hero />
      
      <section className="max-w-[1400px] mx-auto px-6 py-10 w-full">
        {/* Section Header with Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-8">
            <h2 className="text-[32px] font-bold text-gray-900">Featured Events</h2>
            <div className="flex gap-0 border-b-2 border-gray-300">
              <button
                onClick={() => setActiveTab("trending")}
                className={`px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors relative ${
                  activeTab === "trending"
                    ? "text-[#8C1515]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Trending
                {activeTab === "trending" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8C1515]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors relative ${
                  activeTab === "upcoming"
                    ? "text-[#8C1515]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Upcoming
                {activeTab === "upcoming" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8C1515]" />
                )}
              </button>
            </div>
          </div>

          {/* Filter and View Options */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors relative"
            >
              Filter
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#8C1515] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <button className="px-3 py-2.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
              </svg>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {Object.keys(appliedFilters).length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Active Filters:</span>
              <button
                onClick={() => setAppliedFilters({})}
                className="text-sm text-[#8C1515] hover:underline font-medium"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(appliedFilters).map(([key, value]) => {
                // Don't show default values
                if (!value || value === "Date" || value === "all" || value.toString().includes("All")) return null;
                
                return (
                  <span 
                    key={key} 
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-sm text-gray-700 rounded-full"
                  >
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span>{value.toString()}</span>
                    <button 
                      onClick={() => handleRemoveFilter(key)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                );
              })}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredEvents.length} of {events.length} events
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#8C1515]"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading events. Please try again.</p>
          </div>
        )}

        {/* Featured Events List */}
        {!loading && !error && (
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            {featured.length > 0 ? (
              <>
                {featured.map((event, index) => (
                  <EventCard 
                    key={event._id || event.id} 
                    event={event}
                    featured={index === 0}
                    newEvent={index === featured.length - 1 && featured.length > 1}
                  />
                ))}
                
                {/* Show all events link */}
                <div className="p-6 text-center border-t border-gray-200 bg-gray-50">
                  <a 
                    href="/events" 
                    className="text-[#8C1515] font-semibold hover:underline inline-flex items-center gap-2 text-sm"
                  >
                    Show all events
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600 text-lg">No events found matching your filters</p>
                <button
                  onClick={() => setAppliedFilters({})}
                  className="mt-4 text-[#8C1515] hover:underline font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Filter Sidebar */}
      <EventFilters 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={appliedFilters}
      />
    </div>
  );
}