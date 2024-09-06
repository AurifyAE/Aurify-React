import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../axios/axiosInstance';

const NewsUpload = () => {
  const [selectedOption, setSelectedOption] = useState('Automated');
  const [newsItems, setNewsItems] = useState([]);
  const [email, setEmail] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const openDeleteModal = (itemId) => {
    setItemToDelete(itemId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  useEffect(() => {
    const fetchAdminEmailAndNews = async () => {
      const userEmail = localStorage.getItem('userEmail');

      if (!userEmail) {
        console.error('Admin email not found in localStorage');
        return;
      }

      try {
        const adminResponse = await axiosInstance.get(`/data/${userEmail}`);
        if (adminResponse.data && adminResponse.data.data && adminResponse.data.data.email) {
          setEmail(adminResponse.data.data.email);

          // Fetch news items for this admin
          const newsResponse = await axiosInstance.get(`/get-manual-news?email=${adminResponse.data.data.email}`);
          if (newsResponse.data && newsResponse.data.data && newsResponse.data.data.news) {
            setNewsItems(newsResponse.data.data.news);
          }
        } else {
          console.error('Unexpected response structure:', adminResponse.data);
        }
      } catch (error) {
        console.error('Error fetching admin data or news:', error.response ? error.response.data : error.message);
      }
    };

    fetchAdminEmailAndNews();
  }, []);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    setEditingItem(null);
    setTitle('');
    setContent('');
  };

  const handleSubmit = async (event) => {
    const email = localStorage.getItem('userEmail');
    event.preventDefault();
    const newItem = {
      title,
      description: content,
      email: email
    };

    try {
      const response = await axiosInstance.post('/add-manual-news', newItem);
      if (response.data && response.data.data) {
        setNewsItems(prevItems => [response.data.data.news[response.data.data.news.length - 1], ...prevItems]);
        toast.success('News item added successfully!');
      }
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error adding news:', error);
      toast.error('Error adding news item!');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setSelectedOption('Manual');
    setTitle(item.title);
    setContent(item.description);
  };

  const handleUpdate = async (event) => {
    const email = localStorage.getItem('userEmail');
    event.preventDefault();
    const updatedItem = {
      title,
      description: content,
      email
    };

    try {
      const response = await axiosInstance.patch(`/update-manual-news/${newsItems[0]._id}/${editingItem._id}`, updatedItem);
      if (response.data && response.data.data) {
        setNewsItems(prevItems => prevItems.map(item =>
          item._id === editingItem._id ? response.data.data.news.find(n => n._id === editingItem._id) : item
        ));
        setEditingItem(null);
        setTitle('');
        setContent('');
        // Keep the selected option as 'Manual' after updating
        setSelectedOption('Manual');
        toast.success('News item updated successfully!');
      }
    } catch (error) {
      console.error('Error updating news:', error);
      toast.error('Error updating news item!');
    }
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/delete-manual-news/${newsItems[0]._id}/${itemToDelete}?email=${email}`);
      setNewsItems(prevItems => prevItems.filter(item => item._id !== itemToDelete));
      toast.success('News item deleted successfully!');
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting news:', error.response ? error.response.data : error);
      toast.error('Error deleting news item!');
    }
  };

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-4 border w-80 shadow-lg rounded-md bg-white">
        <div className="mt-2 text-center">
          <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
          <div className="mt-2 px-4 py-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this news item?
            </p>
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <button
              onClick={confirmDelete}
              className="px-3 py-1 text-sm bg-red-500 text-white font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Delete
            </button>
            <button
              onClick={closeDeleteModal}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upload News</h2>

        <div className="mb-4">
          <label htmlFor="uploadOption" className="block text-sm font-medium text-gray-700 mb-1">
            Select Option:
          </label>
          <select
            id="uploadOption"
            value={selectedOption}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2"
          >
            <option value="Automated">Automated (API)</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        {selectedOption === 'Manual' && (
          <form onSubmit={editingItem ? handleUpdate : handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2"
                placeholder="Enter news title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content:
              </label>
              <textarea
                id="content"
                name="content"
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2"
                placeholder="Enter news content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2"
            >
              {editingItem ? 'Update' : 'Submit'}
            </button>
          </form>
        )}
      </div>

      {selectedOption === 'Manual' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                <div className={`text-gray-600 mb-4 ${expandedItems[item._id] ? 'max-h-full overflow-y-auto hide-scrollbar' : 'max-h-24 overflow-hidden'}`}>
                  <p>{item.description}</p>
                </div>
                {item.description.length > 100 && (
                  <button
                    onClick={() => toggleExpand(item._id)}
                    className="text-blue-500 hover:text-blue-700 mb-4 text-xs"
                  >
                    {expandedItems[item._id] ? 'View Less' : 'View More'}
                  </button>
                )}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(item._id)}
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && <DeleteConfirmationModal />}
    </div>
  );
};

export default NewsUpload;