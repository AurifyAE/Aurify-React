import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { AiOutlineClose } from 'react-icons/ai';
import { MdAddShoppingCart } from 'react-icons/md';

// Import images
import goldBarImg from '../assets/Shop/gold-bar.jpg';
import silverCoinImg from '../assets/Shop/silver-coin.jpg';
import platinumRingImg from '../assets/Shop/platinum-ring.jpg';
import goldNecklaceImg from '../assets/Shop/gold-necklace.jpg';


const Shop = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([
    { id: 1, name: 'Gold Bar', type: 'gold', weight: '100g', rate: '$1800/oz', img: goldBarImg },
    { id: 2, name: 'Silver Coin', type: 'silver', weight: '1oz', rate: '$25/oz', img: silverCoinImg },
    { id: 3, name: 'Platinum Ring', type: 'platinum', weight: '5g', rate: '$1000/g', img: platinumRingImg },
    { id: 4, name: 'Gold Necklace', type: 'gold', weight: '20g', rate: '$1800/oz', img: goldNecklaceImg },
  ]);
  const [filter, setFilter] = useState('all');

  const handleAddItem = (newItem) => {
    setItems([...items, { id: items.length + 1, ...newItem }]);
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
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
            key={item.id}
            shadow="sm"
            isPressable
            className="relative rounded-lg"
            onClick={() => window.open(item.img, '_blank')}
          >
            <AiOutlineClose
              className="absolute top-2 right-2 text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteItem(item.id);
              }}
            />
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={item.name}
                className="w-full object-cover h-[200px] rounded-t-lg"
                src={item.img}
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
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <AddItemModal
          onClose={() => setIsModalOpen(false)}
          onAddItem={handleAddItem}
        />
      )}
    </div>
  );
}

const AddItemModal = ({ onClose, onAddItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'gold',
    weight: '',
    rate: '',
    img: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, img: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddItem(formData);
    setFormData({ name: '', type: 'gold', weight: '', rate: '', img: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full m-4">
        <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Type:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
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
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Rate:</label>
            <input
              type="text"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full border rounded px-2 py-1"
              required
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
