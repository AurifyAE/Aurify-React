import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Select,
  SelectItem,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  Divider,
  Input,
} from "@nextui-org/react";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Timer as TimerIcon,
  Save as SaveIcon,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import axiosInstance from "../../axios/axiosInstance";

const TVScreenSliderManagement = () => {
  const adminId = localStorage.getItem("adminId");

  // State management
  const [sliders, setSliders] = useState({
    slider1: {
      images: [],
      currentIndex: 0,
      timeout: 5,
    },
    slider2: {
      images: [],
      currentIndex: 0,
      timeout: 5,
    },
  });

  const [loading, setLoading] = useState({
    slider1: false,
    slider2: false,
    save: false,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentPreview, setCurrentPreview] = useState({
    sliderId: "slider1",
    imageIndex: 0,
  });

  const [uploadProgress, setUploadProgress] = useState({
    slider1: 0,
    slider2: 0,
  });

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    sliderId: null,
    imageIndex: null,
  });

  const [editTimeoutModal, setEditTimeoutModal] = useState({
    isOpen: false,
    sliderId: null,
    timeout: 5,
  });

  // Sliding interval
  useEffect(() => {
    const intervals = {};

    Object.entries(sliders).forEach(([sliderId, slider]) => {
      if (slider.images.length > 0) {
        intervals[sliderId] = setInterval(() => {
          setSliders((prev) => ({
            ...prev,
            [sliderId]: {
              ...prev[sliderId],
              currentIndex:
                (prev[sliderId].currentIndex + 1) %
                prev[sliderId].images.length,
            },
          }));
        }, slider.timeout * 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [sliders]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Fetch initial data
  useEffect(() => {
    fetchSliders();
  }, []);

  // Preview mode handling
  useEffect(() => {
    if (!previewMode) return;

    const intervals = {};

    Object.entries(sliders).forEach(([sliderId, slider]) => {
      if (slider.images.length === 0) return;

      intervals[sliderId] = setInterval(() => {
        setSliders((prev) => ({
          ...prev,
          [sliderId]: {
            ...prev[sliderId],
            currentIndex:
              (prev[sliderId].currentIndex + 1) % prev[sliderId].images.length,
          },
        }));
      }, slider.timeout * 1000);
    });

    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval));
    };
  }, [previewMode, sliders]);

  // Fetch sliders data
  const fetchSliders = async () => {
    try {
      setLoading((prev) => ({ ...prev, save: true }));
      const response = await axiosInstance.get(`/tv-sliders/${adminId}`);
      const slidersData = response.data.sliders;

      // Format images with IDs
      const formatImages = (images) => {
        return images.map((url, index) => ({
          id: `${index}-${Date.now()}`,
          url: url,
        }));
      };

      const updatedSliders = {
        slider1: {
          images: formatImages(slidersData.slider1?.images || []),
          currentIndex: 0,
          timeout: slidersData.slider1?.timeout || 5,
        },
        slider2: {
          images: formatImages(slidersData.slider2?.images || []),
          currentIndex: 0,
          timeout: slidersData.slider2?.timeout || 5,
        },
      };

      setSliders(updatedSliders);
      setError(null);
    } catch (err) {
      setError("Failed to load slider settings");
      console.error("Fetch error:", err);
    } finally {
      setLoading((prev) => ({ ...prev, save: false }));
    }
  };

  // Handle image upload
  const handleImageUpload = async (files, sliderId) => {
    if (!files.length) {
      setError("Please select images to upload.");
      return;
    }

    const validFiles = Array.from(files).filter((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError(
          `Invalid file type: ${file.name}. Only JPEG, PNG, and WebP are allowed.`
        );
        return false;
      }

      if (file.size > maxSize) {
        setError(`File too large: ${file.name}. Maximum size is 5MB.`);
        return false;
      }

      return true;
    });

    if (!validFiles.length) return;

    try {
      setLoading((prev) => ({ ...prev, [sliderId]: true }));
      const formData = new FormData();
      validFiles.forEach((file) => formData.append("image", file));
      formData.append("timeout", sliders[sliderId].timeout);
      formData.append("sliderId", sliderId);

      await axiosInstance.post(`/tv-sliders/upload/${adminId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress((prev) => ({ ...prev, [sliderId]: progress }));
        },
      });

      await fetchSliders(); // Refresh the data after upload
      setSuccess(
        `Successfully uploaded ${validFiles.length} images to ${sliderId}`
      );
    } catch (err) {
      setError(
        `Upload failed: ${err.response?.data?.message || "Unknown error"}`
      );
    } finally {
      setLoading((prev) => ({ ...prev, [sliderId]: false }));
      setUploadProgress((prev) => ({ ...prev, [sliderId]: 0 }));
    }
  };

  // Handle timeout update
  const handleTimeoutUpdate = async () => {
    const { sliderId, timeout } = editTimeoutModal;
    if (!sliderId) return;

    try {
      setLoading((prev) => ({ ...prev, [sliderId]: true }));

      await axiosInstance.put(`/tv-sliders/${sliderId}/settings/${adminId}`, {
        timeout: parseInt(timeout),
      });

      setSliders((prev) => ({
        ...prev,
        [sliderId]: {
          ...prev[sliderId],
          timeout: parseInt(timeout),
        },
      }));

      setSuccess(`Display time updated for ${sliderId}`);
      setEditTimeoutModal({ isOpen: false, sliderId: null, timeout: 5 });
    } catch (err) {
      setError(
        `Failed to update display time: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
    } finally {
      setLoading((prev) => ({ ...prev, [sliderId]: false }));
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (sliderId, imageIndex) => {
    try {
      setLoading((prev) => ({ ...prev, [sliderId]: true }));
      const imageUrl = sliders[sliderId].images[imageIndex].url;

      // Extract the image name from the URL
      const imageName = imageUrl.split("/").pop();

      await axiosInstance.delete(
        `/tv-sliders/${sliderId}/delete/${imageName}/${adminId}`
      );

      await fetchSliders(); // Refresh the data after deletion
      setSuccess("Image deleted successfully");
      setDeleteModalState({ isOpen: false, sliderId: null, imageIndex: null });
    } catch (err) {
      setError(
        `Failed to delete image: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
    } finally {
      setLoading((prev) => ({ ...prev, [sliderId]: false }));
    }
  };

  // UI Component for individual slider
  const SliderCard = ({ sliderId }) => {
    const slider = sliders[sliderId];

    return (
      <Card className="shadow-lg">
        <CardBody className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="text-primary" />
              <h2 className="text-xl font-semibold">
                {sliderId}
                {slider.images.length > 0 && (
                  <Chip
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="ml-2"
                  >
                    {slider.images.length} images
                  </Chip>
                )}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-default-100 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <TimerIcon className="text-default-500" />
                  <span>{slider.timeout}s</span>
                </div>
              </div>
            </div>
          </div>

          <div className="aspect-video relative group rounded-xl overflow-hidden">
            {slider.images.length > 0 ? (
              <div className="relative h-full">
                <img
                  src={slider.images[slider.currentIndex].url}
                  alt={`${sliderId} preview`}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    isIconOnly
                    color="default"
                    variant="flat"
                    className="bg-white/30 backdrop-blur-md"
                    onPress={() => {
                      setSliders((prev) => ({
                        ...prev,
                        [sliderId]: {
                          ...prev[sliderId],
                          currentIndex:
                            prev[sliderId].currentIndex === 0
                              ? prev[sliderId].images.length - 1
                              : prev[sliderId].currentIndex - 1,
                        },
                      }));
                    }}
                  >
                    <NavigateBeforeIcon />
                  </Button>
                  <Button
                    isIconOnly
                    color="default"
                    variant="flat"
                    className="bg-white/30 backdrop-blur-md"
                    onPress={() => {
                      setSliders((prev) => ({
                        ...prev,
                        [sliderId]: {
                          ...prev[sliderId],
                          currentIndex:
                            (prev[sliderId].currentIndex + 1) %
                            prev[sliderId].images.length,
                        },
                      }));
                    }}
                  >
                    <NavigateNextIcon />
                  </Button>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                  {slider.currentIndex + 1} / {slider.images.length}
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col gap-4">
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<AddPhotoAlternateIcon />}
                      className="bg-white/30 backdrop-blur-md"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.multiple = true;
                        input.accept = "image/jpeg,image/png,image/webp";
                        input.onchange = (e) =>
                          handleImageUpload(e.target.files, sliderId);
                        input.click();
                      }}
                    >
                      Add More Images
                    </Button>
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<EditIcon />}
                      className="bg-white/30 backdrop-blur-md"
                      onClick={() =>
                        setEditTimeoutModal({
                          isOpen: true,
                          sliderId,
                          timeout: slider.timeout,
                        })
                      }
                    >
                      Edit Timeout
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full border-3 border-dashed border-primary/20 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-default-50">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleImageUpload(e.target.files, sliderId)}
                  className="hidden"
                />
                <CloudUploadIcon className="text-5xl text-primary mb-4" />
                <span className="text-lg text-default-600">
                  Upload images by dropping here or clicking
                </span>
                <span className="text-sm text-default-400 mt-2">
                  Supports: JPEG, PNG, WebP (max 5MB each)
                </span>
              </label>
            )}
          </div>

          {slider.images.length > 0 && (
            <div className="mt-4">
              <Divider className="my-4" />
              <div className="flex flex-wrap gap-2">
                {slider.images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                      onClick={() => {
                        setSliders((prev) => ({
                          ...prev,
                          [sliderId]: {
                            ...prev[sliderId],
                            currentIndex: index,
                          },
                        }));
                      }}
                    />
                    <Button
                      isIconOnly
                      color="danger"
                      variant="flat"
                      size="sm"
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100"
                      onPress={() =>
                        setDeleteModalState({
                          isOpen: true,
                          sliderId,
                          imageIndex: index,
                        })
                      }
                    >
                      <DeleteIcon className="text-sm" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadProgress[sliderId] > 0 && uploadProgress[sliderId] < 100 && (
            <Progress
              color="primary"
              value={uploadProgress[sliderId]}
              className="mt-4"
              size="sm"
              showValue
              label="Uploading..."
            />
          )}
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-lg">
          <CardBody className="py-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <SettingsIcon className="text-black text-3xl" />
                <h1 className="text-3xl font-bold text-black">
                  TV Screen Slider Management
                </h1>
              </div>
              <Button
                color={previewMode ? "warning" : "primary"}
                variant="shadow"
                startContent={<VisibilityIcon />}
                onPress={() => setPreviewMode(!previewMode)}
                className="font-semibold"
              >
                {previewMode ? "Exit Preview" : "Preview Mode"}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Error and Success Messages */}
        {error && (
          <Card className="border-danger">
            <CardBody className="text-danger">
              <div className="flex items-center gap-2">
                <ErrorIcon color="error" />
                {error}
              </div>
            </CardBody>
          </Card>
        )}

        {success && (
          <Card className="border-success">
            <CardBody className="text-success">
              <div className="flex items-center gap-2">
                <CheckCircleIcon color="success" />
                {success}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Preview Mode */}
        {previewMode && (
          <Card shadow="md">
            <CardBody className="p-0">
              <div className="aspect-video relative overflow-hidden">
                {Object.entries(sliders).every(
                  ([_, slider]) => slider.images.length > 0
                ) ? (
                  <div className="relative w-full h-full">
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      {Object.entries(sliders).map(([sliderId, slider]) => (
                        <Chip
                          key={sliderId}
                          color={
                            currentPreview.sliderId === sliderId
                              ? "primary"
                              : "default"
                          }
                          variant="flat"
                          className="cursor-pointer"
                          onClick={() =>
                            setCurrentPreview({
                              sliderId,
                              imageIndex: slider.currentIndex,
                            })
                          }
                        >
                          {sliderId}
                        </Chip>
                      ))}
                    </div>

                    {Object.entries(sliders).map(([sliderId, slider]) => (
                      <div
                        key={sliderId}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                          currentPreview.sliderId === sliderId
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        {slider.images[slider.currentIndex] && (
                          <img
                            src={slider.images[slider.currentIndex].url}
                            alt={`Preview ${sliderId}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}

                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full flex items-center gap-2">
                      <TimerIcon className="text-sm" />
                      {sliders[currentPreview.sliderId].timeout}s
                    </div>

                    <Progress
                      value={
                        ((sliders[currentPreview.sliderId].currentIndex + 1) /
                          sliders[currentPreview.sliderId].images.length) *
                        100
                      }
                      color="primary"
                      className="absolute bottom-0 left-0 right-0 rounded-none"
                      size="sm"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 aspect-video">
                    <p className="text-gray-500">
                      Upload images to both sliders to preview
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SliderCard sliderId="slider1" />
          <SliderCard sliderId="slider2" />
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalState.isOpen}
          onClose={() =>
            setDeleteModalState({
              isOpen: false,
              sliderId: null,
              imageIndex: null,
            })
          }
        >
          <ModalContent>
            <ModalHeader className="flex gap-2">
              <DeleteIcon className="text-danger" />
              Confirm Deletion
            </ModalHeader>
            <ModalBody>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={() =>
                  setDeleteModalState({
                    isOpen: false,
                    sliderId: null,
                    imageIndex: null,
                  })
                }
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={() =>
                  handleDeleteImage(
                    deleteModalState.sliderId,
                    deleteModalState.imageIndex
                  )
                }
                isLoading={loading[deleteModalState.sliderId]}
              >
                Delete Image
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Timeout Modal */}
        <Modal
          isOpen={editTimeoutModal.isOpen}
          onClose={() =>
            setEditTimeoutModal({ isOpen: false, sliderId: null, timeout: 5 })
          }
        >
          <ModalContent>
            <ModalHeader className="flex gap-2">
              <TimerIcon className="text-primary" />
              Edit Display Time
            </ModalHeader>
            <ModalBody>
              <Input
                type="number"
                label="Display Time (seconds)"
                value={editTimeoutModal.timeout}
                onChange={(e) =>
                  setEditTimeoutModal((prev) => ({
                    ...prev,
                    timeout: e.target.value,
                  }))
                }
                min={1}
                max={60}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={() =>
                  setEditTimeoutModal({
                    isOpen: false,
                    sliderId: null,
                    timeout: 5,
                  })
                }
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleTimeoutUpdate}
                isLoading={loading[editTimeoutModal.sliderId]}
              >
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default TVScreenSliderManagement;
