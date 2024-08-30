// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import axiosInstance from '../axiosInstance';

// const socket = io('http://localhost:3001');

// const AdminChatInterface = ({ adminId, selectedUserId }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [user, setUser] = useState(null);
//   const messageEndRef = useRef(null);

//   useEffect(() => {
//     socket.emit('login', { userId: adminId, userType: 'admin' });

//     if (selectedUserId) {
//       fetchUserDetails();
//       fetchMessages();
//       socket.emit('joinRoom', selectedUserId);
//     }

//     socket.on('newMessage', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       socket.off('newMessage');
//       socket.emit('leaveRoom', selectedUserId);
//     };
//   }, [adminId, selectedUserId]);

//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const fetchUserDetails = async () => {
//     try {
//       const response = await axiosInstance.get(`/users/${selectedUserId}`);
//       setUser(response.data);
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//     }
//   };

//   const fetchMessages = async () => {
//     try {
//       const response = await axiosInstance.get(`/messages/${selectedUserId}`);
//       setMessages(response.data);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   const handleSendMessage = () => {
//     if (newMessage.trim() && selectedUserId) {
//       const messageData = {
//         senderId: adminId,
//         receiverId: selectedUserId,
//         content: newMessage,
//       };
//       socket.emit('sendMessage', messageData);
//       setMessages((prevMessages) => [...prevMessages, messageData]);
//       setNewMessage('');
//     }
//   };

//   if (!user) {
//     return <div>Loading user details...</div>;
//   }

//   return (
//     <div className="flex flex-col h-screen">
//       <div className="bg-blue-500 text-white p-4">
//         <h2 className="text-xl font-bold">Chat with {user.userName}</h2>
//         <p>{user.spreadTitle} - {user.location}</p>
//       </div>
//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`mb-2 ${message.senderId === adminId ? 'text-right' : 'text-left'}`}
//           >
//             <span className={`inline-block p-2 rounded ${
//               message.senderId === adminId ? 'bg-blue-500 text-white' : 'bg-gray-300'
//             }`}>
//               {message.content}
//             </span>
//           </div>
//         ))}
//         <div ref={messageEndRef} />
//       </div>
//       <div className="p-4 bg-gray-200">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//           className="w-full p-2 rounded"
//           placeholder="Type a message..."
//         />
//         <button
//           onClick={handleSendMessage}
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminChatInterface;