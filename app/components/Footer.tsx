/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-8">
      <div className="container mx-auto flex flex-col items-center space-y-6">
        {/* Site Name */}
        <div className="text-lg font-mono">THE LAST TRADE</div>

        {/* Social Media Links */}
        <div className="flex space-x-6">
          {/* Twitter (commented out) */}
          <a
            href="https://www.twitter.com/thelasttrade"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-gray-400 transition"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://www.instagram.com/tthelasttrade"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-gray-400 transition"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://www.youtube.com/@tthelasttrade"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:text-gray-400 transition"
          >
            <FaYoutube size={24} />
          </a>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm items-center">
          {/* Column 1 */}
          <div>
            <a
              href="/terms-and-conditions"
              className="underline hover:text-gray-400"
            >
              Terms and Conditions
            </a>
          </div>
        
          <div>
            <a href="/refund-policy" className="underline hover:text-gray-400">
              Refund Policy
            </a>
          </div>
          <div>
            <a href="/privacy-policy" className="underline hover:text-gray-400">
              Privacy Policy
            </a>
          </div>
        
          <div> 
            <a href="/contact" className="underline hover:text-gray-400"> 
              Contact Us
            </a>
          </div>
        </div> 

        {/* Copyright */}
        <div className="text-center text-xs mt-4">
          &copy; 2024 THE LAST TRADE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
