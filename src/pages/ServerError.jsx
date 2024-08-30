import React from 'react';
import errorImage from '../assets/500Error.png';

const ServerError = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <img src={errorImage} alt="500 Server Error" className="w-1/2 h-auto mb-4" />
    </div>
  );
};

export default ServerError;
