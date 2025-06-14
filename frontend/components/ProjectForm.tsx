import React, { useRef, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import {
  useCreateWorkMutation,
  useUpdateWorkMutation,
  useDeleteImageMutation,
  type Work,
  type UpdateWorkContent,
} from "@/store/services/workApi";
import useOutsideClick from "@/utils/hooks/useOutsideClick";
import { GrFormClose } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

// Form-specific types based on Work type from API
interface ProjectFormData {
  projectId: string;
  description: {
    az: string;
    en: string;
    ru: string;
  };
  title: {
    az: string;
    en: string;
    ru: string;
  };
  location: {
    az: string;
    en: string;
    ru: string;
  };
  area: number;
  category: string;
  images: File[];
  _id?: string;
}

interface ProjectFormProps {
  onClose: () => void;
  initialValues?: Work | null;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  imagePath: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  imagePath,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalRef, () => {
    onClose();
  });

  if (!isOpen) return null;

  // Backend URL'i ekle
  const fullImageUrl = "https://45.85.146.73:4000" + imagePath;

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
            src={fullImageUrl}
            alt="Image to delete"
            className="max-h-40 object-contain rounded border"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.png";
            }}
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

const ProjectForm: React.FC<ProjectFormProps> = ({
  onClose,
  initialValues,
}) => {
  // Create and update mutations
  const [createWork, { isLoading: isCreating }] = useCreateWorkMutation();
  const [updateWork, { isLoading: isUpdating }] = useUpdateWorkMutation();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation();

  const ref = useRef<HTMLDivElement>(null);
  const [hasNewImages, setHasNewImages] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>(
    initialValues?.images || [],
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [imageToDelete, setImageToDelete] = useState<{
    path: string;
    index: number;
  } | null>(null);

  useOutsideClick(ref, () => {
    onClose();
  });

  // Default values for the form if no initial data is provided
  const initialData: ProjectFormData = {
    projectId: initialValues?.projectId || "",
    description: initialValues?.description || { az: "", en: "", ru: "" },
    title: initialValues?.title || { az: "", en: "", ru: "" },
    location: initialValues?.location || { az: "", en: "", ru: "" },
    area: initialValues?.area ? Number(initialValues.area) : 0,
    images: [],
    _id: initialValues?._id || "",
    category: initialValues?.category || "",
  };

  const handleDeleteImage = (imagePath: string, index: number) => {
    setImageToDelete({ path: imagePath, index });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!imageToDelete || !initialValues || !initialValues.projectId) return;

    try {
      console.log(
        `Deleting image: ${imageToDelete.path} from project: ${initialValues.projectId}`,
      );

      // Call the API to delete the image
      const result = await deleteImage({
        projectId: initialValues.projectId,
        imagePath: imageToDelete.path,
      }).unwrap();

      console.log("Delete image result:", result);

      // Handle different response formats
      let remainingImages: string[];
      if (result && typeof result === "object") {
        if ("remainingImages" in result) {
          remainingImages = result.remainingImages as string[];
        } else if ("deletedImage" in result) {
          // Fallback: manual removal
          remainingImages = currentImages.filter(
            (_, idx) => idx !== imageToDelete.index,
          );
        } else {
          remainingImages = currentImages.filter(
            (_, idx) => idx !== imageToDelete.index,
          );
        }
      } else {
        remainingImages = currentImages.filter(
          (_, idx) => idx !== imageToDelete.index,
        );
      }

      // Update the local state to reflect the deleted image
      setCurrentImages(remainingImages);

      console.log(
        `✓ Image deleted successfully. Remaining: ${remainingImages.length} images`,
      );
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image. Please try again.");
    } finally {
      // Close the modal regardless of success or failure
      setDeleteModalOpen(false);
      setImageToDelete(null);
    }
  };

  const handleSubmit = async (
    values: ProjectFormData,
    { setSubmitting }: FormikHelpers<ProjectFormData>,
  ) => {
    try {
      console.log("=== FORM SUBMISSION DEBUG ===");
      console.log("Form values:", values);
      console.log("Has new images:", hasNewImages);
      console.log("Values.images:", values.images);
      console.log("Values.images type:", typeof values.images);
      console.log("Values.images length:", values.images?.length);

      if (initialValues?.projectId) {
        // UPDATE CASE
        console.log("Updating existing project:", initialValues.projectId);

        if (hasNewImages && values.images && values.images.length > 0) {
          // Update with new images
          const formData = new FormData();

          // Add new images to FormData
          Array.from(values.images).forEach((file: File, index) => {
            formData.append("images", file);
            console.log(`Added new image ${index + 1}:`, file.name);
          });

          // Add content data as JSON string
          const contentData = {
            description: values.description,
            title: values.title,
            location: values.location,
            area: values.area,
            category: values.category,
          };

          formData.append("content", JSON.stringify(contentData));

          const result = await updateWork({
            id: initialValues.projectId,
            formData,
          }).unwrap();

          console.log("Update with images result:", result);
        } else {
          // Update without new images (text content only)
          const contentData: UpdateWorkContent = {
            description: values.description,
            title: values.title,
            location: values.location,
            area: values.area,
            category: values.category,
          };

          const result = await updateWork({
            id: initialValues.projectId,
            content: contentData,
          }).unwrap();

          console.log("Update content only result:", result);
        }
      } else {
        // CREATE CASE
        console.log("=== CREATE NEW PROJECT ===");

        // CRITICAL: Check if images exist before proceeding
        if (!values.images || values.images.length === 0) {
          console.error("ERROR: No images selected!");
          alert("Please select at least one image before creating a project.");
          setSubmitting(false);
          return;
        }

        console.log("Images validation passed. Creating FormData...");

        const formData = new FormData();

        // Append simple fields
        formData.append("projectId", values.projectId);
        formData.append("area", values.area.toString());
        formData.append("category", values.category);

        console.log("Added basic fields:", {
          projectId: values.projectId,
          area: values.area,
          category: values.category,
        });

        // Add multilingual fields using bracket notation
        formData.append("description[az]", values.description.az || "");
        formData.append("description[en]", values.description.en || "");
        formData.append("description[ru]", values.description.ru || "");

        formData.append("title[az]", values.title.az || "");
        formData.append("title[en]", values.title.en || "");
        formData.append("title[ru]", values.title.ru || "");

        formData.append("location[az]", values.location.az || "");
        formData.append("location[en]", values.location.en || "");
        formData.append("location[ru]", values.location.ru || "");

        console.log("Added multilingual fields");

        // CRITICAL: Add images with detailed logging
        console.log(`Processing ${values.images.length} images:`);
        Array.from(values.images).forEach((file: File, index) => {
          console.log(`Image ${index + 1}:`, {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          });

          // Check if file is valid
          if (file instanceof File && file.size > 0) {
            formData.append("images", file, file.name);
            console.log(
              `✓ Successfully added image ${index + 1}: ${file.name}`,
            );
          } else {
            console.error(`✗ Invalid file at index ${index}:`, file);
          }
        });

        // Debug: Log all FormData entries
        console.log("=== FINAL FORMDATA CONTENTS ===");
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(
              `${key}:`,
              `[FILE] ${value.name} (${value.size} bytes, ${value.type})`,
            );
          } else {
            console.log(`${key}:`, value);
          }
        }

        // Check if FormData has images
        const imageEntries = Array.from(formData.entries()).filter(
          ([key]) => key === "images",
        );
        console.log(`FormData contains ${imageEntries.length} image entries`);

        if (imageEntries.length === 0) {
          console.error("CRITICAL ERROR: FormData has no image entries!");
          alert("Failed to add images to form data. Please try again.");
          setSubmitting(false);
          return;
        }

        console.log("Sending FormData to backend...");
        const result = await createWork(formData).unwrap();
        console.log("✓ Create result:", result);
      }

      console.log("✓ Form submission successful");
      onClose();
    } catch (submitError: any) {
      console.error("=== SUBMISSION ERROR ===");
      console.error("Full error object:", submitError);
      console.error("Error status:", submitError?.status);
      console.error("Error data:", submitError?.data);

      let errorMessage = "An error occurred while saving the project.";

      if (submitError?.data?.message) {
        errorMessage = submitError.data.message;
      } else if (submitError?.message) {
        errorMessage = submitError.message;
      }

      alert(`Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitting = isCreating || isUpdating;

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
            const errors: Partial<Record<keyof ProjectFormData, string>> = {};

            if (!values.projectId) {
              errors.projectId = "Required";
            }

            if (values.area <= 0) {
              errors.area = "Must be greater than 0";
            }

            if (!values.category) {
              errors.category = "Required";
            }

            // Validate that at least one language is filled for required fields
            const hasTitle = Object.values(values.title).some((val) =>
              val.trim(),
            );
            const hasLocation = Object.values(values.location).some((val) =>
              val.trim(),
            );

            if (!hasTitle) {
              (errors as any).title = "At least one language title is required";
            }

            if (!hasLocation) {
              (errors as any).location =
                "At least one language location is required";
            }

            // Validate images for new projects
            if (
              !initialValues &&
              (!values.images || values.images.length === 0)
            ) {
              (errors as any).images =
                "At least one image is required for new projects";
            }

            return errors;
          }}
        >
          {({
            values,
            setFieldValue,
            touched,
            errors,
            isSubmitting: formikSubmitting,
          }) => (
            <Form className="space-y-4" encType="multipart/form-data">
              {/* Header with close button */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {initialValues ? "Edit Project" : "Create New Project"}
                </h2>
                <button
                  type="button"
                  className="rounded-full p-2 bg-gray-500 hover:bg-gray-600 flex justify-center items-center transition-colors"
                  onClick={() => onClose()}
                  disabled={isSubmitting}
                >
                  <GrFormClose size={20} color="white" />
                </button>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="projectId" className="block mb-2 font-medium">
                    Project ID *
                  </label>
                  <input
                    id="projectId"
                    name="projectId"
                    value={values.projectId}
                    onChange={(e) => setFieldValue("projectId", e.target.value)}
                    className={`w-full border rounded p-2 ${
                      touched.projectId && errors.projectId
                        ? "border-red-500"
                        : "border-gray-300"
                    } ${initialValues?.projectId ? "bg-gray-100" : ""}`}
                    disabled={!!initialValues?.projectId || isSubmitting}
                    readOnly={!!initialValues?.projectId}
                    placeholder="Enter unique project ID"
                  />
                  {touched.projectId && errors.projectId && (
                    <span className="text-red-500 text-sm block mt-1">
                      {errors.projectId}
                    </span>
                  )}
                  {initialValues?.projectId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Project ID cannot be changed after creation
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="area" className="block mb-2 font-medium">
                    Area (m²) *
                  </label>
                  <input
                    id="area"
                    type="number"
                    name="area"
                    value={values.area}
                    onChange={(e) =>
                      setFieldValue("area", Number(e.target.value))
                    }
                    className={`w-full border rounded p-2 ${
                      touched.area && errors.area
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                    placeholder="Enter area"
                    min="1"
                  />
                  {touched.area && errors.area && (
                    <span className="text-red-500 text-sm block mt-1">
                      {errors.area}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block mb-2 font-medium">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={values.category || ""}
                    onChange={(e) => setFieldValue("category", e.target.value)}
                    className={`w-full border rounded p-2 ${
                      touched.category && errors.category
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    <option value="interior">Interior</option>
                    <option value="exterior">Exterior</option>
                    <option value="business">Business</option>
                  </select>
                  {touched.category && errors.category && (
                    <span className="text-red-500 text-sm block mt-1">
                      {errors.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Multilingual Sections */}
              {(["az", "en", "ru"] as const).map((lang) => (
                <div
                  key={lang}
                  className="border border-gray-200 p-4 rounded-lg"
                >
                  <h3 className="font-bold mb-3 text-lg text-gray-700">
                    {lang.toUpperCase()} Language Section
                  </h3>

                  <div className="space-y-3">
                    {/* Title Input */}
                    <div>
                      <label
                        htmlFor={`title-${lang}`}
                        className="block mb-2 font-medium"
                      >
                        Title ({lang.toUpperCase()}) {lang === "en" && "*"}
                      </label>
                      <input
                        id={`title-${lang}`}
                        name={`title.${lang}`}
                        value={values.title[lang]}
                        onChange={(e) =>
                          setFieldValue(`title.${lang}`, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded p-2"
                        disabled={isSubmitting}
                        placeholder={`Enter title in ${lang.toUpperCase()}`}
                      />
                    </div>

                    {/* Description Input */}
                    <div>
                      <label
                        htmlFor={`description-${lang}`}
                        className="block mb-2 font-medium"
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
                        className="w-full border border-gray-300 rounded p-2 min-h-[100px] resize-vertical"
                        disabled={isSubmitting}
                        placeholder={`Enter description in ${lang.toUpperCase()}`}
                      />
                    </div>

                    {/* Location Input */}
                    <div>
                      <label
                        htmlFor={`location-${lang}`}
                        className="block mb-2 font-medium"
                      >
                        Location ({lang.toUpperCase()}) {lang === "en" && "*"}
                      </label>
                      <input
                        id={`location-${lang}`}
                        name={`location.${lang}`}
                        value={values.location[lang]}
                        onChange={(e) =>
                          setFieldValue(`location.${lang}`, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded p-2"
                        disabled={isSubmitting}
                        placeholder={`Enter location in ${lang.toUpperCase()}`}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Image Management */}
              <div className="border border-gray-200 p-4 rounded-lg">
                <label htmlFor="images" className="block mb-2 font-medium">
                  Project Images {!initialValues && "*"}
                </label>

                {/* Current Images Display */}
                {currentImages && currentImages.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Current images: {currentImages.length}
                      </span>
                      {isDeleting && (
                        <span className="text-sm text-blue-600">
                          Deleting...
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {currentImages.map((image, index) => {
                        const fullImageUrl =
                          "https://45.85.146.73:4000" + image;

                        return (
                          <div
                            className="aspect-square w-full cursor-pointer group relative border rounded overflow-hidden hover:border-red-300 transition-colors"
                            key={`${image}-${index}`}
                            onClick={() =>
                              !isSubmitting && handleDeleteImage(image, index)
                            }
                          >
                            <img
                              src={fullImageUrl}
                              className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                              alt={`Project image ${index + 1}`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder-image.png";
                              }}
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MdDelete size={32} className="text-red-600" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Click on an image to delete it
                    </p>
                  </div>
                )}

                {/* New Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {initialValues ? "Add new images" : "Upload images"}
                  </label>
                  <input
                    id="images"
                    type="file"
                    multiple
                    onChange={(e) => {
                      console.log("=== FILE INPUT CHANGE EVENT ===");
                      const files = e.target.files;
                      console.log("Files from input:", files);
                      console.log("Files length:", files?.length);

                      if (files && files.length > 0) {
                        const fileArray = Array.from(files);
                        console.log("File array:", fileArray);
                        console.log("File details:");

                        fileArray.forEach((file, index) => {
                          console.log(`File ${index}:`, {
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            lastModified: file.lastModified,
                            instanceof: file instanceof File,
                          });
                        });

                        setFieldValue("images", fileArray);
                        setHasNewImages(true);
                        console.log(
                          `✓ Set ${fileArray.length} files to Formik values`,
                        );
                      } else {
                        console.log("No files selected");
                        setFieldValue("images", []);
                        setHasNewImages(false);
                      }
                    }}
                    className="w-full border border-gray-300 rounded p-2"
                    accept="image/*"
                    disabled={isSubmitting}
                  />

                  {hasNewImages &&
                    values.images &&
                    values.images.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600 font-medium">
                          ✓ {values.images.length} new image(s) selected
                        </p>
                        <div className="mt-1 text-xs text-gray-500">
                          {Array.from(values.images).map((file: File, idx) => (
                            <div key={idx}>• {file.name}</div>
                          ))}
                        </div>
                      </div>
                    )}

                  {!initialValues && (
                    <p className="text-xs text-gray-500 mt-1">
                      * At least one image is required for new projects
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || formikSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {initialValues ? "Updating..." : "Creating..."}
                    </span>
                  ) : initialValues ? (
                    "Update Project"
                  ) : (
                    "Create Project"
                  )}
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
};

export default ProjectForm;
