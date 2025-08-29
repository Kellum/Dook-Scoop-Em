import { Link } from "wouter";
import { Facebook, Instagram, Phone, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black mb-4">DOOK SCOOP 'EM</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Professional pet waste removal service in Northeast Florida. We fear no pile so you can enjoy your yard again.
            </p>
            <p className="text-orange-400 font-bold text-sm">
              "We fear no pile" 🐾
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/residential" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Residential
                </Link>
              </li>
              <li>
                <Link href="/commercial" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Commercial
                </Link>
              </li>
              <li>
                <Link href="/how-we-scoop" className="text-gray-300 hover:text-orange-400 transition-colors">
                  How We Scoop
                </Link>
              </li>
              <li>
                <Link href="/products-we-use" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Products We Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-black mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-orange-400" />
                <a 
                  href="tel:+19045557667" 
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  (904) 555-POOP
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-orange-400" />
                <a 
                  href="mailto:hello@dookscoopem.com" 
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  hello@dookscoopem.com
                </a>
              </div>
              <div className="text-gray-300 text-sm">
                <p>Nassau County, FL</p>
                <p>Yulee • Fernandina Beach • Oceanway</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links & Additional Info */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 font-bold">Follow Us:</span>
              <a 
                href="https://www.facebook.com/dookscoopem/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="https://www.instagram.com/dookscoopem" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                <Instagram size={24} />
              </a>
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-6">
              <Link href="/about-us" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                About Us
              </Link>
              <Link href="/blog" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Contact
              </Link>
            </div>
          </div>

          {/* Copyright & Legal */}
          <div className="text-center mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              © {currentYear} Dook Scoop 'Em. All rights reserved. | Licensed & Insured | Nassau County, FL
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Professional pet waste removal service • We fear no pile
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}