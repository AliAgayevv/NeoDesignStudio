"use client";
import React, { useState, useEffect } from "react";
import { useCreateWorkMutation } from "@/store/services/workApi";

const WorkForm = () => {
  const [formData, setFormData] = useState({
    projectId: "",
    content: {
      az: { title: "", description: "" },
      en: { title: "", description: "" },
      ru: { title: "", description: "" },
    },
    images: [] as File[],
  });

  // API mutations with error handling
  const [createWork, { isLoading, isError, error }] = useCreateWorkMutation();

  // Handle input changes for text fields
  const handleContentChange = (
    lang: "az" | "en" | "ru",
    field: "title" | "description",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang],
          [field]: value,
        },
      },
    }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: fileArray,
      }));
    }
  };

  // Form submission handler with detailed logging
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create FormData object for sending files
      const submitFormData = new FormData();

      // Add project ID
      submitFormData.append("projectId", formData.projectId);

      // Add content as JSON string
      const contentString = JSON.stringify(formData.content);
      submitFormData.append("content", contentString);

      // Log what we're sending for debugging
      console.log("Sending projectId:", formData.projectId);
      console.log("Sending content:", contentString);

      // Add image files
      formData.images.forEach((image) => {
        submitFormData.append("images", image);
      });
      console.log("Sending images count:", formData.images.length);

      // IMPORTANT: Check what's in the FormData
      console.log("FormData entries:");
      for (const pair of submitFormData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Send the request
      const response = await createWork(submitFormData).unwrap();
      console.log("Response:", response);

      // Show success message
      alert("Project created successfully!");

      // Reset form after submission
      setFormData({
        projectId: "",
        content: {
          az: { title: "", description: "" },
          en: { title: "", description: "" },
          ru: { title: "", description: "" },
        },
        images: [],
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      alert(`Failed to create project: ${JSON.stringify(err)}`);
    }
  };

  // Display error from RTK Query if present
  useEffect(() => {
    if (isError && error) {
      console.error("RTK Query error:", error);
      if ("data" in error) {
        alert(`Error: ${JSON.stringify(error.data)}`);
      } else {
        alert("An unknown error occurred");
      }
    }
  }, [isError, error]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-20">
      {/* Form fields (same as before) */}
      <div>
        <label className="block text-sm font-medium">Project ID</label>
        <input
          type="text"
          value={formData.projectId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, projectId: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border p-2"
          required
        />
      </div>

      {/* Azerbaijani content */}
      <div className="border p-4 rounded">
        <h3 className="font-bold mb-2">Azerbaijani Content (AZ)</h3>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={formData.content.az.title}
            onChange={(e) => handleContentChange("az", "title", e.target.value)}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={formData.content.az.description}
            onChange={(e) =>
              handleContentChange("az", "description", e.target.value)
            }
            className="mt-1 block w-full rounded-md border p-2"
            rows={4}
            required
          />
        </div>
      </div>

      {/* English content */}
      <div className="border p-4 rounded">
        <h3 className="font-bold mb-2">English Content (EN)</h3>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={formData.content.en.title}
            onChange={(e) => handleContentChange("en", "title", e.target.value)}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={formData.content.en.description}
            onChange={(e) =>
              handleContentChange("en", "description", e.target.value)
            }
            className="mt-1 block w-full rounded-md border p-2"
            rows={4}
            required
          />
        </div>
      </div>

      {/* Russian content */}
      <div className="border p-4 rounded">
        <h3 className="font-bold mb-2">Russian Content (RU)</h3>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={formData.content.ru.title}
            onChange={(e) => handleContentChange("ru", "title", e.target.value)}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={formData.content.ru.description}
            onChange={(e) =>
              handleContentChange("ru", "description", e.target.value)
            }
            className="mt-1 block w-full rounded-md border p-2"
            rows={4}
            required
          />
        </div>
      </div>

      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium">Images</label>
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isLoading ? "Submitting..." : "Create Project"}
        </button>
      </div>
    </form>
  );
};

export default WorkForm;
