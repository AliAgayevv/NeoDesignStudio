"use client";

import { Formik } from "formik";
import { useState } from "react";

export default function Login() {
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={(values) => {
            if (values.username === "neo" && values.password === "hebib825") {
              localStorage.setItem("isAuthenticated", "true");
              window.location.href = "/admin/dashboard";
            } else {
              setError("Invalid credentials");
            }
          }}
        >
          {({ handleSubmit, handleChange, values }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  onChange={handleChange}
                  value={values.username}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
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
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Login
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
