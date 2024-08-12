import React from 'react';
import errorImage from '../assets/500Error.jpg';

const ServerError = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <img src={errorImage} alt="500 Server Error" className="w-1/2 h-auto mb-4" />
      <h1 className="text-3xl font-bold">500 - Internal Server Error</h1>
      <p className="text-gray-500 mt-2">Sorry, something went wrong on our end.</p>
    </div>
  );
};

export default ServerError;
