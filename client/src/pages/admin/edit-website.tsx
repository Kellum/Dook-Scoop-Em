import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, ExternalLink } from "lucide-react";

export default function EditWebsite() {
  const [, setLocation] = useLocation();
  const [selectedPage, setSelectedPage] = useState("");

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setLocation("/admin/login");
      return;
    }
  }, [setLocation]);

  const pages = [
    { id: "homepage", name: "Homepage", url: "/" },
    // Add more pages here as needed
  ];

  const handleEditPage = (pageUrl: string, pageName: string) => {
    // Set editing mode in localStorage
    localStorage.setItem("edit-mode", "true");
    localStorage.setItem("edit-page", pageUrl);
    
    // Open page in new tab for editing
    window.open(pageUrl, "_blank");
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/admin")}
              variant="outline"
              className="neu-flat"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">Edit Website</h1>
              <p className="text-muted-foreground">
                Select a page to edit text, colors, and images
              </p>
            </div>
          </div>
        </div>

        {/* Page Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card key={page.id} className="neu-raised hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {page.name}
                  <Edit className="h-5 w-5 text-accent" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Click to edit this page directly
                </p>
                <Button
                  onClick={() => handleEditPage(page.url, page.name)}
                  className="w-full neu-flat"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Edit {page.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="mt-8 neu-flat">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">How to Edit:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Click "Edit [Page Name]" to open the page in edit mode</li>
              <li>Hover over text to see edit options</li>
              <li>Click text to edit it inline</li>
              <li>Click colors to change them with a color picker</li>
              <li>Changes save automatically as you type</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}