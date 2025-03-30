import React, { useRef } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import {
  useCreateWorkMutation,
  useUpdateWorkMutation,
} from "@/store/services/workApi";
import { Project } from "./types";
import useOutsideClick from "@/utils/hooks/useOutsideClick";
import { GrFormClose } from "react-icons/gr";

interface ProjectFormProps {
  onClose: () => void;
  initialValues?: Project | null;
}

export default function ProjectForm({
  onClose,
  initialValues,
}: ProjectFormProps) {
  // Create and update mutations
  const [createWork] = useCreateWorkMutation();
  const [updateWork] = useUpdateWorkMutation();
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    onClose();
  });

  // Default values for the form if no initial data is provided
  const initialData: Project = {
    projectId: "",
    description: { az: "", en: "", ru: "" },
    title: { az: "", en: "", ru: "" },
    location: { az: "", en: "", ru: "" },
    area: 0,
    images: [],
    ...initialValues,
    _id: initialValues?._id ? initialValues?._id : "",
  };

  const handleSubmit = async (
    values: Project,
    { setSubmitting }: FormikHelpers<Project>,
  ) => {
    try {
      const formData = new FormData();

      // Append simple fields
      formData.append("projectId", values.projectId);
      formData.append("area", values.area.toString());

      // Append nested objects (description, title, location) using bracket notation
      Object.entries(values.description).forEach(([lang, value]) => {
        formData.append(`description[${lang}]`, value);
      });

      Object.entries(values.title).forEach(([lang, value]) => {
        formData.append(`title[${lang}]`, value);
      });

      Object.entries(values.location).forEach(([lang, value]) => {
        formData.append(`location[${lang}]`, value);
      });

      // Don't append images for update, only for create
      if (!initialValues?.projectId) {
        if (values.images && values.images.length > 0) {
          Array.from(values.images).forEach((file) => {
            formData.append("images", file);
          });
        }
      }

      // Handle create vs. update
      if (initialValues?.projectId) {
        // Send the content as a property in the body
        await updateWork({
          id: initialValues.projectId,
          content: {
            projectId: values.projectId,
            description: values.description,
            title: values.title,
            location: values.location,
            area: values.area,
          },
        });
      } else {
        await createWork(formData);
      }

      // Close the form after submitting
      onClose();
    } catch (submitError) {
      console.error("Submission error:", submitError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        ref={ref}
      >
        <Formik
          initialValues={initialData}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors: any = {};
            if (!values.projectId) errors.projectId = "Required";
            if (values.area <= 0) errors.area = "Must be greater than 0";
            return errors;
          }}
        >
          {({ values, setFieldValue, touched, errors }) => (
            <Form className="space-y-4" encType="multipart/form-data">
              <button
                className="rounded-full p-2 ml-auto bg-blue-500 flex justify-center items-center"
                onClick={() => onClose()}
              >
                <GrFormClose size={24} color="white" />
              </button>
              {/* Project Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="projectId" className="block mb-2">
                    Project ID
                    {touched.projectId && errors.projectId && (
                      <span className="text-red-500 ml-2 text-sm">
                        {errors.projectId}
                      </span>
                    )}
                  </label>
                  <input
                    id="projectId"
                    name="projectId"
                    value={values.projectId}
                    onChange={(e) => setFieldValue("projectId", e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label htmlFor="area" className="block mb-2">
                    Area
                    {touched.area && errors.area && (
                      <span className="text-red-500 ml-2 text-sm">
                        {errors.area}
                      </span>
                    )}
                  </label>
                  <input
                    id="area"
                    type="number"
                    name="area"
                    value={values.area}
                    onChange={(e) =>
                      setFieldValue("area", Number(e.target.value))
                    }
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              {/* Multilingual Sections */}
              {(["az", "en", "ru"] as const).map((lang) => (
                <div key={lang} className="border p-4 rounded mb-4">
                  <h3 className="font-bold mb-3 text-lg">
                    {lang.toUpperCase()} Language Section
                  </h3>

                  <div className="space-y-3">
                    {/* Title Input */}
                    <div>
                      <label htmlFor={`title-${lang}`} className="block mb-2">
                        Title ({lang.toUpperCase()})
                      </label>
                      <input
                        id={`title-${lang}`}
                        name={`title.${lang}`}
                        value={values.title[lang]}
                        onChange={(e) =>
                          setFieldValue(`title.${lang}`, e.target.value)
                        }
                        className="w-full border rounded p-2"
                      />
                    </div>

                    {/* Description Input */}
                    <div>
                      <label
                        htmlFor={`description-${lang}`}
                        className="block mb-2"
                      >
                        Description ({lang.toUpperCase()})
                      </label>
                      <textarea
                        id={`description-${lang}`}
                        name={`description.${lang}`}
                        value={values.description[lang]}
                        onChange={(e) =>
                          setFieldValue(`description.${lang}`, e.target.value)
                        }
                        className="w-full border rounded p-2 min-h-[100px]"
                      />
                    </div>

                    {/* Location Input */}
                    <div>
                      <label
                        htmlFor={`location-${lang}`}
                        className="block mb-2"
                      >
                        Location ({lang.toUpperCase()})
                      </label>
                      <input
                        id={`location-${lang}`}
                        name={`location.${lang}`}
                        value={values.location[lang]}
                        onChange={(e) =>
                          setFieldValue(`location.${lang}`, e.target.value)
                        }
                        className="w-full border rounded p-2"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Image Upload (only for create, not update) */}
              <div>
                <label htmlFor="images" className="block mb-2">
                  Images
                </label>
                <input
                  id="images"
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      setFieldValue("images", Array.from(files));
                    }
                  }}
                  className="w-full border rounded p-2"
                  accept="image/*"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={false}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {initialValues ? "Update" : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
