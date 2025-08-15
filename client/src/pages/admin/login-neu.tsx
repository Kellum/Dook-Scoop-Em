import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Shield, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginNeu() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("admin-token", data.token);
      setLocation("/admin/dashboard");
    },
    onError: (error: Error) => {
      setError(error.message || "Login failed");
    },
  });

  const onSubmit = (data: LoginForm) => {
    setError(null);
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md neu-card fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 neu-flat rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-accent" />
          </div>
          
          <h1 className="text-3xl font-bold text-primary mb-2">Admin Portal</h1>
          <p className="vcr-text text-muted-foreground">
            Authorized Access Only
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your username" 
                      {...field} 
                      className="neu-input"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      {...field} 
                      className="neu-input"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-sm" />
                </FormItem>
              )}
            />
            
            {error && (
              <div className="neu-pressed p-4 border-l-4 border-destructive">
                <div className="flex items-center text-destructive">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Login Failed: {error}</span>
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full neu-button py-3 text-lg"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing In..." : "Access Dashboard"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            <span className="pixel-text text-accent">Dook Scoop 'Em</span> Management System
          </p>
        </div>
      </div>
    </div>
  );
}