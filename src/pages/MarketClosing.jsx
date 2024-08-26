import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import axiosInstance from '../axiosInstance';
import { Card, CardBody, CardFooter, Image, Button, Modal, Text } from "@nextui-org/react";
import { FaDownload, FaTrash, FaRedo, FaUpload } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const BannerCreator = () => {
  const [background, setBackground] = useState(null);
  const [logo, setLogo] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [bidRate, setBidRate] = useState('');
  const [askRate, setAskRate] = useState('');
  const [createdBanners, setCreatedBanners] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const bannerRef = useRef(null);
  const backgroundInputRef = useRef(null);
  const logoInputRef = useRef(null);

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(format(new Date(), 'MMMM d, yyyy'));
    };
    updateDate();
    const intervalId = setInterval(updateDate, 1000 * 60);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchClosingRate = async () => {
      try {
        const response = await axiosInstance.get('/closing-rate');
        const { bid, ask } = response.data;
        setBidRate(bid);
        setAskRate(ask);
      } catch (error) {
        console.error('Error fetching closing rate:', error);
      }
    };
    fetchClosingRate();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (setter) => (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file, setter);
  };

  const handleFile = (file, setter) => {
    if (file) {
      setter(URL.createObjectURL(file));
      // toast.success(`File uploaded successfully!`);
    }
  };

  const handleExport = () => {
    if (bannerRef.current) {
      const originalBorderRadius = bannerRef.current.style.borderRadius;
      bannerRef.current.style.borderRadius = '0';
      html2canvas(bannerRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      }).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'custom_banner.png';
        link.click();
        
        setCreatedBanners(prev => [...prev, { img: image, title: companyName || 'Untitled' }]);
        resetFields();
        toast.success('Banner created and downloaded successfully!');
        bannerRef.current.style.borderRadius = originalBorderRadius;
      });
    }
  };

  const resetFields = () => {
    setBackground(null);
    setLogo(null);
    setCompanyName('');
    setAddress('');
    setMobileNumber('');
    toast.success('Fields reset successfully!');
  };

  // const downloadBanner = (banner) => {
  //   const link = document.createElement('a');
  //   link.href = banner.img;
  //   link.download = `${banner.title}.png`;
  //   link.click();
  //   toast.success('Banner downloaded successfully!');
  // };

  // const confirmDelete = (index) => {
  //   setBannerToDelete(index);
  //   setDeleteModalOpen(true);
  // };

  const deleteBanner = () => {
    if (bannerToDelete !== null) {
      setCreatedBanners(prev => prev.filter((_, i) => i !== bannerToDelete));
      setDeleteModalOpen(false);
      setBannerToDelete(null);
      toast('Banner deleted!', { icon: '🗑️' });
    }
  };

  return (
    <div className="flex flex-col space-y-8 p-6">
      <Toaster position="top-right" />
      <div className="flex space-x-8">
        <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Create</h2>
          
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div
                onClick={() => backgroundInputRef.current.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop(setBackground)}
                className="w-1/2 h-32 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors duration-300"
              >
                {background ? 'Background Added' : (
                  <>
                    <FaUpload className="text-2xl mb-2" />
                    <span>Drag & Drop or Click to Upload Background</span>
                  </>
                )}
                <input
                  ref={backgroundInputRef}
                  type="file"
                  onChange={(e) => handleFile(e.target.files[0], setBackground)}
                  className="hidden"
                />
              </div>
              <div
                onClick={() => logoInputRef.current.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop(setLogo)}
                className="w-1/2 h-32 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors duration-300"
              >
                {logo ? 'Logo Added' : (
                  <>
                    <FaUpload className="text-2xl mb-2" />
                    <span>Drag & Drop or Click to Upload Logo</span>
                  </>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  onChange={(e) => handleFile(e.target.files[0], setLogo)}
                  className="hidden"
                />
              </div>
            </div>

            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name"
              className="w-full p-2 bg-gray-100 rounded text-gray-700"
            />

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="w-full p-2 bg-gray-100 rounded text-gray-700"
              rows="3"
            />

            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Mobile Number"
              className="w-full p-2 bg-gray-100 rounded text-gray-700"
            />

            <div className="flex justify-between">
              <Button color="secondary" auto onClick={resetFields}>
                <FaRedo className="mr-2" /> Reset
              </Button>
              <Button color="success" auto onClick={handleExport}>
                <FaDownload className="mr-2" /> Download
              </Button>
            </div>
          </div>
        </div>

        <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800"> Preview</h3>
          {background && logo && (
            <div
              ref={bannerRef}
              className="w-full h-[400px] rounded-lg relative bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: `url(${background})` }}
            >
              <img src={logo} alt="Logo" className="w-24 h-24 absolute top-4 left-4" />
              <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{companyName}</div>
                  <div className="text-xl mb-1">{currentDate}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-4">CLOSING RATE</div>
                  <div className="flex justify-center space-x-8 mb-4">
                    <div className="bg-black bg-opacity-30 p-3 rounded-lg">
                      <div className="mb-2">BID</div>
                      <div className="p-2 rounded-lg bg-black bg-opacity-50 text-2xl">
                        {bidRate}
                      </div>
                    </div>
                    <div className="bg-black bg-opacity-30 p-3 rounded-lg">
                      <div className="mb-2">ASK</div>
                      <div className="p-2 rounded-lg bg-black bg-opacity-50 text-2xl">
                        {askRate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg">{address}</div>
                  <div className="text-lg">{mobileNumber}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerCreator;