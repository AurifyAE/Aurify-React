// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import axiosInstance from '../axiosInstance';

// const socket = io('http://localhost:3001');

// const AdminChatInterface = ({ adminId }) => {
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [newMessage, setNewMessage] = useState('');
//   const messageEndRef = useRef(null);

//   useEffect(() => {
//     fetchUsers();
//     socket.emit('login', { userId: adminId, userType: 'admin' });

//     socket.on('newMessage', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       socket.off('newMessage');
//     };
//   }, [adminId]);

//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const fetchUsers = async () => {
//     try {
//       const response = await axiosInstance.get('/users');
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const fetchMessages = async (userId) => {
//     try {
//       const response = await axiosInstance.get(`/messages/${userId}`);
//       setMessages(response.data);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   const handleUserSelect = (user) => {
//     setSelectedUser(user);
//     fetchMessages(user._id);
//   };

//   const handleSendMessage = () => {
//     if (newMessage.trim() && selectedUser) {
//       const messageData = {
//         senderId: adminId,
//         receiverId: selectedUser._id,
//         content: newMessage,
//       };
//       socket.emit('sendMessage', messageData);
//       setMessages((prevMessages) => [...prevMessages, messageData]);
//       setNewMessage('');
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4">Users</h2>
//         {users.map((user) => (
//           <div
//             key={user._id}
//             className={`p-2 cursor-pointer ${selectedUser?._id === user._id ? 'bg-blue-100' : ''}`}
//             onClick={() => handleUserSelect(user)}
//           >
//             {user.userName}
//           </div>
//         ))}
//       </div>
//       <div className="w-3/4 flex flex-col">
//         <div className="flex-1 p-4 overflow-y-auto">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`mb-2 ${message.sender === adminId ? 'text-right' : 'text-left'}`}
//             >
//               <span className={`inline-block p-2 rounded ${
//                 message.sender === adminId ? 'bg-blue-500 text-white' : 'bg-gray-300'
//               }`}>
//                 {message.content}
//               </span>
//             </div>
//           ))}
//           <div ref={messageEndRef} />
//         </div>
//         <div className="p-4 bg-gray-200">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//             className="w-full p-2 rounded"
//             placeholder="Type a message..."
//           />
//           <button
//             onClick={handleSendMessage}
//             className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminChatInterface;