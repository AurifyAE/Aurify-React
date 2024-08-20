import React from 'react';

const ContactForm = () => {
  return (
    <div className="flex p-8 rounded-lg shadow-lg h-full ">
      {/* Get in touch section with dark purple linear gradient */}
      <div className="w-90 pr-8 bg-gradient-to-b from-purple-800 to-purple-900 text-white p-6 rounded-lg">
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
        <form>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="First Name" required className="p-2 border rounded" />
            <input type="text" placeholder="Last Name" required className="p-2 border rounded" />
          </div>
          <input type="text" placeholder="Company Name" required className="w-full p-2 border rounded mb-4" />
          <input type="email" placeholder="Email" required className="w-full p-2 border rounded mb-4" />
          <input type="tel" placeholder="Phone Number" required className="w-full p-2 border rounded mb-4" />
          <textarea placeholder="Tell us what we can help you with" required className="w-full p-2 border rounded mb-4 h-32"></textarea>
          <div className="mb-4">
            <input type="checkbox" id="privacy" required className="mr-2" />
            <label htmlFor="privacy">I'd like to receive more information about company. I understand and agree to the Privacy Policy</label>
          </div>
            <button type="submit" className="w-3/4 bg-purple-600 text-white p-2 rounded hover:bg-purple-700 mt-20 mx-auto block">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
