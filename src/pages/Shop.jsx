import { Button, Image, Modal, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { MdAddShoppingCart } from 'react-icons/md';
import axiosInstance from '../axios/axiosInstance';

const Shop = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [email, setEmail] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchAdminEmailAndShopItems = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        console.error('Admin email not found in localStorage');
        return;
      }

      try {
        const adminResponse = await axiosInstance.get(`/data/${userEmail}`);
        if (adminResponse.data && adminResponse.data.data && adminResponse.data.data.email) {
          setEmail(adminResponse.data.data.email);
          const shopResponse = await axiosInstance.get(`/shop-items?email=${adminResponse.data.data.email}`);
          setItems(shopResponse.data.shops);
        } else {
          console.error('Unexpected response structure:', adminResponse.data);
        }
      } catch (error) {
        console.error('Error fetching admin data or shop items:', error.response ? error.response.data : error.message);
      }
    };

    fetchAdminEmailAndShopItems();
  }, [refreshTrigger]);

  const handleAddItem = async (newItem) => {
    const formData = new FormData();
    Object.keys(newItem).forEach(key => {
      formData.append(key, newItem[key]);
    });
    const email = localStorage.getItem('userEmail');
    try {
      const response = await axiosInstance.post(`/shop-items/${email}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data && response.data.shops) {
        setItems(prevItems => [response.data.shops[response.data.shops.length - 1], ...prevItems]);
        toast.success("New item added successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding shop item:', error);
      toast.error('Failed to add new item. Please try again.');
    }
  };

  // const handleDeleteClick = (id) => {
  //   setItemToDelete(id);
  //   openDeleteModal();
  // };

  // const closeDeleteModal = () => {
  //   setIsDeleteModalOpen(false);
  //   setItemToDelete(null);
  // };

  const handleDeleteItem = async (id) => {
    try {
      await axiosInstance.delete(`/shop-items/${id}?email=${email}`);
      setItems(prevItems => prevItems.filter(item => item._id !== id));
      toast.success('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting shop item:', error.response ? error.response.data : error);
      toast.error('Failed to delete item. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleUpdate = async (updatedItem) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', updatedItem.name);
      formDataToSend.append('type', updatedItem.type);
      formDataToSend.append('weight', updatedItem.weight);
      formDataToSend.append('rate', updatedItem.rate);
      if (updatedItem.image instanceof File) {
        formDataToSend.append('image', updatedItem.image);
      }

      const response = await axiosInstance.patch(`/shop-items/${editingItem._id}?email=${email}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data) {
        setItems((prevItems) =>
          prevItems.map((item) => (item._id === editingItem._id ? response.data : item))
        );
        setEditingItem(null);
        setIsModalOpen(false);
        setRefreshTrigger(prev => prev + 1);
        toast.success('Item updated successfully!');
      }
    } catch (error) {
      console.error('Error updating shop item:', error.response ? error.response.data : error);
      toast.error('Failed to update item. Please try again.');
    }
  };

  const filteredItems = filter === 'all' ? items : items.filter(item => item.type === filter);

  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setImageModalOpen(true);
  };

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
      <Table aria-label="Shop items table" className="border-collapse">
        <TableHeader>
          <TableColumn className="bg-gray-200 font-bold text-center border border-gray-300 p-2">IMAGE</TableColumn>
          <TableColumn className="bg-gray-200 font-bold text-center border border-gray-300 p-2">NAME</TableColumn>
          <TableColumn className="bg-gray-200 font-bold text-center border border-gray-300 p-2">TYPE</TableColumn>
          <TableColumn className="bg-gray-200 font-bold text-center border border-gray-300 p-2">WEIGHT</TableColumn>
          <TableColumn className="bg-gray-200 font-bold text-center border border-gray-300 p-2">RATE</TableColumn>
          <TableColumn className="bg-gray-200 font-bold text-center border border-gray-300 p-2">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="border border-gray-300 p-2 text-center">
                <img
                  src={`http://localhost:8000${item.image}`}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="cursor-pointer mx-auto"
                  onClick={() => openImageModal(`http://localhost:8000${item.image}`)}
                />
              </TableCell>
              <TableCell className="border border-gray-300 p-2 text-center">{item.name}</TableCell>
              <TableCell className="border border-gray-300 p-2 text-center">{item.type}</TableCell>
              <TableCell className="border border-gray-300 p-2 text-center">{item.weight}</TableCell>
              <TableCell className="border border-gray-300 p-2 text-center">{item.rate}</TableCell>
              <TableCell className="border border-gray-300 p-2 text-center">
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
                  // icon={<MdDeleteForever />}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDeleteItem(item._id)}
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
        closeButton
        aria-labelledby="image-modal"
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
      >
        <Modal.Body>
          <Image
            src={selectedImage}
            alt="Full size image"
            width={400}
            height={400}
            objectFit="contain"
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

  const AddItemModal = ({ onClose, onAddItem, editingItem }) => {
    
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      // Validate form data
      const name = formData.get('name') || '';
      const type = formData.get('type') || '';
      const weight = parseFloat(formData.get('weight')) || 0;
      const rate = parseFloat(formData.get('rate')) || 0;
    
      // Only include fields that have valid values
      const updatedItem = {
        ...(name && { name }),
        ...(type && { type }),
        ...(weight && { weight }),
        ...(rate && { rate })
      };
    
      if (formData.get('image') instanceof File) {
        updatedItem.image = formData.get('image');
      }
    
      onAddItem(updatedItem);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full m-4">
          <h2 className="text-2xl font-bold mb-4"> {editingItem ? "Edit Item" : "Add New Item"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Name:</label>
              <input
                type="text"
                name="name"
                defaultValue={editingItem?.name}
                // value={formData.name}
                // onChange={handleChange}
                placeholder="Name"
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Type:</label>
              <select
                name="type"
                defaultValue={editingItem?.type}
                // value={formData.type}
                // onChange={handleChange}
                placeholder="Type"
                className="w-full border rounded px-2 py-1"
              >
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="platinum">Platinum</option>
                <option value="copper">Copper</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Weight:</label>
              <input
                type="number" step="0.01"
                name="weight"
                defaultValue={editingItem?.weight}
                // value={formData.weight}
                // onChange={handleChange}
                placeholder="Weight"
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Rate:</label>
              <input
                type="number"
                name="rate"
                defaultValue={editingItem?.rate}
                // value={formData.rate}
                // onChange={handleChange}
                placeholder="Rate"
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Upload Image:</label>
              {editingItem && editingItem.image && (
                <div className="mb-4">
                  <img src={"http://localhost:8000/"+editingItem.image} alt={editingItem.name} className="w-32 h-32 object-cover rounded" />
                  <p>Current Image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                name="image"
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                { editingItem ? "Edit Item" : "Add New Item" }
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default Shop;
