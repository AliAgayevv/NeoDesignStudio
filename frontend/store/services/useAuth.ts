import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // If no token exists, redirect to login
        if (!token) {
          router.push("/admin");
          return;
        }

        // Verify token
        const response = await fetch("/api/login/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        });

        if (response.ok) {
          // Token is valid
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired
          localStorage.removeItem("authToken");
          localStorage.removeItem("isAuthenticated");
          router.push("/admin");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/admin");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    router.push("/admin");
  };

  return { isLoading, isAuthenticated, user };
};
