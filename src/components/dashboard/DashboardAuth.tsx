"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Loading from "@/components/ui/loading";

interface DashboardAuthProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "customer" | "all";
}

export default function DashboardAuth({
  children,
  requiredRole = "all",
}: DashboardAuthProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Simulate auth check
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!isAuthenticated) {
        router.push("/");
        return;
      }

      // Check role-based access if specified
      if (requiredRole !== "all" && user?.role !== requiredRole) {
        router.push("/");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [isAuthenticated, user, router, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading
          variant="loading"
          title="Verifying access..."
          message="Please wait while we verify your permissions."
          size="lg"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
