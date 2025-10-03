import { useEffect } from "react";
import { useLocation } from "wouter";

export default function SignUpPage() {
  const [, setLocation] = useLocation();

  // Redirect to onboarding - customers must sign up through the proper flow
  useEffect(() => {
    setLocation("/onboard");
  }, [setLocation]);

  return null;
}
