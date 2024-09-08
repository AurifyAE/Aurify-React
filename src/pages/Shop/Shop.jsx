import axiosInstance from "../../axios/axiosInstance";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useEffect, useState, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import { MdAddShoppingCart } from "react-icons/md";

const Shop = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [userName, setUserName] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      const userName = localStorage.getItem("userName");
      const shopResponse = await axiosInstance.get(`/shop-items/${userName}`);
      // Sort items by createdAt date in ascending order (oldest first)
      let sortedItems = [];

      // Check if the response has data and shops array exists
      if (shopResponse.data && Array.isArray(shopResponse.data.shops)) {
        sortedItems = shopResponse.data.shops.sort((a, b) => {
          return new Date(a.createdAt || a._id) - new Date(b.createdAt || b._id);
        });
      }

      // Set sortedItems, either empty or sorted
      setItems(sortedItems);
    } catch (error) {
      console.error("Error fetching shop items:", error);
    }
  }, [userName]);

  useEffect(() => {
    const fetchAdminUserNameAndShopItems = async () => {
      const userName = localStorage.getItem("userName");
      if (!userName) {
        console.error("userName not found in localStorage");
        return;
      }

      try {
        const adminResponse = await axiosInstance.get(`/data/${userName}`);
        if (
          adminResponse.data &&
          adminResponse.data.data &&
          adminResponse.data.data.userName
        ) {
          setUserName(adminResponse.data.data.userName);
          await fetchItems();
        } else {
          console.error("Unexpected response structure:", adminResponse.data);
        }
      } catch (error) {
        console.error(
          "Error fetching admin data or shop items:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchAdminUserNameAndShopItems();
  }, [fetchItems]);

  const handleAddItem = async (newItem) => {
    const formData = new FormData();
    Object.keys(newItem).forEach((key) => {
      formData.append(key, newItem[key]);
    });
    try {
      await axiosInstance.post(`/shop-items/${userName}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("New item added successfully!");
      await fetchItems(); // Refetch all items to ensure correct order
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding shop item:", error);
      toast.error("Failed to add new item. Please try again.");
    }
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      await axiosInstance.delete(`/shop-items/${itemToDelete}?userName=${userName}`);
      setItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemToDelete)
      );
      toast.success("Item deleted successfully!");
      closeDeleteModal();
    } catch (error) {
      console.error(
        "Error deleting shop item:",
        error.response ? error.response.data : error
      );
      toast.error("Failed to delete item. Please try again.");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleUpdate = async (updatedItem) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", updatedItem.name);
      formDataToSend.append("type", updatedItem.type);
      formDataToSend.append("weight", updatedItem.weight);
      formDataToSend.append("rate", updatedItem.rate);
      if (updatedItem.image instanceof File) {
        formDataToSend.append("image", updatedItem.image);
      }

      await axiosInstance.patch(
        `/shop-items/${editingItem._id}?userName=${userName}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setEditingItem(null);
      setIsModalOpen(false);
      await fetchItems(); // Refetch all items to ensure correct order
      toast.success("Item updated successfully!");
    } catch (error) {
      console.error(
        "Error updating shop item:",
        error.response ? error.response.data : error
      );
      toast.error("Failed to update item. Please try again.");
    }
  };


  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.type === filter);

  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setImageModalOpen(true);
  };

  const getImageUrl = useCallback((imagePath) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const trimmedApiUrl = apiUrl.substring(0, apiUrl.lastIndexOf('/'));
    return `${trimmedApiUrl}/${imagePath}`;
  }, []);
  

  return (
    <div className="container mx-auto px-4">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gold & Jewelry Shop</h1>
        <Button
          auto
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Item
        </Button>
      </div>

      <div className="mb-6">
        <select
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All Items</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="platinum">Platinum</option>
          <option value="copper">Copper</option>
        </select>
      </div>
      {filteredItems.length > 0 ? (
        <Table aria-label="Shop items table">
          <TableHeader>
            <TableColumn className="bg-gray-200 font-bold text-center">
              IMAGE
            </TableColumn>
            <TableColumn className="bg-gray-200 font-bold text-center">
              NAME
            </TableColumn>
            <TableColumn className="bg-gray-200 font-bold text-center">
              TYPE
            </TableColumn>
            <TableColumn className="bg-gray-200 font-bold text-center">
              WEIGHT
            </TableColumn>
            <TableColumn className="bg-gray-200 font-bold text-center">
              RATE
            </TableColumn>
            <TableColumn className="bg-gray-200 font-bold text-center">
              ACTIONS
            </TableColumn>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="text-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="cursor-pointer mx-auto"
                    onClick={() => openImageModal(item.image)}
                  />
                </TableCell>
                <TableCell className="text-center">{item.name}</TableCell>
                <TableCell className="text-center">{item.type}</TableCell>
                <TableCell className="text-center">{item.weight}</TableCell>
                <TableCell className="text-center">{item.rate}</TableCell>
                <TableCell className="text-center">
                  <Button
                    auto
                    icon={<MdAddShoppingCart />}
                    className="mr-2 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    auto
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDeleteClick(item._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No items available. Add some items to see them here.
        </div>
      )}

      {isModalOpen && (
        <AddItemModal
          key={editingItem ? editingItem._id : "AddModal"}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onAddItem={editingItem ? handleUpdate : handleAddItem}
          editingItem={editingItem}
        />
      )}

      <Modal
        isOpen={imageModalOpen}
        onOpenChange={() => setImageModalOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <Image
                  src={selectedImage}
                  alt="Full size image"
                  width={400}
                  height={400}
                  objectFit="contain"
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onOpenChange={closeDeleteModal}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Deletion
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this item? This action cannot
                  be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button auto flat color="danger" onPress={handleDeleteItem}>
                  Delete
                </Button>
                <Button auto onPress={closeDeleteModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

const AddItemModal = ({ onClose, onAddItem, editingItem }) => {
  const [fileError, setFileError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Reset form errors when the modal opens or closes
    setFormErrors({});
    setFileError("");
  }, [editingItem]);

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/png"];
    if (!file) {
      return true; // No file is valid for both new items and editing
    }

    if (!validTypes.includes(file.type)) {
      return "Please upload a JPEG or PNG image.";
    }
    return true;
  };

  const validateForm = (formData) => {
    const errors = {};
    const name = formData.get("name");
    const type = formData.get("type");
    const weight = parseFloat(formData.get("weight"));
    const rate = parseFloat(formData.get("rate"));

    if (!editingItem) {
      // Validate all fields for new items
      if (!name) errors.name = "Name is required";
      if (!type) errors.type = "Type is required";
      if (isNaN(weight) || weight <= 0) errors.weight = "Weight is required";
      if (isNaN(rate) || rate <= 0) errors.rate = "Rate is required";
    } else {
      // Validate only changed fields for editing
      if (name !== editingItem.name && !name) errors.name = "Name is required";
      if (type !== editingItem.type && !type) errors.type = "Type is required";
      if (weight !== editingItem.weight && (isNaN(weight) || weight <= 0))
        errors.weight = "Weight must be a positive number";
      if (rate !== editingItem.rate && (isNaN(rate) || rate <= 0))
        errors.rate = "Rate must be a positive number";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const imageFile = formData.get("image");
    // Change: Only validate the image if there's no current image or a new file is selected
    if (
      !editingItem?.image ||
      (imageFile instanceof File && imageFile.size > 0)
    ) {
      const fileValidationResult = validateFile(imageFile);
      if (fileValidationResult !== true) {
        setFileError(fileValidationResult);
        return;
      }
    }

    const updatedItem = {
      name: formData.get("name"),
      type: formData.get("type"),
      weight: parseFloat(formData.get("weight")),
      rate: parseFloat(formData.get("rate")),
    };

    if (imageFile instanceof File && imageFile.size > 0) {
      updatedItem.image = imageFile;
    } else if (editingItem && editingItem.image) {
      updatedItem.image = editingItem.image;
    }

    onAddItem(updatedItem);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} scrollBehavior="inside" size="lg" isDismissable={false} isKeyboardDismissDisabled={true}>
      <ModalContent className="hide-scrollbar">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {editingItem ? "Edit Item" : "Add New Item"}
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit} id="itemForm">
                <div className="mb-4">
                  <label className="block mb-2">Name:</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingItem?.name}
                    placeholder="Name"
                    className="w-full border rounded px-2 py-1"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 mt-1">{formErrors.name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Type:</label>
                  <select
                    name="type"
                    defaultValue={editingItem?.type}
                    placeholder="Type"
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="platinum">Platinum</option>
                    <option value="copper">Copper</option>
                  </select>
                  {formErrors.type && (
                    <p className="text-red-500 mt-1">{formErrors.type}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Weight:</label>
                  <input
                    type="number"
                    step="0.01"
                    name="weight"
                    defaultValue={editingItem?.weight}
                    placeholder="Weight"
                    className="w-full border rounded px-2 py-1"
                  />
                  {formErrors.weight && (
                    <p className="text-red-500 mt-1">{formErrors.weight}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Rate:</label>
                  <input
                    type="number"
                    name="rate"
                    defaultValue={editingItem?.rate}
                    placeholder="Rate"
                    className="w-full border rounded px-2 py-1"
                  />
                  {formErrors.rate && (
                    <p className="text-red-500 mt-1">{formErrors.rate}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Upload Image:</label>
                  {editingItem && editingItem.image && (
                    <div className="mb-4">
                      <img
                        src={editingItem.image}
                        alt={editingItem.name}
                        className="w-32 h-32 object-cover rounded"
                      />
                      <p>Current Image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    className="w-full border rounded px-2 py-1"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const validationResult = validateFile(file);
                      setFileError(
                        validationResult === true ? "" : validationResult
                      );
                    }}
                  />
                  {fileError && (
                    <p className="text-red-500 mt-1">{fileError}</p>
                  )}
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button auto flat color="danger" onPress={onClose}>
                Cancel
              </Button>
              <Button auto type="submit" form="itemForm">
                {editingItem ? "Edit Item" : "Add New Item"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Shop;
