// import React, { useState } from 'react';

// const AddItemModal = ({ onClose, onAddItem }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'gold',
//     weight: '',
//     rate: '',
//     img: '',
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onAddItem(formData);
//     setFormData({ name: '', type: 'gold', weight: '', rate: '', img: '' });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg max-w-md w-full m-4 shadow-lg z-60">
//         <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block mb-2">Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border rounded px-2 py-1"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block mb-2">Type:</label>
//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               className="w-full border rounded px-2 py-1"
//             >
//               <option value="gold">Gold</option>
//               <option value="silver">Silver</option>
//               <option value="platinum">Platinum</option>
//               <option value="copper">Copper</option>
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block mb-2">Weight:</label>
//             <input
//               type="text"
//               name="weight"
//               value={formData.weight}
//               onChange={handleChange}
//               className="w-full border rounded px-2 py-1"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block mb-2">Rate:</label>
//             <input
//               type="text"
//               name="rate"
//               value={formData.rate}
//               onChange={handleChange}
//               className="w-full border rounded px-2 py-1"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block mb-2">Image URL:</label>
//             <input
//               type="text"
//               name="img"
//               value={formData.img}
//               onChange={handleChange}
//               className="w-full border rounded px-2 py-1"
//               required
//             />
//           </div>
//           <div className="flex justify-end">
//             <button
//               type="button"
//               onClick={onClose}
//               className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Add Item
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddItemModal;
