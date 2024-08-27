import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { Card, CardHeader, CardBody, useDisclosure } from "@nextui-org/react";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      return;
    }
    try {
      const response = await axiosInstance.get(`/data/${userEmail}`);
      const responseBanner = await axiosInstance.get(`/banners/${response.data.data._id}`);
      setBanners(responseBanner.data.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    onOpen();
  };

  if (!banners || banners.length === 0) {
    return null; // or a loading indicator
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mr-8">
        {banners.map((banner, index) => (
          <Card key={banner._id || index} className="py-4 bg-white rounded-xl">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h3 className="text-tiny uppercase font-bold">{banner.title || 'Banner Title'}</h3>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <div className="aspect-square w-full overflow-hidden cursor-pointer"
                   onClick={() => handleImageClick(`http://localhost:8000/uploads/${banner.imageUrl}`)}>
                <img
                  alt={banner.title || 'Banner image'}
                  className="object-cover rounded-xl w-full h-full"
                  src={`http://localhost:8000/uploads/${banner.imageUrl}`}
                />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-hidden relative">
            <button 
              onClick={onClose} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="overflow-auto max-h-[calc(90vh-2rem)] hide-scrollbar">
              <img
                src={selectedImage}
                alt="Enlarged banner"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;