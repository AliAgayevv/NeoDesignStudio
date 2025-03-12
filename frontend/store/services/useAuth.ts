import { useEffect } from "react";

export const useAuth = () => {
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      window.location.href = "/admin";
    }
  }, []);
};
