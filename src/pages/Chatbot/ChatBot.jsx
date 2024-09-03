import React from 'react';
import comingSoon from '../../assets/soon.jpg';

const ChatBot = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <img src={comingSoon} alt="coming soon" className="w-1/2 h-auto mb-4" />
    </div>
  );
};

export default ChatBot;
