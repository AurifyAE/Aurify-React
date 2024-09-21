import React from 'react';
import { useNavigate } from 'react-router-dom';
import errorImage from '../../assets/404Error.png';
import { Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div 
      className="relative flex flex-col justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${errorImage})` }}
    >
      <button 
        onClick={handleGoHome}
        className="absolute top-4 right-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300"
      >
        <Home className="w-5 h-5 mr-2" />
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;