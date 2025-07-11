import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import FilterBar from '../components/FilterBar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Scale, FileText } from 'lucide-react'; // icons

const Home = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);

  const [filters, setFilters] = useState({
    location: '',
    type: '',
    condition: '',
    priceMin: '',
    priceMax: '',
    reraNumber: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchProperties = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/properties?${query}`);
      setProperties(res.data);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const carouselImages = [
    '/hero2.jpg',
    '/hero.webp',
    '/hero2.jpg',
    '/hero1.webp'
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Carousel Section */}
      <div className="relative">
        <Slider {...sliderSettings}>
          {carouselImages.map((img, idx) => (
            <div key={idx} className="relative h-[500px] w-full">
              <img
                src={img}
                alt={`slide-${idx}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Property</h1>
                <p className="mb-6 text-lg">Explore a wide range of properties in your desired location.</p>
                <div className="backdrop-blur-md p-2 rounded-xl shadow-lg w-full max-w-4xl border border-gray-200">
                  <FilterBar filters={filters} setFilters={setFilters} />
                </div>

                {/* WhatsApp Button */}
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
          ))}
        </Slider>
      </div>

      {/* Top Properties */}
      <section className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Top Properties</h2>
        <button className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">View All Listings</button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-8">
          {!Array.isArray(properties) || properties.length === 0 ? (
            <p className="col-span-full text-gray-500">No properties found.</p>
          ) : (
            properties.map((p) => (
              <PropertyCard property={p} isAdmin={user?.isAdmin} key={p._id} />
            ))
          )}
        </div>
      </section>

      {/* Why Choose Us */}
<section className="bg-gradient-to-b from-gray-100 to-white py-16 px-4 sm:px-6 lg:px-20">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
      Why <span className="text-blue-600">Choose Trustwell Developers</span>
    </h2>
    <p className="text-gray-600 text-lg mb-12">
      Direct Developer Dealing — No Broker, No Extra Commission
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
        <div className="flex justify-center mb-4">
          <ShieldCheck className="text-blue-600" size={36} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">100% RERA Registered Projects</h3>
        <p className="text-sm text-gray-600">
          All our layouts comply with MahaRERA, ensuring full transparency and legal safety for your investment.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
        <div className="flex justify-center mb-4">
          <Scale className="text-blue-600" size={36} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Ethical, Transparent Dealings</h3>
        <p className="text-sm text-gray-600">
          No false commitments. No hidden charges. No pressure selling. We believe in honesty, respect, and clarity in every transaction.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
        <div className="flex justify-center mb-4">
          <FileText className="text-blue-600" size={36} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Legally Verified Plots</h3>
        <p className="text-sm text-gray-600">
          We provide title-clear plots with all legal documentation handled before listing — so you never worry about disputes.
        </p>
      </div>
    </div>
  </div>
</section>
    </div>
  );
};

export default Home;






