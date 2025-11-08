import React, { useMemo, useState } from "react";
import EventCard from "../components/EventCard";
import EventFilters from "../components/EventFilters";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 8;

export default function EventsList() {
      const { events, loading, error, fetchPublishedEvents ,searchTerm} = useEvent();
  
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let out = eventsData;
    if (filters.q) {
      const q = filters.q.toLowerCase();
      out = out.filter(e => (e.title + " " + e.summary + " " + (e.department||"")).toLowerCase().includes(q));
    }
    if (filters.department) {
      out = out.filter(e => e.department === filters.department);
    }
    return out;
  }, [filters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">All Events</h1>
              <p className="text-gray-600">Browse all upcoming events on campus</p>
            </div>

            {/* Events List */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {paged.length > 0 ? (
                <>
                  {paged.map((event, index) => (
                    <EventCard 
                      key={event.id} 
                      event={event}
                      featured={index === 0}
                      newEvent={index === paged.length - 1}
                    />
                  ))}
                  
                  {/* Pagination */}
                  <div className="p-4 border-t border-gray-200">
                    <Pagination page={page} totalPages={totalPages} onPage={(p) => setPage(p)} />
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <p className="text-lg">No events found</p>
                  <p className="text-sm mt-2">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <EventFilters onChange={(vals) => { setFilters(vals); setPage(1); }} />
            
            {/* Quick Links */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/site/xml/rss.html" className="text-[#8C1515] hover:underline">
                    RSS feed
                  </a>
                </li>
                <li>
                  <a href="/events" className="text-[#8C1515] hover:underline">
                    Browse by date
                  </a>
                </li>
                <li>
                  <a href="/" className="text-[#8C1515] hover:underline">
                    Featured events
                  </a>
                </li>
              </ul>
            </div>

            {/* Calendar Resources */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Calendar Resources</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-[#8C1515] hover:underline">
                    Other Resources
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}