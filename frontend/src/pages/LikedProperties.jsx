// src/pages/LikedProperties.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';


 

const LikedProperties = () => {
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  
  const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const res = await api.get('/api/auth/liked', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        // Ensure it's an array
        if (Array.isArray(res.data)) {
          setLiked(res.data);
        } else {
          setLiked([]); // fallback
          console.warn("Expected array, got:", res.data);
        }

      } catch (err) {
        console.error('Error fetching liked properties:', err);
        setLiked([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchLiked();
  }, []);

  if (loading) {
    return (
      <div className="mt-24 p-4 text-center text-blue-600 text-lg font-semibold">
        Loading your liked properties...
      </div>
    );
  }

  return (
    <div className="max-w-screen h-screen mx-auto mt-24 p-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">❤️ Liked Properties</h1>
      {liked.length === 0 ? (
        <p className="text-gray-500">You haven't liked any properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {liked.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedProperties;
