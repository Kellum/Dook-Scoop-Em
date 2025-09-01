import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { initGA, initFacebookPixel } from "../lib/analytics";
import { useAnalytics } from "../hooks/use-analytics";
import Home from "@/pages/home";
import LandingMinimal from "@/pages/landing-minimal";
import Residential from "@/pages/residential";
import Commercial from "@/pages/commercial";
import HowWeScoop from "@/pages/how-we-scoop";
import ProductsWeUse from "@/pages/products-we-use";
import Blog from "@/pages/blog";
import AboutUs from "@/pages/about-us";
import Contact from "@/pages/contact";
import Locations from "@/pages/locations-neu";
import AdminLogin from "@/pages/admin/login-neu";
import AdminDashboard from "@/pages/admin/dashboard";

import NotFound from "@/pages/not-found";

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Switch>
      {/* Main waitlist page as home */}
      <Route path="/" component={LandingMinimal} />
      
      {/* Public website pages */}
      <Route path="/residential" component={Residential} />
      <Route path="/commercial" component={Commercial} />
      <Route path="/how-we-scoop" component={HowWeScoop} />
      <Route path="/products-we-use" component={ProductsWeUse} />
      <Route path="/blog" component={Blog} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/contact" component={Contact} />
      
      {/* Legacy/admin pages */}
      <Route path="/home" component={Home} />
      <Route path="/locations" component={Locations} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize analytics when app loads
  useEffect(() => {
    // Check for required environment variables
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
    
    if (!import.meta.env.VITE_FACEBOOK_PIXEL_ID) {
      console.warn('Missing required Facebook Pixel ID: VITE_FACEBOOK_PIXEL_ID');
    } else {
      initFacebookPixel();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
