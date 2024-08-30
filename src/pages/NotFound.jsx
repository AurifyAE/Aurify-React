import React from 'react';
import errorImage from '../assets/404Error.png';

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <img src={errorImage} alt="404 Error" className="w-1/2 h-auto mb-4" />
    </div>
  );
};

export default NotFound;
