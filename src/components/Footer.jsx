import React from "react";

export default function Footer() {
  return (
    <footer className="mt-16 bg-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - About */}
          <div>
            <h4 className="font-bold text-lg text-gray-900 mb-4">
              About the Event Calendar
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              The Stanford Event Calendar is the university's central source for information about upcoming campus events.
            </p>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-[#153f8c] hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#153f8c] hover:underline">
                  Build RSS and Calendar Feeds
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#153f8c] hover:underline">
                  Build a Widget
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column - Post Events */}
          <div>
            <h4 className="font-bold text-lg text-gray-900 mb-4">
              Post and manage events
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Campus organizations are invited to add their events to the calendar.
            </p>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-[#153f8c] hover:underline">
                  Request an administrative account
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#153f8c] hover:underline">
                  Policies & procedures
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#153f8c] hover:underline">
                  Documentation & help
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Red Bottom Bar */}
      <div className="bg-[#153f8c] text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Stanford Logo */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">Al Faisal</span>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#153f8c] rounded-full"></div>
                </div>
              </div>
              <span className="text-sm">University</span>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <a href="#" className="hover:underline">AL faisal Home</a>
              <a href="#" className="hover:underline">Maps & Directions</a>
              <a href="#" className="hover:underline">Search Stanford</a>
              <a href="#" className="hover:underline">Emergency Info</a>
              <a href="#" className="hover:underline">Terms of Use</a>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Copyright</a>
              <a href="#" className="hover:underline">Trademarks</a>
              <a href="#" className="hover:underline">Non-Discrimination</a>
              <a href="#" className="hover:underline">Accessibility</a>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-center mt-4 pt-4 border-t border-blue-600 text-sm">
            © AL faisal  University. Riyadh, Saudia Arabia .
          </div>
        </div>
      </div>
    </footer>
  );
}