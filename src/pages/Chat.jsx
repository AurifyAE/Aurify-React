import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { Search, Paperclip, Send } from 'lucide-react';
import Avatar from '../assets/Avatar.jpg'
import axiosInstance from '../axiosInstance';

const socket = io("http://localhost:8000");

const EnhancedChatInterface = ({ adminId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [Id, setId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchAdminId = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            if (!email) {
                console.error('User email not found in localStorage.');
                return;
            }
            const response = await axiosInstance.get(`/data/${email}`);
            if (response && response.data && response.data.data) {
                setId(response.data.data._id);
            } else {
                console.error('Invalid response or missing data:', response);
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    };

    fetchAdminId();
}, []);

  useEffect(() => {
    // Fetch users
    const fetchUsers = async () => {
      const emailId = localStorage.getItem('userEmail');
      try {
        const response = await axiosInstance.get(`/admin/${emailId}/users`);
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUsers();

    // Set up socket listeners
    socket.emit('login', { userId: adminId, userType: 'admin' });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      // Store the received message in the database
      storeMessage(message);
    });

    return () => {
      socket.off("message");
    };
  }, [adminId]);

  useEffect(() => {
    if (selectedUser) {
      // Fetch messages for selected user from the database
      fetchMessages();
      socket.emit('joinRoom', selectedUser._id);
    }

    return () => {
      if (selectedUser) {
        socket.emit('leaveRoom', selectedUser._id);
      }
    };
  }, [selectedUser]);

  const fetchMessages = async () => {
    try {
      console.log(selectedUser);
      const response = await axiosInstance.get(`/messages/${Id}/${selectedUser._id}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const storeMessage = async (message) => {
    try {
      const response = await axiosInstance.post('/messages', message);
      console.log('Message stored:', response.data);
    } catch (error) {
      console.error('Error storing message:', error);
      throw error; // Re-throw the error to be caught in handleSendMessage
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" && selectedUser) {
      const message = {
        sender: Id,
        receiver: selectedUser._id,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      await storeMessage(message);
      socket.emit("sendMessage", message);
      setMessages((prevMessages) => [...prevMessages, { ...message, isOwn: true }]);
      setNewMessage("");

      // Store the sent message in the database
      
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full bg-gray-100 overflow-hidden px-4 mb-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col rounded-lg overflow-hidden h-full hide-scrollbar">
        <div className="bg-white shadow">
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center space-x-3">
              <img src={Avatar} alt={selectedUser ? selectedUser.userName : "User"} className="w-10 h-10 rounded-full" />
              <div>
                <h3 className="font-semibold text-gray-800">{selectedUser ? selectedUser.userName : "Select a user"}</h3>
                <p className="text-sm text-gray-500">{selectedUser ? selectedUser.spreadTitle : ""}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 p-4 overflow-y-auto hide-scrollbar">
          {messages.map((msg, index) => (
            <ChatMessage key={index} {...msg} isOwn={msg.senderId === Id} />
          ))}
          <div ref={messageEndRef} />
        </div>
        <div className="bg-white p-4 border-t">
          <div className="flex items-center space-x-2">
            <button className="text-gray-500 hover:text-gray-700">
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              onKeyDown={handleKeyDown}
            />
            <button className="bg-purple-600 text-white rounded-full p-2" onClick={handleSendMessage}>
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 overflow-hidden ml-6 rounded-lg shadow-lg h-full">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
          </div>
        </div>
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="overflow-y-auto h-full pb-20">
          <div className="mt-4 px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Users</h3>
            {users.map((user) => (
              <ChatItem
                key={user._id}
                {...user}
                isSelected={selectedUser && selectedUser._id === user._id}
                onClick={() => setSelectedUser(user)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatItem = ({ _id, userName, spreadTitle, location, isSelected, onClick }) => (
  <div
    className={`flex items-center py-3 hover:bg-gray-100 rounded-lg cursor-pointer ${isSelected ? 'bg-purple-100' : ''}`}
    onClick={onClick}
  >
    <img src={Avatar} alt={userName} className="w-10 h-10 rounded-full mr-3" />
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline">
        <h4 className={`text-sm font-medium truncate ${isSelected ? 'text-purple-700' : 'text-gray-900'}`}>{userName}</h4>
      </div>
      <p className="text-sm text-gray-500 truncate">{location}</p>
    </div>
  </div>
);

const ChatMessage = ({ content, timestamp, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn ? 'bg-purple-500 text-white' : 'bg-white'}`}>
      <p className="text-sm">{content}</p>
      <p className={`text-xs mt-1 ${isOwn ? 'text-purple-200' : 'text-gray-500'}`}>
        {new Date(timestamp).toLocaleTimeString()}
      </p>
    </div>
  </div>
);

export default EnhancedChatInterface;