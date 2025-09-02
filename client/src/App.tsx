import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAnalytics } from "../hooks/use-analytics";
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
import Locations from "@/pages/locations-neu";
import AdminLogin from "@/pages/admin/login-neu";
import AdminDashboard from "@/pages/admin/dashboard";

import NotFound from "@/pages/not-found";

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Switch>
      {/* Main business website as home */}
      <Route path="/" component={Home} />
      
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
