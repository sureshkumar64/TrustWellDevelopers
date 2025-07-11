import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Home, Layers, Building, BadgeCheck, Ruler } from 'lucide-react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});


const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get(`/api/properties/${id}`).then((res) => setProperty(res.data));
  }, [id]);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/leads/contact', {
        name: form.name,
        phone: form.phone,
        message: form.message || 'Interested in this property',
        type: 'contact',
        propertyId: property._id,
        propertyData: {
          title: property.title,
          location: property.location,
          type: property.type,
          condition: property.condition,
          price: property.price,
          whatsappNumber: property.whatsappNumber,
          images: property.images,
          reraNumber: property.reraNumber || ''
        }
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit lead');
    }
  };

  if (!property) {
    return <p className="text-center mt-20 text-gray-600 text-lg">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-15 py-10">
      {/* Property Overview */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-2 flex items-center gap-2">
          <Home size={28} /> {property.title}
        </h1>

        <p className="text-gray-600 mb-4 flex flex-wrap gap-4">
          <span className="flex items-center gap-1"><MapPin size={18} /> {property.location}</span>
          <span className="flex items-center gap-1"><Building size={18} /> ₹{property.price?.toLocaleString()}</span>
          <span className="flex items-center gap-1"><Layers size={18} /> {property.type}</span>
          <span className="flex items-center gap-1">🛠️ {property.condition}</span>

          {property.type === 'Flat' && property.carpetArea && (
            <span className="flex items-center gap-1"><Ruler size={18} /> Carpet Area: {property.carpetArea} sq.ft.</span>
          )}

          {property.type === 'Flat' && property.possessionStatus && (
            <span className="flex items-center gap-1">📅 Possession: {property.possessionStatus}</span>
          )}

          {property.type === 'Plot' && property.plotArea && (
            <span className="flex items-center gap-1"><Ruler size={18} /> Plot Area: {property.plotArea} sq.ft.</span>
          )}

          {property.reraNumber && (
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <BadgeCheck size={18} /> RERA No: {property.reraNumber}
            </span>
          )}
        </p>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {property.images?.map((img, idx) => (
            <div key={idx} className="rounded-lg overflow-hidden border">
              <img src={img.url} alt={img.title} className="w-full h-48 object-cover" />
              <div className="p-2">
                <p className="text-sm font-semibold text-gray-700">{img.title}</p>
                <p className="text-xs text-gray-500">{img.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Button */}
        <div className="mt-6">
          <a
            href="https://wa.me/917378716313?text=Hi, I'm interested in a free property consultation."
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm">
              💬 Chat on WhatsApp
            </button>
          </a>
        </div>
      </div>

      {/* Google Map */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📍 Property Location</h2>
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
          <GoogleMap
            mapContainerStyle={{ height: '300px', width: '100%' }}
            center={{ lat: 32.73, lng: 75.02 }} // TODO: Replace with dynamic coords if needed
            zoom={15}
          >
            <Marker position={{ lat: 32.73, lng: 75.02 }} />
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Lead Form */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Drop Your Info</h2>
        {submitted ? (
          <p className="text-green-600 text-lg font-medium">✅ Lead submitted successfully!</p>
        ) : (
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Message (optional)"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
