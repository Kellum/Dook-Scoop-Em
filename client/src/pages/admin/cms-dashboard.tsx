import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { VisualEditor } from "@/components/ui/visual-editor";
import { 
  Layout, 
  Edit3, 
  Settings,
  FileText, 
  Image, 
  Globe,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  Search,
  Save,
  Monitor,
  Smartphone,
  ArrowLeft
} from "lucide-react";
import type { Page, PageContent, SeoSettings, MediaAsset } from "@shared/schema";

interface CmsData {
  pages: Page[];
  content: PageContent[];
  seoSettings: SeoSettings | null;
}

export default function CMSDashboard() {
  const [, setLocation] = useLocation();
  const [visualEditMode, setVisualEditMode] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setLocation("/admin/login");
      return;
    }
  }, [setLocation]);

  // Fetch all CMS data
  const { data: pagesData, isLoading: pagesLoading } = useQuery<{pages: Page[]}>({
    queryKey: ["/api/cms/pages"],
    queryFn: async () => {
      const token = localStorage.getItem("admin-token");
      const response = await fetch("/api/cms/pages", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch pages');
      return response.json();
    },
  });

  const { data: mediaData, isLoading: mediaLoading } = useQuery<{assets: MediaAsset[]}>({
    queryKey: ["/api/cms/media"],
    queryFn: async () => {
      const token = localStorage.getItem("admin-token");
      const response = await fetch("/api/cms/media", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch media assets');
      return response.json();
    },
  });

  // Initialize CMS data mutation
  const initializeMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("admin-token");
      return apiRequest("POST", "/api/cms/initialize", {}, {
        'Authorization': `Bearer ${token}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/pages"] });
      toast({
        title: "CMS Initialized",
        description: "Sample pages and content have been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initialize CMS data. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Content update mutation
  const contentMutation = useMutation({
    mutationFn: async ({ elementId, content, contentType, metadata }: {
      elementId: string;
      content: string;
      contentType: string;
      metadata?: any;
    }) => {
      const token = localStorage.getItem("admin-token");
      return apiRequest("POST", "/api/cms/content", {
        pageId: selectedPageId,
        elementId,
        content,
        contentType,
        metadata: metadata ? JSON.stringify(metadata) : undefined
      }, {
        'Authorization': `Bearer ${token}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/pages"] });
      toast({
        title: "Content Updated",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Page creation mutation
  const createPageMutation = useMutation({
    mutationFn: async (pageData: { slug: string; title: string; status: string }) => {
      const token = localStorage.getItem("admin-token");
      return apiRequest("POST", "/api/cms/pages", pageData, {
        'Authorization': `Bearer ${token}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/pages"] });
      toast({
        title: "Page Created",
        description: "New page has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create page. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVisualEdit = (elementId: string, content: string, contentType: string, metadata?: any) => {
    contentMutation.mutate({ elementId, content, contentType, metadata });
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const slug = formData.get("slug") as string;
    const title = formData.get("title") as string;
    
    createPageMutation.mutate({
      slug: slug.startsWith('/') ? slug : `/${slug}`,
      title,
      status: "draft"
    });
  };

  if (pagesLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="neu-card p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading CMS Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <VisualEditor
        isEnabled={visualEditMode}
        onToggleEdit={() => setVisualEditMode(!visualEditMode)}
        onSave={handleVisualEdit}
      />

      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/admin/dashboard")}
              variant="outline"
              className="neu-flat flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <Layout className="h-8 w-8 text-accent" />
                Content Management System
              </h1>
              <p className="text-muted-foreground">
                Manage your website content, pages, and SEO settings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setVisualEditMode(!visualEditMode)}
              variant={visualEditMode ? "default" : "outline"}
              className="neu-flat flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              {visualEditMode ? "Exit Visual Edit" : "Visual Editor"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="pages" className="space-y-6">
          <TabsList className="neu-flat">
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Pages Tab */}
          <TabsContent value="pages" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Pages List */}
              <div className="lg:col-span-2">
                <Card className="neu-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Website Pages
                      </CardTitle>
                      <Badge variant="secondary" className="neu-flat">
                        {pagesData?.pages.length || 0} pages
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pagesData?.pages.map((page) => (
                      <div
                        key={page.id}
                        className="flex items-center justify-between p-4 border rounded-lg neu-flat"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-primary">{page.title}</h3>
                          <p className="text-sm text-muted-foreground">{page.slug}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant={page.status === 'published' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {page.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Updated {new Date(page.updatedAt!).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPageId(page.id);
                              setVisualEditMode(true);
                            }}
                            className="neu-flat"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(page.slug === '/' ? '/' : page.slug, '_blank')}
                            className="neu-flat"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {(!pagesData?.pages || pagesData.pages.length === 0) && (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">No pages found. Initialize CMS or create your first page!</p>
                        <Button 
                          onClick={() => initializeMutation.mutate()}
                          disabled={initializeMutation.isPending}
                          variant="outline"
                          className="neu-flat"
                        >
                          {initializeMutation.isPending ? "Initializing..." : "Initialize Sample Pages"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Create New Page */}
              <div>
                <Card className="neu-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Create New Page
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreatePage} className="space-y-4">
                      <div>
                        <Label htmlFor="page-title">Page Title</Label>
                        <Input
                          id="page-title"
                          name="title"
                          placeholder="About Us"
                          className="neu-input"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="page-slug">URL Path</Label>
                        <Input
                          id="page-slug"
                          name="slug"
                          placeholder="/about"
                          className="neu-input"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={createPageMutation.isPending}
                        className="w-full neu-button"
                      >
                        {createPageMutation.isPending ? "Creating..." : "Create Page"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Quick Tips */}
                <Card className="neu-card mt-6">
                  <CardHeader>
                    <CardTitle className="text-sm">Visual Editor Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="text-muted-foreground">
                      • Click "Visual Editor" to start editing
                    </p>
                    <p className="text-muted-foreground">
                      • Look for blue highlighted areas
                    </p>
                    <p className="text-muted-foreground">
                      • Click any highlighted element to edit
                    </p>
                    <p className="text-muted-foreground">
                      • Changes save automatically
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            <Card className="neu-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Media Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Image className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Media management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <Card className="neu-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  SEO Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Globe className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">SEO management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="neu-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  CMS Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Settings coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}