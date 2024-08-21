import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { Card, CardBody, CardFooter, Image, Button } from '@nextui-org/react';
import { MdAddShoppingCart } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';
  

const Shop = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [email, setEmail] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  

  useEffect(() => {
    const fetchAdminEmailAndShopItems = async () => {
      const userEmail = localStorage.getItem('userEmail');
      console.log('User email from localStorage:', userEmail);

      if (!userEmail) {
        console.error('Admin email not found in localStorage');
        return;
      }

      try {
        const adminResponse = await axiosInstance.get(`/data?email=${userEmail}`);
        if (adminResponse.data && adminResponse.data.data && adminResponse.data.data.email) {
          setEmail(adminResponse.data.data.email);

          // Fetch shop items for this admin
          const shopResponse = await axiosInstance.get(`/shop-items?email=${adminResponse.data.data.email}`);
          if (shopResponse.data && shopResponse.data.shops) {
            setItems(shopResponse.data.shops);
          }
        } else {
          console.error('Unexpected response structure:', adminResponse.data);
        }
      } catch (error) {
        console.error('Error fetching admin data or shop items:', error.response ? error.response.data : error.message);
      }
    };

    fetchAdminEmailAndShopItems();
  }, []);

  const handleAddItem = async (newItem) => {
    // Check if newItem.image is a file object and append it
     if (!(newItem.get("image") instanceof File))
      {
        console.error('Invalid file object for image.');
        return; // Exit if the file is invalid
    }

    try {
      const response = await axiosInstance.post(`/shop-items?email=${email}`, newItem, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data && response.data.shops) {
        setItems(prevItems => [response.data.shops[response.data.shops.length - 1], ...prevItems]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding shop item:', error);
    }
  };


  

  const handleDeleteItem = async (id) => {
    try {
      // Add confirmation message before deleting
      if (window.confirm('Are you sure you want to delete this item?')) {
        await axiosInstance.delete(`/shop-items/${id}?email=${email}`);
        setItems(prevItems => prevItems.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error('Error deleting shop item:', error.response ? error.response.data : error);
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
      }
    } catch (error) {
      console.error('Error updating shop item:', error);
    }
  };

  const filteredItems = filter === 'all' ? items : items.filter(item => item.type === filter);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gold & Jewelry Shop</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Item
        </button>
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
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <Card
            key={item._id}
            shadow="sm"
            isPressable
            className="relative rounded-lg"
            onClick={() => window.open(item.image, '_blank')}
          >
            <MdDeleteForever
              className="absolute bottom-6 right-2 text-red-600 cursor-pointer text-2xl"
              onClick={(e) => {
              e.stopPropagation();
              handleDeleteItem(item._id);
            }}
          />
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={item.name}
                className="w-full object-cover h-[200px] rounded-t-lg"
                src={item.image}
              />
            </CardBody>
            <CardFooter className="text-small flex-col items-start rounded-b-lg">
              <h2 className="font-bold text-lg">{item.name}</h2>
              <p>Type: {item.type}</p>
              <p>Weight: {item.weight}</p>
              <p>Rate: {item.rate}</p>
              <Button
                auto
                iconRight={<MdAddShoppingCart />}
                className="mt-2 flex flex-wrap gap-4 items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                variant="flat"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(item);
                }}
              >
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <AddItemModal
        key={editingItem?editingItem._id:"AddModal"}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onAddItem={editingItem ? handleUpdate : handleAddItem}
          editingItem={editingItem}
        />
      )}
    </div>
  );
}

const AddItemModal = ({ onClose, onAddItem, editingItem }) => {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a new FormData object
    console.log("eee",e.currentTarget,e.target);
    const formDataToSend = new FormData(e.target);
    console.log("formmmdataa",formDataToSend);
    // Pass formDataToSend to onAddItem
    onAddItem(formDataToSend);
  
  
  
    onClose(); // Close the modal after submission
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
                <img src={editingItem.image} alt={editingItem.name} className="w-32 h-32 object-cover rounded" />
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
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Shop;