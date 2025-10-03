import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Settings as SettingsIcon } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900" data-testid="heading-settings">
              Settings
            </h1>
            <p className="text-gray-600">Configure business settings</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" data-testid="button-back-to-dashboard">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Business Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <SettingsIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">
                Business settings configuration will be available here soon.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
