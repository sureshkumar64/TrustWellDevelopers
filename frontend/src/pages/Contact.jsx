// src/pages/Contact.jsx
import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // integrate backend or email service
    setSubmitted(true);
  };

  return (
    <div className=" bg-gray-50 mt-1 pl-40 py-20 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">
        {/* Left: Contact Info */}
        <div className="space-y-6 py-20">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Get in Touch</h2>
          <p className="text-gray-700">You can reach us directly through the form or using the contact details below.</p>

          <div className="flex items-center gap-3 text-gray-800">
            <Mail className="text-blue-600" />
            <span>info@trustwelldevelopers.com</span>
          </div>

          <div className="flex items-center gap-3 text-gray-800">
            <Phone className="text-blue-600" />
            <span>+91 7378716313</span>
          </div>

          <div className="flex items-start gap-3 text-gray-800">
            <MapPin className="text-blue-600 mt-1" />
            <span>Trustwell Real Estates, Gandhi Nagar, Maharashtra, India</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
