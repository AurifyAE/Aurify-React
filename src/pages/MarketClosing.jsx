import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import axiosInstance from '../axiosInstance';

const MarketRateEditor = () => {
  const [background, setBackground] = useState(null);
  const [logo, setLogo] = useState(null);
  const [date, setDate] = useState('');
  const [bidRate, setBidRate] = useState('');
  const [askRate, setAskRate] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const posterRef = useRef(null);

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(format(new Date(), 'MMMM d, yyyy'));
    };

    updateDate();

    const intervalId = setInterval(updateDate, 1000 * 60);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const getLastFriday = () => {
      const today = new Date();
      const day = today.getDay();
      const daysUntilFriday = (day >= 5) ? (day - 5) : (day + 2);
      const lastFriday = new Date(today);
      lastFriday.setDate(today.getDate() - daysUntilFriday);
      return format(lastFriday, 'yyyy-MM-dd');
    };

    const fetchClosingRate = async () => {
      const lastFriday = getLastFriday();
      try {
        const response = await axiosInstance.get(`/closing-rate/${lastFriday}`);
        const closingRate = response.data.closingRate;
        setBidRate(closingRate); // Adjust according to your API response
      } catch (error) {
        console.error('Error fetching closing rate:', error);
      }
    };

    fetchClosingRate();
  }, []);

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    setBackground(URL.createObjectURL(file));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    setLogo(URL.createObjectURL(file));
  };

  const handleExport = () => {
    if (posterRef.current) {
      html2canvas(posterRef.current).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'market_rate_poster.png';
        link.click();
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
          <label
            htmlFor="background"
            className="cursor-pointer flex flex-col items-center justify-center w-full h-full bg-white rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors duration-300 p-8"
          >
            {background ? (
              <img src={background} alt="Background" className="max-w-full max-h-full object-contain" />
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Drag and drop or click to upload background</span>
              </>
            )}
            <input
              id="background"
              type="file"
              onChange={handleBackgroundUpload}
              className="hidden"
            />
          </label>
        </div>
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
          <label
            htmlFor="logo"
            className="cursor-pointer flex flex-col items-center justify-center w-full h-full bg-white rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors duration-300 p-8"
          >
            {logo ? (
              <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Drag and drop or click to upload logo</span>
              </>
            )}
            <input id="logo" type="file" onChange={handleLogoUpload} className="hidden" />
          </label>
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={!background || !logo}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors duration-300"
      >
        Export
      </button>

      {background && logo && (
        <div
          ref={posterRef}
          className="mt-4 p-8 border-4 border-blue-500 rounded-lg relative bg-cover bg-center"
          style={{
            backgroundImage: `url(${background})`,
            width: '800px',
            height: '500px',
          }}
        >
          <img src={logo} alt="Logo" className="w-32 h-32 absolute top-4 left-4" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-8">
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder={currentDate}
              className="block w-full mb-4 p-4 border-4 border-blue-500 rounded-lg text-center bg-gray-800 bg-opacity-50 text-white text-3xl font-bold"
            />
            <div className="text-white text-2xl mb-4">CLOSING RATE</div>
            <div className="flex justify-between mb-4">
              <div className="mr-4">
                <div className="text-white mb-2">BID</div>
                <input
                  type="text"
                  value={bidRate}
                  onChange={(e) => setBidRate(e.target.value)}
                  placeholder="2386.50"
                  className="w-full p-4 border-4 border-blue-500 rounded-lg text-center bg-gray-800 bg-opacity-50 text-white text-2xl"
                />
              </div>
              <div className="ml-4">
                <div className="text-white mb-2">ASK</div>
                <input
                  type="text"
                  value={askRate}
                  onChange={(e) => setAskRate(e.target.value)}
                  placeholder="2387.50"
                  className="w-full p-4 border-4 border-blue-500 rounded-lg text-center bg-gray-800 bg-opacity-50 text-white text-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketRateEditor;