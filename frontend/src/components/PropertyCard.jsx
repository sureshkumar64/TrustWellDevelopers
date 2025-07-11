import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, HeartIcon, Share2 } from 'lucide-react';


const PropertyCard = ({ property, isAdmin = false, onDelete }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  // ✅ Check if this property is liked
  const checkIfLiked = async () => {
    try {
      if (!user) return;
      const res = await axios.get(`/api/auth/liked`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const likedIds = res.data.map(p => p._id);
      setLiked(likedIds.includes(property._id));
    } catch (err) {
      console.error('Error checking liked status', err);
    }
  };

  useEffect(() => {
    checkIfLiked();
  }, []);

  // ✅ Like/unlike toggle
  const toggleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to like this property.");
      return;
    }

    try {
      if (liked) {
        await axios.post(`/api/auth/unlike/${property._id}`, {}, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setLiked(false);
      } else {
        await axios.post(`/api/auth/like/${property._id}`, {}, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setLiked(true);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  // ✅ Share link to clipboard
  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/property/${property._id}`);
      alert("🔗 Link copied to clipboard!");
    } catch (err) {
      alert("❌ Failed to copy link");
    }
  };

  return (
    <div
      className="relative group w-full max-w-sm rounded-2xl overflow-hidden shadow-md bg-white transition transform hover:scale-105 hover:shadow-xl duration-300 cursor-pointer"
      onClick={() => navigate(`/property/${property._id}`)}
    >
      {/* NEW Badge */}
      {property.isNew && (
        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full z-10 shadow-md">
          NEW
        </span>
      )}

      {/* Property Image */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={property.images?.[0]?.url || '/default.jpg'}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Property Info */}
      {/* Property Info */}
<div className="p-4 space-y-1">
  <h3 className="text-lg font-semibold text-gray-800 truncate">{property.title}</h3>
  <p className="text-sm text-gray-600">{property.location}</p>

  <p className="text-base font-medium text-gray-700">
    ₹{property.price?.toLocaleString()} &bull; {property.type} &bull; {property.condition}
  </p>

  {/* Conditional Info */}
  {property.type === 'Flat' && (
    <>
      {property.carpetArea && (
        <p className="text-sm text-gray-600">Carpet Area: {property.carpetArea} sq.ft.</p>
      )}
    </>
  )}

  {property.type === 'Plot' && property.plotArea && (
    <p className="text-sm text-gray-600">Plot Area: {property.plotArea} sq.ft.</p>
  )}

  <button
    className="mt-2 w-full flex items-center justify-center gap-5 bg-blue-600 text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition duration-300"
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/property/${property._id}`);
    }}
  >
    View Details
          {/* Like & Share Buttons */}
      <div className=" bottom-4 right-5 flex gap-2 z-20">
  <button
    onClick={toggleLike}
    className="rounded-full p-1 hover:scale-110 transition-transform duration-200"
    title={liked ? 'Unlike' : 'Like'}
  >
    {liked ? (
      <Heart className="text-red-600 fill-red-600" size={22} />
    ) : (
      <Heart className="text-black" size={22} />
    )}
  </button>
  <button
    onClick={handleShare}
    className="rounded-full p-1 hover:scale-110 transition-transform duration-200"
    title="Share"
  >
    <Share2 className="text-black" size={22} />
  </button>
</div>
  </button>
  
</div>



      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button
            className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(property._id);
            }}
          >
            Delete
          </button>
          <button
            className="bg-yellow-500 text-white text-xs px-2 py-1 rounded hover:bg-yellow-600 shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/edit-property/${property._id}`);
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyCard;
