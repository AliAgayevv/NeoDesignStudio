import React, { useRef, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import {
  useCreateWorkMutation,
  useUpdateWorkMutation,
  useDeleteImageMutation,
} from "@/store/services/workApi";
import { Project } from "./types";
import useOutsideClick from "@/utils/hooks/useOutsideClick";
import { GrFormClose } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

interface ProjectFormProps {
  onClose: () => void;
  initialValues?: Project | null;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  imagePath: string;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  imagePath,
}: DeleteConfirmationModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalRef, () => {
    onClose();
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
      >
        <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
        <p className="mb-6">Are you sure you want to delete this image?</p>

        <div className="mb-6 flex justify-center">
          <img
            src={`http://localhost:4000${imagePath}`}
            alt="Image to delete"
            className="max-h-40 object-contain"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProjectForm({
  onClose,
  initialValues,
}: ProjectFormProps) {
  // Create and update mutations
  const [createWork] = useCreateWorkMutation();
  const [updateWork] = useUpdateWorkMutation();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation();
  const ref = useRef<HTMLDivElement>(null);
  const [hasNewImages, setHasNewImages] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [imageToDelete, setImageToDelete] = useState<{
    path: string;
    index: number;
  } | null>(null);

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

  const handleDeleteImage = (imagePath: string, index: number) => {
    setImageToDelete({ path: imagePath, index });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!imageToDelete || !initialValues || !initialValues.projectId) return;

    try {
      // Call the API to delete the image
      const result = await deleteImage({
        projectId: initialValues.projectId,
        imagePath: imageToDelete.path,
      }).unwrap();

      // Update the local state to reflect the deleted image
      if (initialValues && initialValues.images) {
        initialValues.images = result.remainingImages;
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
      // Optionally show an error message
    } finally {
      // Close the modal regardless of success or failure
      setDeleteModalOpen(false);
      setImageToDelete(null);
    }
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

      // Handle create vs. update
      if (initialValues?.projectId) {
        // For update
        if (hasNewImages && values.images && values.images.length > 0) {
          // If there are new images selected, append them
          Array.from(values.images).forEach((file) => {
            formData.append("images", file);
          });

          // Use FormData for updates with images
          await updateWork({
            id: initialValues.projectId,
            content: {
              projectId: values.projectId,
              description: values.description,
              title: values.title,
              location: values.location,
              area: values.area,
            },
            formData,
          });
        } else {
          // No image changes, use the regular content update
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
        }
      } else {
        // For create
        if (values.images && values.images.length > 0) {
          Array.from(values.images).forEach((file) => {
            formData.append("images", file);
          });
        }
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
                    disabled={initialValues?.projectId ? true : false}
                    readOnly={initialValues?.projectId ? true : false}
                  />
                  {initialValues?.projectId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Project ID cannot be changed after creation
                    </p>
                  )}
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

              {/* Image Upload */}
              <div>
                <label htmlFor="images" className="block mb-2">
                  Images
                </label>

                {/* For Edit mode, show current images count */}
                {initialValues?.projectId &&
                  initialValues.images &&
                  initialValues.images.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">
                        Current images: {initialValues.images.length}
                      </span>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {initialValues.images.map((image, index) => (
                          <div
                            className="aspect-square w-full cursor-pointer group relative border rounded overflow-hidden"
                            key={index}
                            onClick={() => {
                              handleDeleteImage(image, index);
                            }}
                          >
                            <img
                              src={`http://localhost:4000${image}`}
                              className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                              alt={`Project image ${index + 1}`}
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MdDelete size={32} className="text-red-600" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Click on an image to delete it
                      </p>
                    </div>
                  )}

                <input
                  id="images"
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setFieldValue("images", Array.from(files));
                      setHasNewImages(true);
                    } else {
                      setHasNewImages(false);
                    }
                  }}
                  className="w-full border rounded p-2"
                  accept="image/*"
                />
                {hasNewImages && values.images && values.images.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    {values.images.length} new image(s) selected
                  </p>
                )}
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {initialValues ? "Update" : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setImageToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          imagePath={imageToDelete?.path || ""}
        />
      </div>
    </div>
  );
}
