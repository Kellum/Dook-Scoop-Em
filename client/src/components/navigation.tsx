import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Residential", href: "/residential" },
    { label: "Commercial", href: "/commercial" },
    { label: "How We Scoop", href: "/how-we-scoop" },
    { label: "Products We Use", href: "/products-we-use" },
    { label: "Blog", href: "/blog" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact", href: "/contact" }
  ];

  const isActivePath = (path: string) => location === path;

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200 neu-raised">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl md:text-3xl font-black text-gray-800 hover:text-orange-600 transition-colors">
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
            
            {/* CTA Button */}
            <Link href="/">
              <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2">
                Join Waitlist
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-6 space-y-4 border-t border-gray-200 pt-4 mt-4">
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
            
            <div className="pt-4 border-t border-gray-200">
              <Link href="/">
                <Button 
                  className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join Waitlist
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}