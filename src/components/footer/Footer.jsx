import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-400 py-4 text-sm">
      <div className="container mx-4 flex justify-between items-center">
        <p>© 2024, made   by Aurify Solutions</p>
        <div className="flex space-x-4 mr-8">
          <p><a href="https://www.tecnavis.com" className="hover:text-gray-600">Tecnavis</a></p>
          <p><a href="https://www.tecnavis.com/about" className="hover:text-gray-600">About Us</a></p>
          <p><a href="https://www.tecnavis.com/license" className="hover:text-gray-600">License</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
