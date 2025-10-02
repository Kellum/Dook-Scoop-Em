import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setLocation("/sign-in");
    }
  }, [isLoaded, isSignedIn, setLocation]);

  useEffect(() => {
    if (isLoaded && isSignedIn && requireAdmin) {
      // Check if user has admin role in public metadata
      const isAdmin = user?.publicMetadata?.role === "admin";
      if (!isAdmin) {
        setLocation("/dashboard");
      }
    }
  }, [isLoaded, isSignedIn, requireAdmin, user, setLocation]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  if (requireAdmin && user?.publicMetadata?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
