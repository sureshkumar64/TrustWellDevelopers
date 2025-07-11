import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Home, User, LogOut, Building } from 'lucide-react';
import AdminAddProperty from './AdminAddProperty';

const AdminPanel = () => {
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [view, setView] = useState('dashboard');
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const [propRes, leadRes] = await Promise.all([
        axios.get('/api/properties/admin', headers),
        axios.get('/api/leads', headers)
      ]);
      setProperties(Array.isArray(propRes.data) ? propRes.data : []);
      setLeads(Array.isArray(leadRes.data) ? leadRes.data : []);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await axios.delete(`/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAll();
    } catch (err) {
      console.error('Failed to delete property:', err);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await axios.delete(`/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAll();
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h1 className="text-xl font-bold mb-8 text-blue-600">TRUSTWELL</h1>
        <nav className="space-y-4">
          <button onClick={() => setView('dashboard')} className={`flex items-center gap-2 w-full text-left ${view === 'dashboard' ? 'text-blue-600 font-bold' : 'text-gray-700'}`}><Home size={18} /> Dashboard</button>
          <button onClick={() => setView('properties')} className={`flex items-center gap-2 w-full text-left ${view === 'properties' ? 'text-blue-600 font-bold' : 'text-gray-700'}`}><Building size={18} /> Listings</button>
          <button onClick={() => setView('addProperty')} className={`flex items-center gap-2 w-full text-left ${view === 'addProperty' ? 'text-blue-600 font-bold' : 'text-gray-700'}`}><Building2 size={18} /> Add Property</button>
          <button onClick={() => setView('leads')} className={`flex items-center gap-2 w-full text-left ${view === 'leads' ? 'text-blue-600 font-bold' : 'text-gray-700'}`}><User size={18} /> Leads</button>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 w-full text-left text-red-500"><LogOut size={18} /> Logout</button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        {/* Dashboard */}
        {view === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <p className="text-green-500 text-center mt-10 mb-6">WELCOME TO THE ADMIN PANEL!</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold">Total Listings</h4>
                <p className="text-xl font-bold">{properties.length}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold">New Leads</h4>
                <p className="text-xl font-bold">{leads.length}</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Available Properties</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {properties.map((p) => (
                <div key={p._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {p.images?.[0]?.url && <img src={p.images[0].url} alt={p.title} className="w-full h-40 object-cover" />}
                  <div className="p-4">
                    <h4 className="font-bold text-lg mb-1">{p.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{p.location}</p>
                    <p className="text-sm text-gray-600 mb-1">{p.condition}</p>
                    <p className="text-blue-600 font-semibold">₹{p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listings */}
        {view === 'properties' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {properties.map((p) => (
                <div key={p._id} className="bg-white shadow-lg rounded-xl overflow-hidden transition hover:scale-[1.02] hover:shadow-2xl duration-300">
                  <img src={p.images?.[0]?.url || '/default.jpg'} alt={p.title} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-1">{p.title}</h4>
                    <p className="text-sm text-gray-500">{p.location}</p>
                    <p className="text-sm text-gray-500">₹{p.price?.toLocaleString()}</p>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => navigate(`/admin/edit-property/${p._id}`)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProperty(p._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Property */}
        {view === 'addProperty' && <AdminAddProperty />}

        {/* Leads */}
        {view === 'leads' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Leads</h2>
            <div className="space-y-4">
              {leads.map((lead, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold text-lg">
                    {lead.name || 'No name provided'}
                    {lead.type && (
                      <span className="text-sm ml-2 text-blue-500">
                        ({lead.type.replace('_', ' ')})
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">📞 {lead.phone}</p>
                  <p className="text-sm text-gray-600">📝 {lead.message || 'No message'}</p>

                  {lead.propertyData && (
                    <div className="mt-4 border-t pt-3">
                      <h4 className="font-semibold text-gray-700">Submitted Property Info:</h4>
                      <p>🏷️ Title: {lead.propertyData.title}</p>
                      <p>📍 Location: {lead.propertyData.location}</p>
                      <p>🏗️ Type: {lead.propertyData.type}</p>
                      <p>🛠️ Condition: {lead.propertyData.condition}</p>
                      <p>💰 Price: ₹{lead.propertyData.price}</p>

                      {lead.propertyData.images?.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {lead.propertyData.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img.url}
                              alt={`img-${idx}`}
                              className="w-full h-28 object-cover rounded border"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => deleteLead(lead._id)}
                    className="bg-red-500 text-white px-3 py-1 mt-4 rounded hover:bg-red-600"
                  >
                    Delete Lead
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
