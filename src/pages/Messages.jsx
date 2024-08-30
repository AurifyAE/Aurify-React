import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../axiosInstance';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    message: '',
    privacyChecked: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/contact', formData);
      toast.success('Message sent successfully!', {
        position: 'top-right',
        duration: 3000,
      });
      setFormData({
        firstName: '',
        lastName: '',
        companyName: '',
        email: '',
        phoneNumber: '',  
        message: '',
        privacyChecked: false
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error sending message. Please try again.', {
        position: 'top-right',
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex p-8 rounded-lg shadow-lg h-full">
      <Toaster />
      {/* Get in touch section with dark purple linear gradient */}
      <div className="w-90 pr-8 bg-gradient-to-b from-purple-600 to-purple-700 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
        
        <div className="mb-4">
          <h3 className="font-semibold">Visit us</h3>
          <p>Come say hello at our office Aurify.</p>
          <p>67 Wisteria Way Croydon South VIC 3136 AU</p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold">Chat to us</h3>
          <p>Our friendly team is here to help.</p>
          <p>helloAurify@paysphere.com</p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold">Call us</h3>
          <p>Mon-Fir from 8am to 5pm</p>
          <p>(+91) 555-55-55-555</p>
        </div>
        
        <div>
          <h3 className="font-semibold">Social media</h3>
          <div className="flex space-x-2 mt-2">
            <a href="#" className="text-white hover:text-purple-200">Facebook</a>
            <a href="#" className="text-white hover:text-purple-200">LinkedIn</a>
            <a href="#" className="text-white hover:text-purple-200">Instagram</a>
            <a href="#" className="text-white hover:text-purple-200">Twitter</a>
          </div>
        </div>
      </div>
      
      {/* Form section */}
      <div className="w-2/3 bg-white p-6 rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" name="firstName" value={formData.firstName} placeholder="First Name" required className="p-2 border rounded" onChange={handleChange} />
            <input type="text" name="lastName" value={formData.lastName} placeholder="Last Name" required className="p-2 border rounded" onChange={handleChange} />
          </div>
          <input type="text" name="companyName" value={formData.companyName} placeholder="Company Name" required className="w-full p-2 border rounded mb-4" onChange={handleChange} />
          <input type="email" name="email" value={formData.email} placeholder="Email" required className="w-full p-2 border rounded mb-4" onChange={handleChange} />
          <input type="tel" name="phoneNumber" value={formData.phoneNumber} placeholder="Phone Number" required className="w-full p-2 border rounded mb-4" onChange={handleChange} />
          <textarea name="message" value={formData.message} placeholder="Tell us what we can help you with" required className="w-full p-2 border rounded mb-4 h-32" onChange={handleChange}></textarea>
          <button type="submit" className="w-3/4 bg-purple-600 text-white p-2 rounded hover:bg-purple-700 mt-20 mx-auto block">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;