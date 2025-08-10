import { TrendingUp, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="glass border-t border-white/10 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold gradient-text">TheLastTrade</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering traders with professional education, live sessions, and proven strategies 
              to achieve consistent profits in the stock market.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@thelasttrade.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/courses" className="text-gray-300 hover:text-white transition-colors">Courses</a></li>
              <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#refund" className="text-gray-300 hover:text-white transition-colors">Refund Policy</a></li>
              <li><a href="#disclaimer" className="text-gray-300 hover:text-white transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 TheLastTrade. All rights reserved. | Trading involves risk and may not be suitable for all investors.
          </p>
        </div>
      </div>
    </footer>
  );
}