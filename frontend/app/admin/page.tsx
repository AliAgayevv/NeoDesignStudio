"use client";

import { Formik } from "formik";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/services/useAuth";

export default function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
          <p>Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={(values) => {
            const errors: { email?: string; password?: string } = {};
            if (!values.email) {
              errors.email = "Email is required";
            }
            if (!values.password) {
              errors.password = "Password is required";
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setIsLoading(true);
              setError("");

              const response = await fetch("http://localhost:4000/api/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: values.email,
                  password: values.password,
                }),
              });

              const data = await response.json();

              if (response.ok) {
                if (data.token) {
                  // Store the JWT token
                  localStorage.setItem("authToken", data.token);

                  // Store user info if available
                  if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                  }

                  router.push("/admin/dashboard");
                } else {
                  // If login successful but no token (fallback)
                  setError("Authentication successful but no token received");
                  console.warn("Login successful but no token provided by API");
                }
              } else {
                // If login failed
                setError(data.message || "Login failed. Please try again.");
              }
            } catch (err) {
              console.error("Login error:", err);
              setError("An error occurred during login. Please try again.");
            } finally {
              setIsLoading(false);
              setSubmitting(false);
            }
          }}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="text"
                  onChange={handleChange}
                  value={values.email}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  onChange={handleChange}
                  value={values.password}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
