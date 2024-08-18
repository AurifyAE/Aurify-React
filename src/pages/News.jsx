import React, { useState } from 'react';

const NewsUpload = () => {
  const [selectedOption, setSelectedOption] = useState('Automated');
  const [newsItems, setNewsItems] = useState([]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newItem = {
      title: event.target.title.value,
      content: event.target.content.value,
      date: new Date().toLocaleDateString(),
    };
    setNewsItems([newItem, ...newsItems]);
    event.target.reset();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 ">
      {/* <h1 className="text-4xl font-bold mb-6 text-gray">Gold Trading Platform</h1> */}
      
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 "
          >
            <option value="Automated">Automated (API)</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
        
        {selectedOption === 'Manual' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 "
                placeholder="Enter news title"
                required
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
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md font-medium  focus:outline-none focus:ring-2"
            >
              Submit
            </button>
          </form>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{item.date}</span>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <span>236 views</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsUpload;