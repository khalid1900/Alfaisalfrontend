import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";

export default function Hero() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);

  // Featured events for the carousel
  const featuredEvents = [
    {
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=600&fit=crop",
      title: "Innovation Summit 2025",
      date: "Nov 15, 2025",
      location: "Main Auditorium",
      category: "Conference"
    },
    {
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1600&h=600&fit=crop",
      title: "AI & Machine Learning Workshop",
      date: "Nov 20, 2025",
      location: "Tech Hub",
      category: "Workshop"
    },
    {
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1600&h=600&fit=crop",
      title: "Annual Leadership Forum",
      date: "Nov 25, 2025",
      location: "Conference Center",
      category: "Forum"
    },
    {
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1600&h=600&fit=crop",
      title: "Research Symposium",
      date: "Dec 1, 2025",
      location: "Science Building",
      category: "Symposium"
    }
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day);
      // Here you would typically filter events by this date
      console.log(`Selected date: ${monthNames[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}`);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  };

  const days = getDaysInMonth(currentDate);
  const monthName = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const today = new Date();

  return (
    <section className="relative w-full h-[500px] overflow-hidden bg-gray-900">
      {/* Carousel Container */}
      <div className="absolute inset-0 w-full h-full">
        {featuredEvents.map((event, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            
            {/* Event Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pb-16">
              <div className="max-w-[1400px] mx-auto">
                <div className="max-w-2xl">
                  <span className="inline-block px-3 py-1 bg-[#8C1515] text-white text-xs font-bold uppercase rounded-full mb-3">
                    {event.category}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                    {event.title}
                  </h1>
                  <div className="flex items-center gap-6 text-white/90">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      <span className="text-sm font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      <span className="text-sm font-medium">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Navigation Arrows */}
      <button
        onClick={previousSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-[320px] top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {featuredEvents.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Calendar Overlay */}
      <div className="absolute top-0 right-0 w-[300px] h-full flex items-center justify-end pr-6 z-10">
        <div className="bg-white rounded-lg shadow-2xl p-5 w-full">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {monthName} {year}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={goToPreviousMonth}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Next month"
              >
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar grid */}
          <div>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
                <div key={day} className="text-center text-[11px] font-bold text-gray-600 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-0.5">
              {days.map((day, index) => {
                const isToday = day === today.getDate() && 
                  currentDate.getMonth() === today.getMonth() && 
                  currentDate.getFullYear() === today.getFullYear();
                const isSelected = day === selectedDate;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    disabled={day === null}
                    className={`
                      aspect-square text-xs flex items-center justify-center rounded-sm transition-all
                      ${day === null ? 'cursor-default' : 'cursor-pointer'}
                      ${isToday && !isSelected
                        ? 'bg-[#8C1515] text-white font-bold ring-2 ring-[#8C1515] ring-offset-1' 
                        : ''}
                      ${isSelected && !isToday
                        ? 'bg-[#8C1515]/80 text-white font-bold'
                        : ''}
                      ${day !== null && !isToday && !isSelected
                        ? 'hover:bg-gray-100 text-gray-900 font-medium hover:scale-110' 
                        : ''}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calendar footer */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button className="w-full py-2 px-4 bg-[#8C1515] hover:bg-[#7A1212] text-white text-sm font-semibold rounded transition-colors">
              View All Events
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}