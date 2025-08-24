import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import LandingMinimal from "@/pages/landing-minimal";
import Locations from "@/pages/locations-neu";
import AdminLogin from "@/pages/admin/login-neu";
import AdminDashboard from "@/pages/admin/dashboard";
import EditWebsite from "@/pages/admin/edit-website";
import CMSDashboard from "@/pages/admin/cms-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingMinimal} />
      <Route path="/home" component={Home} />
      <Route path="/locations" component={Locations} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/edit-website" component={EditWebsite} />
      <Route path="/admin/cms" component={CMSDashboard} />
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
