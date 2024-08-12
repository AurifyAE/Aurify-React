import React from 'react';
import errorImage from '../assets/404Error.jpg';

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <img src={errorImage} alt="404 Error" className="w-1/2 h-auto mb-4" />
      <h1 className="text-3xl font-bold">Oops! Page Not Found</h1>
      <p className="text-gray-500 mt-2">We can't find the page you're looking for.</p>
    </div>
  );
};

export default NotFound;
