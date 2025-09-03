import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/hand and shovel-cropped_1756833681751.png";

export default function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Residential", href: "/residential" },
    { label: "Commercial", href: "/commercial" },
    { label: "Products We Use", href: "/products-we-use" },
    { label: "Blog", href: "/blog" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact", href: "/contact" }
  ];

  const isActivePath = (path: string) => location === path;

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-3">
            <img src={logoImage} alt="Dook Scoop 'Em Logo" className="h-10 w-auto" />
            <span className="text-xl md:text-2xl font-black text-gray-800 hover:text-orange-600 transition-colors">
              DOOK SCOOP 'EM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-bold transition-colors hover:text-orange-600 ${
                  isActivePath(item.href) 
                    ? "text-orange-600 border-b-2 border-orange-600 pb-1" 
                    : "text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* CTA Buttons */}
            <Link href="/contact">
              <Button variant="outline" className="font-bold px-4 py-2 border-orange-600 text-orange-600 hover:bg-orange-50">
                Get Quote
              </Button>
            </Link>
            <Link href="/onboard">
              <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2">
                Sign Up Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Animated */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pb-6 space-y-4 border-t border-gray-200 pt-4 mt-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block font-bold py-2 transition-colors hover:text-orange-600 ${
                  isActivePath(item.href) ? "text-orange-600" : "text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
              <Link href="/contact">
                <Button 
                  variant="outline"
                  className="w-full font-bold px-6 py-3 border-orange-600 text-orange-600 hover:bg-orange-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Quote
                </Button>
              </Link>
              <Link href="/onboard">
                <Button 
                  className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}