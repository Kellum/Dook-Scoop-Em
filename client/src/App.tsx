import React, { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAnalytics } from "../hooks/use-analytics";
import { AuthProvider } from "./contexts/auth-context";

// Theme Switcher Component
function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>('alternate');

  useEffect(() => {
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('theme-preference') || 'alternate';
    setCurrentTheme(savedTheme);
    
    // Apply theme to document
    if (savedTheme === 'alternate') {
      document.documentElement.setAttribute('data-theme', 'alternate');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'default' ? 'alternate' : 'default';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme-preference', newTheme);
    
    // Apply theme to document
    if (newTheme === 'alternate') {
      document.documentElement.setAttribute('data-theme', 'alternate');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      className="theme-switcher"
      title={`Switch to ${currentTheme === 'default' ? 'alternate' : 'default'} theme`}
    >
🧡
    </button>
  );
}
import Home from "@/pages/home";
import LandingMinimal from "@/pages/landing-minimal";
import LandingMinimalEastJax from "@/pages/landing-minimal-eastjax";
import WaitlistMap from "@/pages/waitlist-map";
import Residential from "@/pages/residential";
import Commercial from "@/pages/commercial";
import ProductsWeUse from "@/pages/products-we-use";
import Blog from "@/pages/blog";
import AboutUs from "@/pages/about-us";
import Contact from "@/pages/contact";
import Onboard from "@/pages/onboard";
import OnboardNew from "@/pages/onboard-new";
import Locations from "@/pages/locations-neu";
import AdminLogin from "@/pages/admin/login-neu";
import AdminDashboardOld from "@/pages/admin/dashboard";

// Auth and dashboards
import SignInPage from "@/pages/auth/sign-in";
import SignUpPage from "@/pages/auth/sign-up";
import AdminSignUpPage from "@/pages/admin/signup";
import CustomerDashboard from "@/pages/dashboard/index";
import AdminDashboard from "@/pages/admin/dashboard-new";
import { ProtectedRoute } from "@/components/protected-route";

import NotFound from "@/pages/not-found";

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  // Get current location to detect route changes
  const [location] = useLocation();
  
  // Scroll to top whenever route changes
  useEffect(() => {
    // Force immediate scroll to top with multiple approaches
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    // Try immediately
    scrollToTop();
    
    // Try again after a brief delay to ensure DOM is ready
    setTimeout(scrollToTop, 10);
    
    // One more attempt after a longer delay for slower renders
    setTimeout(scrollToTop, 100);
  }, [location]);
  
  return (
    <Switch>
      {/* Main business website as home */}
      <Route path="/" component={Home} />
      
      {/* Authentication routes */}
      <Route path="/sign-in" component={SignInPage} />
      <Route path="/sign-up" component={SignUpPage} />
      <Route path="/admin/signup" component={AdminSignUpPage} />
      
      {/* Customer Dashboard - Protected */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <CustomerDashboard />
        </ProtectedRoute>
      </Route>
      
      {/* Admin Dashboard - Protected & Admin Only */}
      <Route path="/admin">
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      
      {/* Waitlist area selector page */}
      <Route path="/waitlist" component={WaitlistMap} />
      
      {/* Waitlist pages at specific URLs */}
      <Route path="/waitlist/northJax-yulee-dina" component={LandingMinimal} />
      <Route path="/waitlist/eastJax-beaches" component={LandingMinimalEastJax} />
      
      {/* Public website pages */}
      <Route path="/residential" component={Residential} />
      <Route path="/commercial" component={Commercial} />
      <Route path="/products-we-use" component={ProductsWeUse} />
      <Route path="/blog" component={Blog} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/contact" component={Contact} />
      <Route path="/onboard" component={OnboardNew} />
      <Route path="/onboard-old" component={Onboard} />
      
      {/* Legacy/admin pages */}
      <Route path="/home" component={Home} />
      <Route path="/locations" component={Locations} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard-old" component={AdminDashboardOld} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <ThemeSwitcher />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
