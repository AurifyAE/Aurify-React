import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, CardFooter, Image, Button, Modal, Input } from "@nextui-org/react";
import { AiOutlineClose } from 'react-icons/ai';
import { MdAddShoppingCart } from 'react-icons/md';

const Shop = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    type: 'gold',
    weight: '',
    rate: '',
    image: '',
  });

  useEffect(() => {
    fetchShopItems();
  }, []);

  const fetchShopItems = async () => {
    try {
      const { data } = await axios.get('/shop');
      setItems(data.shops);
    } catch (error) {
      console.error('Error fetching shop items:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      const { data } = await axios.post('/shop', formData);
      setItems([...items, data]);
      setFormData({ name: '', type: 'gold', weight: '', rate: '', image: '' });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding shop item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`/shop/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting shop item:', error);
    }
  };

  const handleUpdateItem = async (id, updatedData) => {
    try {
      const { data } = await axios.put(`/shop/${id}`, updatedData);
      setItems(items.map(item => (item._id === id ? data : item)));
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
            <AiOutlineClose
              className="absolute bottom-3 right-2 text-red-500 cursor-pointer"
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
                className="mt-2 flex flex-wrap gap-4 items-center bg-green-400"
                varient="flat"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateItem(item._id, {
                    name: item.name,
                    type: item.type,
                    weight: item.weight,
                    rate: item.rate,
                    image: item.image,
                  });
                }}
              >
                Update
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Modal.Header>
          <h2 id="modal-title" className="text-lg">
            Add New Item
          </h2>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Weight"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
          />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Rate"
            value={formData.rate}
            onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
          />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            type="file"
            placeholder="Image"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button auto onClick={handleAddItem}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Shop;