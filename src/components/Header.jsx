import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useEvent } from "../hooks/useEvent";

export default function Header() {
  
const { searchTerm, setSearchTerm } = useEvent();

  
  return (
    <>
      {/* Red top bar - Only Stanford University text */}
      <div className="bg-[#153f8c] text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-2">
          <span className="font-bold text-[13px]">Al Faisal University</span>
        </div>
      </div >

      {/* White utility bar with blue links */}
      <div className="bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex justify-end">
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Get help</span>
            </a>
            <span className="text-gray-300">|</span>
            <a href="/admin" className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Log in</span>
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium">
              <span>Sign up</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-20 py-3">
            {/* Logo - Stanford serif style */}
            <Link to="/" className="flex items-center">
              <span className="text-[26px] tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                <span className="text-[#153f8c] font-bold">Al Faisal</span>
                <span className="text-[#8C1515]"> | </span>
                <span className="text-gray-900 font-normal">Events Calendar</span>
              </span>
            </Link>

            {/* Search bar */}
          <div className="flex-1 max-w-[500px] mx-12 hidden lg:block relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
   <input
  type="text"
  placeholder="Search for events, places, departments, groups"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 text-sm"
/>
        </div>

            {/* kindlyMobile search button */}
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Search size={24} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
