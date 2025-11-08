
import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, Share2 } from "lucide-react";
import { formatDate, formatTime } from "../utils/date";

export default function EventCard({ event, featured = false, newEvent = false }) {
  return (
    <article className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="p-6 flex gap-5">
        {/* Event Image */}
        <div className="w-40 h-32 flex-shrink-0 relative">
          <img
            src={event.image || "/site/images/default-event.svg"}
            alt={event.title}
            className="w-full h-full object-cover rounded-md"
          />
          {(featured || newEvent) && (
            <span className="absolute top-3 left-3 bg-[#8C1515] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
              {featured ? 'Featured' : 'New'}
            </span>
          )}
        </div>

        {/* Event Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            {/* Event Type Badge */}
            <div className="mb-1.5">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">
                Lecture/Presentation/Talk
              </span>
            </div>

            {/* Event Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2.5 hover:text-[#8C1515] transition-colors leading-tight">
              <Link to={`/event/${event._id}`}>

                {event.title}
              </Link>
            </h3>

            {/* Event Date & Time */}
            <div className="text-sm text-gray-700 mb-1">
              <span className="font-medium">{formatDate(event.date)}</span>{" "}
              <span className="text-gray-600">{formatTime(event.date)}</span>
              {event.endDate && (
                <>
                  {" to "}
                  <span className="text-gray-600">{formatTime(event.endDate)}</span>
                </>
              )}
              {" PT"}
            </div>

            {/* Event Location */}
            <div className="text-sm text-gray-700">
              {event.venue}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-4 pt-2">
            <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#8C1515] transition-colors font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>Save</span>
            </button>
            <span className="text-gray-400">|</span>
            <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#8C1515] transition-colors font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}