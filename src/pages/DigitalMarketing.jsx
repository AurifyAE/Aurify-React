import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";
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
      setBanners(responseBanner.data.data);
      console.log(responseBanner.data.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  if (!banners || banners.length === 0) {
    return null; // or a loading indicator
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {banners.map((banner, index) => (
        <Card key={banner._id || index} className="py-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h3 className="text-tiny uppercase font-bold">{banner.title || 'Banner Title'}</h3>
            {/* <small className="text-default-500">{banner.subtitle || 'Banner Subtitle'}</small> */}
            {/* <h4 className="font-bold text-large">{banner.description || 'Banner Description'}</h4> */}
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <Image
              alt={banner.title || 'Banner image'}
              className="object-cover rounded-xl"
              src={banner.imageUrl}
              width={270}
            />
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default Banner;