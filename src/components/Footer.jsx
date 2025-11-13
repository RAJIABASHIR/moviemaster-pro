import React from "react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="mt-12">
      {/* 👇 Theme-aware background */}
      <div className="bg-white dark:bg-black text-slate-900 dark:text-white py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
            <div className="md:col-span-2">
              <div className="font-bold text-lg">MovieMasterPro</div>
              <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                MovieMaster Pro lets you browse, filter, and organize your favorite films. Build personal collections, maintain a watchlist, and discover top rated and recent titles with a clean, responsive UI.
              </p>
            </div>
            <div>
              <div className="font-semibold mb-3">Company</div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Our Mission</li>
                <li>Contact Saled</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3">Services</div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Products & Services</li>
                <li>Customer Stories</li>
                <li>Download Apps</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3">Information</div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
                <li>Join Us</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3">Social Links</div>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                  <BsTwitterX /> @MovieMaster-Pro
                </li>
                <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                  <FaLinkedinIn /> @MovieMaster-Pro
                </li>
                <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                  <FaFacebookF /> @MovieMaster-Pro
                </li>
                <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                  <MdEmail /> support@cst.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 my-8"></div>
          <div className="text-center text-gray-500 text-sm">
            © 2025 MovieMaster-Pro. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}



