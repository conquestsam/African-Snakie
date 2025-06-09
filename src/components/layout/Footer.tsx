import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Leaf } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (path: string) => {
    if (path === '/shipping' || path === '/returns') {
      navigate('/login');
    } else {
      navigate(path);
      scrollToTop();
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">African Snakie</h3>
            </div>
            <p className="mb-4">
              Experience the authentic taste of Africa with our carefully selected snacks sourced directly from local producers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleLinkClick('/')}
                  className="hover:text-green-500 transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/shop')}
                  className="hover:text-green-500 transition-colors text-left"
                >
                  Shop
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/categories')}
                  className="hover:text-green-500 transition-colors text-left"
                >
                  Categories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/about')}
                  className="hover:text-green-500 transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/contact')}
                  className="hover:text-green-500 transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleLinkClick('/account')}
                  className="hover:text-green-500 transition-colors text-left"
                >
                  My Account
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/orders')}
                  className="hover:text-green-500 transition-colors text-left"
                >
                  Order Tracking
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/shipping')}
                  className="hover:text-green-500 transition-colors text-left"
                >
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/returns')}
                  className="hover:text-green-500 transition-colors text-left"
                >
                  Returns & Refunds
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/faq')}
                  className="hover:text-green-500 transition-colors text-left"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                <span>We are online-only store, delivering fresh African Snacks straight to your door!</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                <span>+1 555 (123-4567)</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                <span>info@foodie.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <div className="mb-4">
            <img
              src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
              alt="PayPal"
              className="h-6 inline-block mx-1"
            />
            <img
              src="https://cdn.iconscout.com/icon/free/png-256/free-visa-3-226460.png"
              alt="Visa"
              className="h-6 inline-block mx-1"
            />
            <img
              src="https://cdn.iconscout.com/icon/free/png-256/free-mastercard-3-226462.png"
              alt="Mastercard"
              className="h-6 inline-block mx-1"
            />
            <img
              src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1476103033/ywctpdefyiqzrxj8kxel.png"
              alt="Paystack"
              className="h-6 inline-block mx-1"
            />
          </div>
          <p>© {new Date().getFullYear()} African Snakie. All rights reserved.</p>
          <p className="mt-2">
            <button 
              onClick={() => handleLinkClick('/privacy')}
              className="hover:text-green-500 transition-colors mx-2"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => handleLinkClick('/terms')}
              className="hover:text-green-500 transition-colors mx-2"
            >
              Terms of Service
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;