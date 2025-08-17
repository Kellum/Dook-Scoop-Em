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
  const { data: testResult, isLoading: testLoading, refetch: testConnection } = useQuery<TestResult>({
    queryKey: ["/api/admin/sweepandgo/test"],
    retry: false,
    enabled: false, // Don't auto-run, only on manual trigger
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
    testConnection();
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
            disabled={testLoading}
            className="w-full sm:w-auto"
          >
            {testLoading ? (
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

          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult.success 
                ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {testResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">{testResult.message}</span>
              </div>
              
              {testResult.test_result && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={testResult.test_result.api_configured ? "default" : "destructive"}>
                      API Configured: {testResult.test_result.api_configured ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Email check test result: {testResult.test_result.email_check ? "Found" : "Not found"}
                  </div>
                </div>
              )}
              
              {testResult.error && (
                <div className="text-sm text-red-600 mt-2">
                  Error: {testResult.error}
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
                  <h4 className="font-medium mb-2">Pricing Result:</h4>
                  <pre className="text-sm bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(pricingMutation.data.pricing, null, 2)}
                  </pre>
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