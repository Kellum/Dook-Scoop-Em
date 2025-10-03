import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Database, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function MigrateCustomers() {
  const [migrating, setMigrating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleMigrate = async () => {
    if (!confirm("This will sync all active Stripe subscriptions to your CRM database. Continue?")) {
      return;
    }

    setMigrating(true);
    setResults(null);

    try {
      const response = await apiRequest("/api/admin/migrate-stripe-customers", {
        method: "POST",
      });

      setResults(response.results);
      
      toast({
        title: "Migration Complete!",
        description: `Processed ${response.results.processed} subscriptions. Created ${response.results.created} customers.`,
      });
    } catch (error) {
      toast({
        title: "Migration Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/admin">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6 text-orange-600" />
              Stripe Customer Migration
            </CardTitle>
            <CardDescription>
              Sync existing Stripe customers and subscriptions into your CRM database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Instructions */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This tool will:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Fetch all active Stripe subscriptions</li>
                  <li>Match customers to Supabase users by email</li>
                  <li>Create customer and subscription records in your database</li>
                  <li>Skip existing customers (safe to run multiple times)</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Action Button */}
            <div className="flex gap-4 items-center">
              <Button
                onClick={handleMigrate}
                disabled={migrating}
                className="bg-orange-600 hover:bg-orange-700 text-white"
                data-testid="button-migrate"
              >
                {migrating ? "Migrating..." : "Start Migration"}
              </Button>
              {migrating && (
                <span className="text-gray-600 animate-pulse">
                  This may take a minute for large customer lists...
                </span>
              )}
            </div>

            {/* Results */}
            {results && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Migration Results</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{results.processed}</div>
                    <div className="text-sm text-gray-600">Subscriptions Processed</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{results.created}</div>
                    <div className="text-sm text-gray-600">Customers Created</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{results.skipped}</div>
                    <div className="text-sm text-gray-600">Already Existed</div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{results.errors.length}</div>
                    <div className="text-sm text-gray-600">Errors</div>
                  </div>
                </div>

                {/* Errors */}
                {results.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-600 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Errors (Manual Review Required)
                    </h4>
                    <div className="bg-red-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                      {results.errors.map((error: any, idx: number) => (
                        <div key={idx} className="text-sm mb-2 pb-2 border-b border-red-200 last:border-0">
                          <div className="font-mono text-xs text-gray-600">
                            Subscription: {error.subscriptionId}
                          </div>
                          {error.email && (
                            <div className="text-xs text-gray-600">Email: {error.email}</div>
                          )}
                          <div className="text-red-700">{error.error}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {results.errors.length === 0 && results.created > 0 && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      All customers migrated successfully! They can now see their subscriptions in their dashboards.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
