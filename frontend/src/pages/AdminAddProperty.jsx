import React, { useState } from 'react';
import axios from 'axios';
import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const UserAddProperty = () => {
  const [form, setForm] = useState({
    title: '',
    location: '',
    type: '',
    condition: '',
    price: '',
    whatsappNumber: '',
    reraNumber: '',
    carpetArea: '',
    possessionStatus: '',
    plotArea: ''
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  const isAdmin = user?.role === 'admin';
  const role = user?.role;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      title: '',
      description: ''
    }));
    setImages([...images, ...newImages]);
  };

  const handleImageMetaChange = (index, field, value) => {
    const updated = [...images];
    updated[index][field] = value;
    setImages(updated);
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const uploadImagesToFirebase = async () => {
    const uploaded = [];
    for (let image of images) {
      const fileName = `properties/${uuidv4()}-${image.file.name}`;
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, image.file);
      const url = await getDownloadURL(snapshot.ref);
      uploaded.push({
        url,
        title: image.title,
        description: image.description
      });
    }
    return uploaded;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const uploadedImages = await uploadImagesToFirebase();
      const payload = { ...form, images: uploadedImages };
      const endpoint = isAdmin ? '/api/properties' : '/api/leads/property';
      await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Submission failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (submitted)
    return <p className="text-green-600 text-center text-lg mt-10">✅ Property submitted successfully. Admin will review it soon.</p>;

  return (
    <div className="w-full md:w-1/2 bg-white p-8 mt-15 ml-15 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        {role === 'admin' ? 'Add New Listing' : 'Submit Your Property'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-3 border rounded" required />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full p-3 border rounded" required />

        <div className="flex gap-4">
          <select name="type" value={form.type} onChange={handleChange} className="w-1/2 p-3 border rounded" required>
            <option value="">Select Type</option>
            <option value="Flat">Flat</option>
            <option value="Plot">Plot</option>
          </select>
          <select name="condition" value={form.condition} onChange={handleChange} className="w-1/2 p-3 border rounded" required>
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Old">Old</option>
          </select>
        </div>

        {form.type === 'Flat' && (
          <>
            <input name="carpetArea" value={form.carpetArea} onChange={handleChange} placeholder="Carpet Area (in sq.ft)" className="w-full p-3 border rounded" required />
            <input name="possessionStatus" value={form.possessionStatus} onChange={handleChange} placeholder="Possession Status (optional)" className="w-full p-3 border rounded" />
          </>
        )}

        {form.type === 'Plot' && (
          <input name="plotArea" value={form.plotArea} onChange={handleChange} placeholder="Plot Area (in sq.ft)" className="w-full p-3 border rounded" required />
        )}

        <input name="price" value={form.price} onChange={handleChange} type="number" placeholder="Price (in ₹)" className="w-full p-3 border rounded" required />
        <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} placeholder="WhatsApp Number" className="w-full p-3 border rounded" required />

        <input name="reraNumber" value={form.reraNumber} onChange={handleChange} placeholder="RERA Number (optional)" className="w-full p-3 border rounded" />

        <div>
          <label className="block font-semibold mb-2">Upload Property Images</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
        </div>

        {images.length > 0 && (
          <div className="space-y-4">
            {images.map((img, idx) => (
              <div key={idx} className="border p-4 rounded bg-gray-50 relative">
                <img src={img.preview} alt="Preview" className="w-full max-h-48 object-cover mb-2 rounded" />
                <input
                  placeholder="Image Title"
                  value={img.title}
                  onChange={(e) => handleImageMetaChange(idx, 'title', e.target.value)}
                  className="w-full p-2 border mb-2 rounded"
                />
                <input
                  placeholder="Image Description"
                  value={img.description}
                  onChange={(e) => handleImageMetaChange(idx, 'description', e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white mt-2 py-3 rounded hover:bg-blue-700 transition">
          {uploading ? 'Uploading...' : role === 'admin' ? 'Add Listing' : 'Submit Property'}
        </button>
      </form>
    </div>
  );
};

export default UserAddProperty;
