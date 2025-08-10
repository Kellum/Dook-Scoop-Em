import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md metal-panel retro-border p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 action-button rounded-sm flex items-center justify-center">
              <Shield className="h-8 w-8 text-yellow-300" />
            </div>
          </div>
          <h1 className="text-3xl font-bold glow-red font-serif mb-2">Admin Login</h1>
          <p className="text-yellow-300 font-mono">
            Authorized Personnel Only
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-300 font-mono font-bold">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter username" 
                      {...field} 
                      className="bg-gray-900 border-yellow-600 text-yellow-300 font-mono retro-border"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-300 font-mono font-bold">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter password" 
                      {...field} 
                      className="bg-gray-900 border-yellow-600 text-yellow-300 font-mono retro-border"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            {error && (
              <div className="metal-panel p-4 border-red-600">
                <div className="flex items-center text-red-400">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="font-mono font-bold">Login Failed: {error}</span>
                </div>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full action-button py-3 text-xl font-mono font-bold text-yellow-300"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging In..." : "Access Dashboard"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}