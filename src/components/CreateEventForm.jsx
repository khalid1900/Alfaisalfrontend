import React, { useEffect, useState } from "react";
import { useEvent } from "../hooks/useEvent";
import { X } from "lucide-react";

export default function CreateEventForm({ isOpen, onClose, onSuccess, editingEvent }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Lecture/Presentation/Talk",
    date: "",
    time: "",
    endTime: "",
    location: "",
    address: "",
    image: null,
    speakerImage: null,
    description: "",
    details: "",
    sponsor: "",
    audience: "EVERYONE",
    speaker: "",
    subject: "Technology",
    tags: "",
    inPerson: true,
    draft: false,
  });

  const [preview, setPreview] = useState({ image: "", speakerImage: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { createEvent, updateEvent } = useEvent();

  // Populate fields when editing
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || "",
        category: editingEvent.category || "Lecture/Presentation/Talk",
        date: editingEvent.date ? new Date(editingEvent.date).toISOString().slice(0, 10) : "",
        time: editingEvent.time || "",
        endTime: editingEvent.endTime || "",
        location: editingEvent.location || "",
        address: editingEvent.address || "",
        image: null, // Don't carry over file objects
        speakerImage: null, // Don't carry over file objects
        description: editingEvent.description || "",
        details: editingEvent.details || "",
        sponsor: editingEvent.sponsor || "",
        audience: editingEvent.audience || "EVERYONE",
        speaker: editingEvent.speaker || "",
        subject: editingEvent.subject || "Technology",
        tags: editingEvent.tags ? editingEvent.tags.join(", ") : "",
        inPerson: editingEvent.inPerson ?? true,
        draft: editingEvent.draft ?? false,
      });

      setPreview({
        image: editingEvent.image || "",
        speakerImage: editingEvent.speakerImage || "",
      });
    }
  }, [editingEvent]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle image file upload (store file + preview)
  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
      setPreview((prev) => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
    }
  };

  // Submit handler (FormData for backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      // Check if we have images - if not, send JSON instead of FormData
      const hasImages = (formData.image && formData.image instanceof File) || 
                        (formData.speakerImage && formData.speakerImage instanceof File);

      if (hasImages) {
        // Send as FormData if there are images
        const data = new FormData();
        
        // Add all text fields explicitly
        data.append("title", formData.title);
        data.append("category", formData.category);
        data.append("date", formData.date);
        data.append("time", formData.time);
        data.append("endTime", formData.endTime);
        data.append("location", formData.location);
        data.append("address", formData.address);
        data.append("description", formData.description);
        data.append("details", formData.details);
        data.append("sponsor", formData.sponsor);
        data.append("audience", formData.audience);
        data.append("speaker", formData.speaker);
        data.append("subject", formData.subject);
        data.append("inPerson", String(formData.inPerson));
        data.append("draft", String(formData.draft));

        // Handle tags - send as comma-separated string for backend
        const tagsString = formData.tags
          ? formData.tags.split(",").map((t) => t.trim()).filter(t => t).join(",")
          : "";
        data.append("tags", tagsString);

        // Append images
        if (formData.image instanceof File) {
          data.append("image", formData.image);
        }
        
        if (formData.speakerImage instanceof File) {
          data.append("speakerImage", formData.speakerImage);
        }

        console.log("Sending FormData with images");
        
        if (editingEvent) {
          await updateEvent(editingEvent._id, data);
        } else {
          await createEvent(data);
        }
      } else {
        // Send as JSON if no images
        const jsonData = {
          title: formData.title,
          category: formData.category,
          date: formData.date,
          time: formData.time,
          endTime: formData.endTime,
          location: formData.location,
          address: formData.address,
          description: formData.description,
          details: formData.details,
          sponsor: formData.sponsor,
          audience: formData.audience,
          speaker: formData.speaker,
          subject: formData.subject,
          inPerson: formData.inPerson,
          draft: formData.draft,
          tags: formData.tags
            ? formData.tags.split(",").map((t) => t.trim()).filter(t => t)
            : [],
        };

        console.log("Sending JSON (no images):", jsonData);

        if (editingEvent) {
          await updateEvent(editingEvent._id, jsonData);
        } else {
          await createEvent(jsonData);
        }
      }

      alert(editingEvent ? "✅ Event updated successfully" : "✅ Event created successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Submit error:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || err.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-900 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {editingEvent ? "Edit Event" : "Create New Event"}
          </h2>
          <button onClick={onClose} className="text-2xl hover:opacity-80">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-700 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Event Title"
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700"
              >
                <option>Lecture/Presentation/Talk</option>
                <option>Social/Exhibition</option>
                <option>Workshop</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Full Address
            </label>
            <textarea
              name="address"
              placeholder="Full Address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700"
            />
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Event Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "image")}
                className="w-full border-2 border-gray-300 rounded px-3 py-2"
              />
              {preview.image && (
                <img
                  src={preview.image}
                  alt="Event Preview"
                  className="h-32 w-32 mt-2 rounded object-cover"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Speaker Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "speakerImage")}
                className="w-full border-2 border-gray-300 rounded px-3 py-2"
              />
              {preview.speakerImage && (
                <img
                  src={preview.speakerImage}
                  alt="Speaker Preview"
                  className="h-32 w-32 mt-2 rounded object-cover"
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700"
              required
            />
          </div>

          {/* Details */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Event Details *
            </label>
            <textarea
              name="details"
              placeholder="Full Event Details"
              value={formData.details}
              onChange={handleChange}
              rows="3"
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700"
              required
            />
          </div>

          {/* Speaker & Sponsor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Speaker</label>
              <input
                type="text"
                name="speaker"
                placeholder="Speaker Name"
                value={formData.speaker}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Sponsor</label>
              <input
                type="text"
                name="sponsor"
                placeholder="Sponsor"
                value={formData.sponsor}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold mb-2">Tags</label>
            <input
              type="text"
              name="tags"
              placeholder="Tags (comma-separated)"
              value={formData.tags}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700"
            />
          </div>

          {/* Subject & Audience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700"
              >
                <option>Technology</option>
                <option>Wellness</option>
                <option>Innovation</option>
                <option>Business</option>
                <option>Arts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Audience</label>
              <select
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-700"
              >
                <option>EVERYONE</option>
                <option>Students Only</option>
                <option>Faculty Only</option>
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="inPerson"
                checked={formData.inPerson}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold">In-Person Event</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="draft"
                checked={formData.draft}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold">Save as Draft</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-300">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded text-gray-900 font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-700 text-white rounded font-semibold hover:bg-blue-800 transition disabled:opacity-50"
            >
              {loading
                ? editingEvent
                  ? "Updating..."
                  : "Creating..."
                : editingEvent
                ? "Update Event"
                : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}