"use client";

import { useState } from "react";

export default function CreateProject() {
  const [projectId, setProjectId] = useState("");
  const [images, setImages] = useState([]);
  const [content, setContent] = useState({
    az: { title: "", description: "" },
    en: { title: "", description: "" },
    ru: { title: "", description: "" },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("content")) {
      const [lang, field] = name.split("."); // Get the language and field (e.g., az.title)
      setContent((prevContent) => ({
        ...prevContent,
        [lang]: { ...prevContent[lang], [field]: value },
      }));
    } else if (name === "images") {
      // Handle file input (multiple files)
      const files = Array.from(e.target.files);
      setImages(files);
    } else {
      // Handle other fields (e.g., projectId)
      setProjectId(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("projectId", projectId);

    // Append the selected images to the form data
    images.forEach((image) => {
      formData.append("images", image);
    });

    // Append content data
    formData.append("content", JSON.stringify(content));

    try {
      const res = await fetch(
        "https://neodesignstudio.onrender.com/api/portfolio",
        {
          method: "POST",
          body: formData, // Send the FormData object
        },
      );

      if (res.ok) {
        alert("Project created successfully!");
      } else {
        alert("Failed to create project");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="py-20 bg-black text-blue-200">
      <h1>Create New Project</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project ID</label>
          <input
            type="text"
            name="projectId"
            value={projectId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Images (select images)</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleChange}
            required
          />
        </div>

        <h3>Content (AZ, EN, RU)</h3>
        <div>
          <label>Azerbaijani Title</label>
          <input
            type="text"
            name="content.az.title"
            value={content.az.title}
            onChange={handleChange}
            required
          />
          <label>Azerbaijani Description</label>
          <input
            type="text"
            name="content.az.description"
            value={content.az.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>English Title</label>
          <input
            type="text"
            name="content.en.title"
            value={content.en.title}
            onChange={handleChange}
            required
          />
          <label>English Description</label>
          <input
            type="text"
            name="content.en.description"
            value={content.en.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Russian Title</label>
          <input
            type="text"
            name="content.ru.title"
            value={content.ru.title}
            onChange={handleChange}
            required
          />
          <label>Russian Description</label>
          <input
            type="text"
            name="content.ru.description"
            value={content.ru.description}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Create Project</button>
      </form>
    </div>
  );
}
