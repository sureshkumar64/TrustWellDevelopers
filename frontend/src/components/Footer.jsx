import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#172337] text-white text-sm pt-10 pb-6 px-4 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        {/* About Section */}
        <div>
          <h4 className="font-semibold mb-3">ABOUT</h4>
          <ul className="space-y-2 text-gray-300 cursor-pointer">
            <li onClick={() => navigate("/contact")} className="hover:underline">Contact Us</li>
            <li onClick={() => navigate("/mission")} className="hover:underline">About Us</li>
          </ul>
        </div>

        {/* Address Section */}
        <div>
          <h4 className="font-semibold mb-3">Mail Us:</h4>
          <p className="text-gray-300 leading-relaxed">
            info@trustwelldevelopers.com<br />
            Address:- Office No 237, 2nd floor, Jalaram Mangalam Complex, Lokmanya Nagar Hingna Road,<br />
            Nagpur, Maharashtra - 440016<br />
            India
          </p>
        </div>

        {/* Social Section (optional) */}
        {<div className="flex flex-col gap-2">
          <h4 className="font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4 text-lg text-gray-300">
            <a href="#" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
            <a href="#" className="hover:text-white"><FaYoutube /></a>
          </div>
        </div> }
      </div>

      {/* Bottom Text */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-gray-400 text-xs">
        © {new Date().getFullYear()} Trustwell Developer | All rights reserved.
      </div>
    </footer>
  );
}
// This Footer component provides a clean and simple footer layout with sections for About, Address, and Social Media links.