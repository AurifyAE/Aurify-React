import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { toast ,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewsUpload = () => {
  const [selectedOption, setSelectedOption] = useState('Automated');
  const [newsItems, setNewsItems] = useState([]);
  const [email, setEmail] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchAdminEmailAndNews = async () => {
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
    event.preventDefault();
    const newItem = {
      title,
      description: content,
      email
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
        setSelectedOption('Automated');
        toast.success('News item updated successfully!');
      }
    } catch (error) {
      console.error('Error updating news:', error);
      toast.error('Error updating news item!');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      if (window.confirm('Are you sure you want to delete this news item?')) {
        await axiosInstance.delete(`/delete-manual-news/${newsItems[0]._id}/${itemId}?email=${email}`);
        setNewsItems(prevItems => prevItems.filter(item => item._id !== itemId));
        toast.success('News item deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting news:', error.response ? error.response.data : error);
      toast.error('Error deleting news item!');
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(item.createdAt).toLocaleString()}</span>
                <div className="flex space-x-2"> {/* Added flex and space-x-2 for the gap */}
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
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

      {/* Toast notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default NewsUpload;