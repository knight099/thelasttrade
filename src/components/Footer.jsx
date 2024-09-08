/* eslint-disable no-unused-vars */
import { FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-8">
      <div className="container mx-auto flex flex-col items-center space-y-6">
        {/* Site Name */}
        <div className="text-lg font-bold">THE LAST TRADE</div>

        {/* Social Media Links */}
        <div className="flex space-x-6">
          {/* <a
            href="https://www.twitter.com/thelasttrade"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-gray-400 transition"
          >
            <FaTwitter size={24} />
          </a> */}
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center text-sm">
          {/* Column 1 */}
          <div>
            <a
              href="/standard-dos-donts"
              className="underline hover:text-gray-400"
            >
              Standard Do's & Don'ts
            </a>
          </div>
          <div>
            <a href="/refund-policy" className="underline hover:text-gray-400">
              Refund Policy
            </a>
          </div>
          <div>
            <a
              href="/service-fee-refund-plan"
              className="underline hover:text-gray-400"
            >
              Service Fee Refund Plan
            </a>
          </div>
          <div>
            <a href="/privacy-policy" className="underline hover:text-gray-400">
              Privacy Policy
            </a>
          </div>
          <div>
            <a
              href="/terms-and-conditions"
              className="underline hover:text-gray-400"
            >
              Terms and Conditions
            </a>
          </div>
          <div>
            <a href="/user-consent" className="underline hover:text-gray-400">
              User Consent
            </a>
          </div>
          {/* Column 2 */}
          <div>
            <a
              href="/registered-research-analyst"
              className="underline hover:text-gray-400"
            >
              Registered Research Analyst
            </a>
          </div>
          <div>
            <a
              href="/legal-disclaimer"
              className="underline hover:text-gray-400"
            >
              Legal Disclaimer
            </a>
          </div>
          <div>
            <a href="/ad-disclaimer" className="underline hover:text-gray-400">
              AD Disclaimer
            </a>
          </div>
          <div>
            <a
              href="/investor-charter"
              className="underline hover:text-gray-400"
            >
              Investor Charter
            </a>
          </div>
          <div>
            <a
              href="/grievance-redressal-process"
              className="underline hover:text-gray-400"
            >
              Grievance Redressal Process
            </a>
          </div>
          <div>
            <a href="/contact" className="underline hover:text-gray-400">
              Contact Us
            </a>
          </div>
          {/* Column 3 */}
          <div>
            <a
              href="/packages/equity-cash-intraday"
              className="underline hover:text-gray-400"
            >
              Equity Cash Intraday
            </a>
          </div>
          <div>
            <a
              href="/packages/index-option-standard"
              className="underline hover:text-gray-400"
            >
              Index Option (Standard Package)
            </a>
          </div>
          <div>
            <a
              href="/packages/index-option-premium"
              className="underline hover:text-gray-400"
            >
              Index Option (Premium)
            </a>
          </div>
          <div>
            <a
              href="/packages/index-option-combo"
              className="underline hover:text-gray-400"
            >
              Index Option (Combo Package)
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
