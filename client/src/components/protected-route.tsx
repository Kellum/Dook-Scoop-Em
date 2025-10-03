import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/sign-in");
    }
  }, [loading, user, setLocation]);

  useEffect(() => {
    if (!loading && user && requireAdmin) {
      const isAdmin = user.user_metadata?.role === "admin";
      if (!isAdmin) {
        setLocation("/dashboard");
      }
    }
  }, [loading, user, requireAdmin, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && user.user_metadata?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
