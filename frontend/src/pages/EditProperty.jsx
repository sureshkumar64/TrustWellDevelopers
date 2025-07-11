import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const [form, setForm] = useState({
    title: '',
    location: '',
    price: '',
    type: '',
    condition: '',
    reraNumber: '',
    description: '',
    carpetArea: '',
    plotArea: '',
    possessionStatus: ''
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await axios.get(`/api/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          title: data.title || '',
          location: data.location || '',
          price: data.price || '',
          type: data.type || '',
          condition: data.condition || '',
          reraNumber: data.reraNumber || '',
          description: data.description || '',
          carpetArea: data.carpetArea || '',
          plotArea: data.plotArea || '',
          possessionStatus: data.possessionStatus || ''
        });
      } catch (err) {
        console.error('Error fetching property:', err);
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/properties/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Property updated successfully!');
      navigate('/admin');
    } catch (err) {
      console.error('Error updating property:', err);
      alert('❌ Failed to update property');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Edit Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Property Title"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price (in ₹)"
          type="number"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Type (Flat or Plot)"
          className="w-full border p-2 rounded"
        />
        <input
          name="condition"
          value={form.condition}
          onChange={handleChange}
          placeholder="Condition (New or Old)"
          className="w-full border p-2 rounded"
        />
        <input
          name="reraNumber"
          value={form.reraNumber}
          onChange={handleChange}
          placeholder="RERA Number (optional)"
          className="w-full border p-2 rounded"
        />
        <input
          name="carpetArea"
          value={form.carpetArea}
          onChange={handleChange}
          placeholder="Carpet Area (for Flats only)"
          type="text"
          className="w-full border p-2 rounded"
        />
        <input
          name="plotArea"
          value={form.plotArea}
          onChange={handleChange}
          placeholder="Plot Area (for Plots only)"
          type="text"
          className="w-full border p-2 rounded"
        />
        <input
          name="possessionStatus"
          value={form.possessionStatus}
          onChange={handleChange}
          placeholder="Possession Status (for Flats)"
          type="text"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          rows={4}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Property
        </button>
      </form>
    </div>
  );
};

export default EditProperty;
  