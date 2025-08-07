import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Users, Plus, LogOut, AlertCircle, CheckCircle } from "lucide-react";
import { insertServiceLocationSchema, type ServiceLocation, type WaitlistSubmission } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

type LocationForm = typeof insertServiceLocationSchema._type;

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const queryClient = useQueryClient();

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setLocation("/admin/login");
      return;
    }
  }, [setLocation]);

  const form = useForm<LocationForm>({
    resolver: zodResolver(insertServiceLocationSchema),
    defaultValues: {
      city: "",
      state: "TX",
      zipCodes: [],
      launchDate: "",
      isActive: "false",
    },
  });

  const { data: locationsData, isLoading: locationsLoading } = useQuery<{locations: ServiceLocation[]}>({
    queryKey: ["/api/admin/locations"],
    queryFn: async () => {
      const token = localStorage.getItem("admin-token");
      const response = await fetch("/api/admin/locations", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch locations');
      return response.json();
    },
    retry: false,
  });

  const { data: waitlistData, isLoading: waitlistLoading } = useQuery<{submissions: WaitlistSubmission[]}>({
    queryKey: ["/api/admin/waitlist"],
    queryFn: async () => {
      const token = localStorage.getItem("admin-token");
      const response = await fetch("/api/admin/waitlist", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch waitlist');
      return response.json();
    },
    retry: false,
  });

  const addLocationMutation = useMutation({
    mutationFn: async (data: LocationForm) => {
      const token = localStorage.getItem("admin-token");
      const zipCodesArray = typeof data.zipCodes === 'string' 
        ? data.zipCodes.split(',').map((zip: string) => zip.trim()).filter((zip: string) => zip.length > 0)
        : data.zipCodes as string[];
      
      const response = await apiRequest("POST", "/api/admin/locations", {
        ...data,
        zipCodes: zipCodesArray,
      });
      
      // Set authorization header manually for admin endpoints
      const headers = new Headers();
      headers.set('Authorization', `Bearer ${token}`);
      
      const adminResponse = await fetch("/api/admin/locations", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          zipCodes: zipCodesArray,
        }),
      });
      
      if (!adminResponse.ok) throw new Error('Failed to create location');
      return adminResponse.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/locations"] });
      setIsAddLocationOpen(false);
      form.reset();
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    setLocation("/admin/login");
  };

  const onSubmit = (data: LocationForm) => {
    addLocationMutation.mutate(data);
  };

  const locations = locationsData?.locations || [];
  const submissions = waitlistData?.submissions || [];

  if (locationsLoading && waitlistLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">
              Dook Scoop Em Admin
            </h1>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Areas</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{locations.length}</div>
              <p className="text-xs text-muted-foreground">
                Total configured locations
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waitlist Signups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
              <p className="text-xs text-muted-foreground">
                Total waitlist submissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="locations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="locations">Service Locations</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
          </TabsList>

          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Service Locations</CardTitle>
                    <CardDescription>Manage areas where service will be available</CardDescription>
                  </div>
                  <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Location
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Service Location</DialogTitle>
                        <DialogDescription>
                          Add a new area where Dook Scoop Em will provide service
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Austin" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="TX" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="zipCodes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Zip Codes</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="78701, 78702, 78703" 
                                    {...field}
                                    value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="launchDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Launch Date (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="March 2025" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {addLocationMutation.error && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                {(addLocationMutation.error as Error).message}
                              </AlertDescription>
                            </Alert>
                          )}
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsAddLocationOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={addLocationMutation.isPending}>
                              {addLocationMutation.isPending ? "Adding..." : "Add Location"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {locations.map((location) => (
                    <Card key={location.id} className="shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {location.city}, {location.state}
                        </CardTitle>
                        <Badge variant="secondary" className="w-fit">
                          {location.isActive === "true" ? "Active" : "Coming Soon"}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        {location.launchDate && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Launch: {location.launchDate}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {location.zipCodes?.slice(0, 3).map((zip) => (
                            <Badge key={zip} variant="outline" className="text-xs">
                              {zip}
                            </Badge>
                          ))}
                          {location.zipCodes && location.zipCodes.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{location.zipCodes.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="waitlist">
            <Card>
              <CardHeader>
                <CardTitle>Waitlist Submissions</CardTitle>
                <CardDescription>All customer waitlist signups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {submissions.map((submission) => (
                    <Card key={submission.id} className="shadow-sm">
                      <CardContent className="pt-4">
                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <p className="text-sm font-medium">{submission.name}</p>
                            <p className="text-xs text-muted-foreground">{submission.email}</p>
                          </div>
                          <div>
                            <p className="text-sm">{submission.address}</p>
                            <p className="text-xs text-muted-foreground">
                              {submission.zipCode} • {submission.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm">
                              {submission.numberOfDogs} dog{submission.numberOfDogs !== "1" ? "s" : ""}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {submissions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No waitlist submissions yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}