import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../axios/axiosInstance';

const NewsUpload = () => {
  const [selectedOption, setSelectedOption] = useState('Automated');
  const [newsItems, setNewsItems] = useState([]);
  const [userName, setUserName] = useState('');
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
    const fetchAdminUserNameAndNews = async () => {
      const userName = localStorage.getItem('userName');

      if (!userName) {
        console.error('userName not found in localStorage');
        return;
      }

      try {
        const adminResponse = await axiosInstance.get(`/data/${userName}`);
        if (adminResponse.data && adminResponse.data.data && adminResponse.data.data.userName) {
          setUserName(adminResponse.data.data.userName);

          // Fetch news items for this admin
          const newsResponse = await axiosInstance.get(`/get-manual-news?userName=${adminResponse.data.data.userName}`);
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

    fetchAdminUserNameAndNews();
  }, []);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    setEditingItem(null);
    setTitle('');
    setContent('');
  };

  const handleSubmit = async (event) => {
    const userName = localStorage.getItem('userName');
    event.preventDefault();
    const newItem = {
      title,
      description: content,
      userName: userName
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
    const userName = localStorage.getItem('userName');
    event.preventDefault();
    const updatedItem = {
      title,
      description: content,
      userName
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
      await axiosInstance.delete(`/delete-manual-news/${newsItems[0]._id}/${itemToDelete}?userName=${userName}`);
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
    <div className="w-full xl:w-[88%] 2xl:w-[90%]  mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {/* TOP SECTION */}
    <div className="relative overflow-hidden bg-white border border-[#E5ECF6] rounded-[32px] shadow-[0_20px_60px_rgba(15,23,42,0.06)] mb-8">
      
      {/* BACKGROUND EFFECT */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-120px] right-[-120px] w-[280px] h-[280px] rounded-full bg-blue-100 blur-3xl opacity-70" />
  
        <div className="absolute bottom-[-100px] left-[-80px] w-[240px] h-[240px] rounded-full bg-sky-100 blur-3xl opacity-60" />
  
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(37,99,235,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.25) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>
  
      <div className="relative z-10 p-5 sm:p-8 lg:p-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <p className="uppercase tracking-[3px] text-[11px] font-semibold text-[#3B82F6] mb-3">
              News Management
            </p>
  
            <h2 className="text-[30px] sm:text-[38px] font-bold text-[#0F172A] tracking-[-1px]">
              Upload News
            </h2>
  
            <p className="text-[#64748B] text-sm sm:text-[15px] leading-7 mt-4 max-w-[550px]">
              Manage manual and automated news updates from your dashboard.
            </p>
          </div>
  
          {/* SELECT */}
          <div className="w-full lg:w-[320px]">
            <label className="block text-sm font-medium text-[#475569] mb-2">
              Upload Mode
            </label>
  
            <select
              id="uploadOption"
              value={selectedOption}
              onChange={handleChange}
              className="w-full h-[56px] rounded-2xl border border-[#DCE3EE] bg-white px-5 text-[15px] text-[#0F172A] focus:outline-none focus:ring-4 focus:ring-[#DBEAFE] focus:border-[#60A5FA] transition-all shadow-sm"
            >
              <option value="Automated">Automated (API)</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
        </div>
  
        {/* FORM */}
        {selectedOption === "Manual" && (
          <form
            onSubmit={editingItem ? handleUpdate : handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* TITLE */}
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  News Title
                </label>
  
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter news title"
                  className="w-full h-[58px] rounded-2xl border border-[#DCE3EE] bg-white px-5 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#DBEAFE] focus:border-[#60A5FA] transition-all shadow-sm"
                />
              </div>
  
              {/* EMPTY SPACING */}
              <div className="hidden lg:block" />
            </div>
  
            {/* CONTENT */}
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                News Content
              </label>
  
              <textarea
                id="content"
                name="content"
                rows="6"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your news content here..."
                className="w-full rounded-[24px] border border-[#DCE3EE] bg-white px-5 py-5 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#DBEAFE] focus:border-[#60A5FA] transition-all resize-none shadow-sm"
              />
            </div>
  
            {/* BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                className="h-[56px] sm:h-[60px] px-8 rounded-2xl primary-gradient text-white text-sm sm:text-[15px] font-semibold shadow-[0_12px_30px_rgba(37,99,235,0.25)] hover:scale-[1.02] transition-all duration-300"
              >
                {editingItem ? "Update News" : "Publish News"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  
    {/* NEWS GRID */}
    {selectedOption === "Manual" && (
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        {newsItems.map((item) => (
          <div
            key={item._id}
            className="group bg-white border border-[#E5ECF6] rounded-[28px] overflow-hidden shadow-[0_10px_40px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.10)] transition-all duration-300"
          >
            {/* TOP STRIP */}
            <div className="h-2 bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA]" />
  
            <div className="p-6">
              {/* DATE */}
              <div className="inline-flex items-center h-[34px] px-4 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold mb-5">
                {new Date(item.createdAt).toLocaleString()}
              </div>
  
              {/* TITLE */}
              <h3 className="text-[22px] font-bold text-[#0F172A] leading-[32px] mb-4 line-clamp-2">
                {item.title}
              </h3>
  
              {/* CONTENT */}
              <div
                className={`text-[#64748B] text-[15px] leading-8 transition-all duration-300 ${
                  expandedItems[item._id]
                    ? "max-h-[400px] overflow-y-auto hide-scrollbar"
                    : "max-h-28 overflow-hidden"
                }`}
              >
                <p>{item.description}</p>
              </div>
  
              {/* VIEW MORE */}
              {item.description.length > 100 && (
                <button
                  onClick={() => toggleExpand(item._id)}
                  className="mt-3 text-[#2563EB] hover:text-[#1D4ED8] text-sm font-semibold transition-all"
                >
                  {expandedItems[item._id]
                    ? "View Less"
                    : "Read More"}
                </button>
              )}
  
              {/* FOOTER */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#EEF2F7]">
                
                {/* AUTHOR */}
                <div>
                  <p className="text-xs uppercase tracking-[2px] text-[#94A3B8] mb-1">
                    Uploaded By
                  </p>
  
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {userName || "Admin"}
                  </p>
                </div>
  
                {/* ACTIONS */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="h-[42px] px-5 rounded-xl bg-[#EFF6FF] text-[#2563EB] text-sm font-semibold hover:bg-[#DBEAFE] transition-all"
                  >
                    Edit
                  </button>
  
                  <button
                    onClick={() => openDeleteModal(item._id)}
                    className="h-[42px] px-5 rounded-xl bg-[#FEF2F2] text-[#DC2626] text-sm font-semibold hover:bg-[#FEE2E2] transition-all"
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