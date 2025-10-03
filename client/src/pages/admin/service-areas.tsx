import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { Link } from "wouter";

interface ServiceLocation {
  id: string;
  city: string;
  state: string;
  zipCodes: string[];
  launchDate: string | null;
  isActive: string;
}

export default function ServiceAreasAdmin() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLocation, setNewLocation] = useState({
    city: "",
    state: "",
    zipCodes: "",
    isActive: "true",
  });
  const { toast } = useToast();

  const { data: locations, isLoading } = useQuery<{ locations: ServiceLocation[] }>({
    queryKey: ["/api/admin/locations"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof newLocation) => {
      return apiRequest("POST", "/api/admin/locations", {
        ...data,
        zipCodes: data.zipCodes.split(",").map((z) => z.trim()),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/locations"] });
      setNewLocation({ city: "", state: "", zipCodes: "", isActive: "true" });
      toast({ title: "Service area created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create service area", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ServiceLocation>;
    }) => {
      return apiRequest("PATCH", `/api/admin/locations/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/locations"] });
      setEditingId(null);
      toast({ title: "Service area updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update service area", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/locations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/locations"] });
      toast({ title: "Service area deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete service area", variant: "destructive" });
    },
  });

  const handleToggleActive = (id: string, currentStatus: string) => {
    updateMutation.mutate({
      id,
      data: { isActive: currentStatus === "true" ? "false" : "true" },
    });
  };

  const handleCreate = () => {
    if (!newLocation.city || !newLocation.state || !newLocation.zipCodes) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(newLocation);
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Service Areas</h1>
            <p className="text-gray-600">Manage approved zip codes for customer onboarding</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" data-testid="button-back-to-dashboard">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Add New Service Area */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Service Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newLocation.city}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, city: e.target.value })
                  }
                  placeholder="Jacksonville"
                  data-testid="input-new-city"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newLocation.state}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, state: e.target.value })
                  }
                  maxLength={2}
                  placeholder="FL"
                  data-testid="input-new-state"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="zipCodes">Zip Codes (comma-separated)</Label>
                <Input
                  id="zipCodes"
                  value={newLocation.zipCodes}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, zipCodes: e.target.value })
                  }
                  placeholder="32256, 32257, 32258"
                  data-testid="input-new-zip-codes"
                />
              </div>
            </div>
            <Button
              onClick={handleCreate}
              className="mt-4 bg-orange-600 hover:bg-orange-700"
              data-testid="button-create-service-area"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service Area
            </Button>
          </CardContent>
        </Card>

        {/* Existing Service Areas */}
        <div className="space-y-4">
          {locations?.locations.map((location) => (
            <Card key={location.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-orange-600" />
                      <h3 className="text-xl font-bold">
                        {location.city}, {location.state}
                      </h3>
                      <Switch
                        checked={location.isActive === "true"}
                        onCheckedChange={() =>
                          handleToggleActive(location.id, location.isActive)
                        }
                        data-testid={`switch-active-${location.id}`}
                      />
                      <span className="text-sm text-gray-500">
                        {location.isActive === "true" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        Approved Zip Codes:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {location.zipCodes.map((zip) => (
                          <span
                            key={zip}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                            data-testid={`zip-code-${zip}`}
                          >
                            {zip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(location.id)}
                    data-testid={`button-delete-${location.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {locations?.locations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Service Areas
              </h3>
              <p className="text-gray-500">
                Add your first service area to start accepting customers
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
