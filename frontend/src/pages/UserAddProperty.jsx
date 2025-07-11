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
    reraNumber: '', // Optional
    carpetArea: '',
    possessionStatus: '',
    plotArea: ''
  });

  const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  const role = user?.role || 'user';

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
      const payload = {
        ...form,
        images: uploadedImages
      };

      const endpoint = role === 'admin' ? '/api/properties' : '/api/leads/property';
      const requestData =
        role === 'admin'
          ? payload
          : {
              type: 'user_property',
              name: form.title,
              phone: form.whatsappNumber,
              message: 'User submitted a property to sell',
              propertyData: payload
            };

      await api.post(endpoint, requestData, {
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

  if (submitted) {
    return (
      <div className="flex justify-center items-center h-[80vh] bg-gradient-to-r from-blue-50 to-white">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-2xl font-semibold text-green-600 mb-2">✅ Property submitted successfully!</p>
          <p className="text-gray-700">
            {role !== 'admin' ? 'Admin will review it soon.' : 'Listed live on the site.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row items-center justify-center px-4 py-12">
      <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          {role === 'admin' ? 'Add New Listing' : 'Submit Your Property'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-3 border border-gray-300 rounded-lg" required />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full p-3 border border-gray-300 rounded-lg" required />

          <div className="flex gap-4">
            <select name="type" value={form.type} onChange={handleChange} className="w-1/2 p-3 border border-gray-300 rounded-lg" required>
              <option value="">Type</option>
              <option value="flat">Flat</option>
              <option value="plot">Plot</option>
            </select>
            <select name="condition" value={form.condition} onChange={handleChange} className="w-1/2 p-3 border border-gray-300 rounded-lg" required>
              <option value="">Condition</option>
              <option value="new">New</option>
              <option value="old">Old</option>
            </select>
          </div>

          {form.type === 'flat' && (
            <>
              <input name="carpetArea" value={form.carpetArea} onChange={handleChange} placeholder="Carpet Area (sq ft)" className="w-full p-3 border border-gray-300 rounded-lg" required />
              <input name="possessionStatus" value={form.possessionStatus} onChange={handleChange} placeholder="Possession Status (Optional)" className="w-full p-3 border border-gray-300 rounded-lg" />
            </>
          )}

          {form.type === 'plot' && (
            <input name="plotArea" value={form.plotArea} onChange={handleChange} placeholder="Plot Area (sq ft)" className="w-full p-3 border border-gray-300 rounded-lg" required />
          )}

          <input name="price" value={form.price} onChange={handleChange} type="number" placeholder="Price (₹)" className="w-full p-3 border border-gray-300 rounded-lg" required />
          <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} placeholder="WhatsApp Number" className="w-full p-3 border border-gray-300 rounded-lg" required />
          <input name="reraNumber" value={form.reraNumber} onChange={handleChange} placeholder="RERA Number (Optional)" className="w-full p-3 border border-gray-300 rounded-lg" />

          <div>
            <label className="block font-semibold mb-2 text-gray-700">Upload Property Images</label>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded-lg" />
          </div>

          {images.length > 0 && (
            <div className="space-y-4 mt-4">
              {images.map((img, idx) => (
                <div key={idx} className="border p-4 rounded-lg bg-gray-50 relative shadow-sm">
                  <img src={img.preview} alt="Preview" className="w-full max-h-48 object-cover rounded mb-2" />
                  <input placeholder="Image Title" value={img.title} onChange={(e) => handleImageMetaChange(idx, 'title', e.target.value)} className="w-full p-2 border rounded mb-2" />
                  <input placeholder="Image Description" value={img.description} onChange={(e) => handleImageMetaChange(idx, 'description', e.target.value)} className="w-full p-2 border rounded" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-3 py-1 text-sm hover:bg-red-700">✕</button>
                </div>
              ))}
            </div>
          )}

          <button type="submit" disabled={uploading} className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition">
            {uploading ? 'Uploading...' : role === 'admin' ? 'Add Listing' : 'Submit Property'}
          </button>
        </form>
      </div>

      <div className="w-full md:w-1/2 hidden md:flex justify-center items-center">
        <img src="/img1.jpg" alt="Illustration" className="max-h-[500px] rounded-xl" />
      </div>
    </div>
  );
};

export default UserAddProperty;
