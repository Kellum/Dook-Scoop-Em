import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, TestTube, DollarSign } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface TestResult {
  success: boolean;
  message: string;
  test_result?: {
    email_check: boolean;
    api_configured: boolean;
  };
  error?: string;
}

interface PricingResult {
  success: boolean;
  pricing?: any;
  error?: string;
}

export default function SweepAndGoTest() {
  const [pricingForm, setPricingForm] = useState({
    zipCode: "",
    numberOfDogs: "1",
    frequency: "weekly",
    lastCleaned: "one_week"
  });

  // Test API connection
  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("admin-token");
      const response = await fetch("/api/admin/sweepandgo/test", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to test connection');
      return response.json();
    },
  });

  // Get pricing mutation
  const pricingMutation = useMutation({
    mutationFn: async (formData: typeof pricingForm) => {
      const token = localStorage.getItem("admin-token");
      const response = await fetch("/api/admin/sweepandgo/pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to get pricing');
      return response.json();
    },
  });

  const handleTestConnection = () => {
    testConnectionMutation.mutate();
  };

  const handleGetPricing = () => {
    pricingMutation.mutate(pricingForm);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sweep&Go API Testing</h2>
        <p className="text-muted-foreground">Test your Sweep&Go API integration and pricing lookup</p>
      </div>

      {/* API Connection Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            API Connection Test
          </CardTitle>
          <CardDescription>
            Test the connection to Sweep&Go's API and verify your credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleTestConnection} 
            disabled={testConnectionMutation.isPending}
            className="w-full sm:w-auto"
          >
            {testConnectionMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                Test API Connection
              </>
            )}
          </Button>

          {testConnectionMutation.data && (
            <div className={`p-4 rounded-lg border ${
              testConnectionMutation.data.success 
                ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {testConnectionMutation.data.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">{testConnectionMutation.data.message}</span>
              </div>
              
              {testConnectionMutation.data.test_result && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={testConnectionMutation.data.test_result.api_configured ? "default" : "destructive"}>
                      API Configured: {testConnectionMutation.data.test_result.api_configured ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Email check test result: {testConnectionMutation.data.test_result.email_check ? "Found" : "Not found"}
                  </div>
                </div>
              )}
              
              {testConnectionMutation.data.error && (
                <div className="text-sm text-red-600 mt-2">
                  Error: {testConnectionMutation.data.error}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing Lookup Test
          </CardTitle>
          <CardDescription>
            Test pricing calculation using Sweep&Go's pricing API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={pricingForm.zipCode}
                onChange={(e) => setPricingForm({...pricingForm, zipCode: e.target.value})}
                placeholder="32097"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numberOfDogs">Number of Dogs</Label>
              <Select 
                value={pricingForm.numberOfDogs} 
                onValueChange={(value) => setPricingForm({...pricingForm, numberOfDogs: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number of dogs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Dog</SelectItem>
                  <SelectItem value="2">2 Dogs</SelectItem>
                  <SelectItem value="3">3 Dogs</SelectItem>
                  <SelectItem value="4">4+ Dogs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frequency">Service Frequency</Label>
              <Select 
                value={pricingForm.frequency} 
                onValueChange={(value) => setPricingForm({...pricingForm, frequency: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi_weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="two_times_a_week">Twice Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastCleaned">Last Cleaned</Label>
              <Select 
                value={pricingForm.lastCleaned} 
                onValueChange={(value) => setPricingForm({...pricingForm, lastCleaned: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="When was it last cleaned?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_week">1 Week Ago</SelectItem>
                  <SelectItem value="one_month">1 Month Ago</SelectItem>
                  <SelectItem value="three_months">3+ Months Ago</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGetPricing} 
            disabled={pricingMutation.isPending || !pricingForm.zipCode}
            className="w-full sm:w-auto"
          >
            {pricingMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Getting Pricing...
              </>
            ) : (
              <>
                <DollarSign className="h-4 w-4 mr-2" />
                Get Pricing
              </>
            )}
          </Button>

          {pricingMutation.data && (
            <div className={`p-4 rounded-lg border ${
              pricingMutation.data.success 
                ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
            }`}>
              {pricingMutation.data.success ? (
                <div>
                  <h4 className="font-medium mb-3">Pricing Result:</h4>
                  {pricingMutation.data.pricing ? (
                    <div className="space-y-3">
                      {/* Display pricing in a user-friendly format */}
                      {pricingMutation.data.pricing.initial_price && (
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <span className="font-medium">Initial Cleanup:</span>
                          <span className="text-lg font-bold text-green-600">
                            ${pricingMutation.data.pricing.initial_price}
                          </span>
                        </div>
                      )}
                      {pricingMutation.data.pricing.recurring_price && (
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <span className="font-medium">Recurring Service:</span>
                          <span className="text-lg font-bold text-blue-600">
                            ${pricingMutation.data.pricing.recurring_price}
                          </span>
                        </div>
                      )}
                      {pricingMutation.data.pricing.frequency && (
                        <div className="text-sm text-muted-foreground">
                          Frequency: {pricingMutation.data.pricing.frequency}
                        </div>
                      )}
                      {/* Show raw data in collapsed section */}
                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                          View Raw API Response
                        </summary>
                        <pre className="text-xs bg-muted p-3 rounded mt-2 overflow-auto">
                          {JSON.stringify(pricingMutation.data.pricing, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No pricing data returned</div>
                  )}
                </div>
              ) : (
                <div className="text-red-600">
                  <strong>Error:</strong> {pricingMutation.data.error}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}