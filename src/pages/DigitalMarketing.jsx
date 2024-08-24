import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { Image } from '@nextui-org/react';

const Banner = () => {
  const [banners, setBanners] = useState([]);

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
      console.log(responseBanner.data.data);
      // Ensure the response contains a banner array
      setBanners(responseBanner.data.data);
    } catch (error) {
      console.error('Error fetching banners:', error); 
    }
  };

  if (!banners || banners.length === 0) {
    return null; // or a loading indicator
  }

  return (
    <div className="w-full">
      {banners.map((banner, index) => (
        <div key={index} className="relative w-full mb-4">
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            width="100%"
            height={300}
            objectFit="cover"
          />
          {banner.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <h2 className="text-2xl font-bold">{banner.title}</h2>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Banner;
