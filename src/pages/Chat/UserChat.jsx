import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { Search, Paperclip, Send } from 'lucide-react';
import Avatar from '../../assets/Avatar.jpg';
import axiosInstance from '../../axios/axiosInstance';

const socket = io(process.env.REACT_APP_API_URL.replace('/api', ''));

const UserSelectionAndChatInterface = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [adminInfo, setAdminInfo] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  useEffect(() => {
    if (adminId) {
      fetchUsers();
    }
  }, [adminId]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUser && adminId) {
      fetchMessages();
      
      socket.emit('login', { userId: selectedUser._id, userType: 'user' });

      socket.on("message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      socket.off("message");
      socket.off("connect");
    };
  }, [selectedUser, adminId]);

  const fetchAdminInfo = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        console.error('User email not found in localStorage.');
        return;
      }
      const response = await axiosInstance.get(`/data/${email}`);
      if (response && response.data && response.data.data) {
        setAdminInfo(response.data.data);
        setAdminId(response.data.data._id);
      }
    } catch (error) {
      console.error('Error fetching admin info:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`/admin/${adminId}/users`);
      console.log(response.data);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get(`/messages/${adminId}/${selectedUser._id}`);
      setMessages(response.data.chat.conversation);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" && adminId && selectedUser) {
      const messageData = {
        message: newMessage,
        sender: selectedUser._id,
        receiver: adminId,
        time: new Date().toISOString(),
      };

      try {
        const response = await axiosInstance.post(`/messages/${adminId}`, messageData);

        if (response.data.success) {
          const room = `${adminId}-${selectedUser._id}`;
          socket.emit('sendMessage', { ...messageData, room });
          setMessages((prevMessages) => [...prevMessages, messageData]);
          setNewMessage("");
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
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
      <div className="flex-1 flex flex-col rounded-lg overflow-hidden h-full">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white shadow px-4 py-3">
              <div className="flex items-center space-x-3">
                <img src={Avatar} alt={adminInfo ? adminInfo.userName : "Admin"} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-semibold text-gray-800">{adminInfo ? adminInfo.userName : "Admin"}</h3>
                  <p className="text-sm text-gray-500">Support Agent</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
              <div className="h-full flex flex-col justify-end">
                <div>
                {messages && messages.length > 0 && messages.map((msg, index) => (
                  <ChatMessage key={index} {...msg} isAdmin={msg.sender !== selectedUser._id} />
                ))}

                  <div ref={messageEndRef} />
                </div>
              </div>
            </div>

            {/* Message Input */}
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
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">Select a user to start chatting</p>
          </div>
        )}
      </div>

      {/* User Selection Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 overflow-hidden ml-6 rounded-lg shadow-lg h-full">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Available Users</h2>
          </div>
        </div>
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Users"
              className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="overflow-y-auto h-full pb-20">
          {users.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              isSelected={selectedUser && selectedUser._id === user._id}
              onClick={() => setSelectedUser(user)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const UserItem = ({ user, isSelected, onClick }) => (
  <div
    className={`flex items-center py-3 px-4 hover:bg-gray-100 rounded-lg cursor-pointer ${isSelected ? 'bg-purple-100' : ''}`}
    onClick={onClick}
  >
    <img src={Avatar} alt={user.userName} className="w-10 h-10 rounded-full mr-3" />
    <div className="flex-1 min-w-0">
      <h4 className={`text-sm font-medium truncate ${isSelected ? 'text-purple-700' : 'text-gray-900'}`}>{user.userName}</h4>
      <p className="text-sm text-gray-500 truncate">{user.location || "No location"}</p>
    </div>
  </div>
);

const ChatMessage = ({ message, time, isAdmin }) => (
  <div className={`flex ${isAdmin ? 'justify-start' : 'justify-end'} mb-4`}>
    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isAdmin ? 'bg-gray-200 text-gray-800' : 'bg-purple-500 text-white'}`}>
      <p className="text-sm">{message}</p>
      <p className={`text-xs mt-1 ${isAdmin ? 'text-gray-500' : 'text-purple-200'}`}>
        {new Date(time).toLocaleTimeString()}
      </p>
    </div>
  </div>
);

export default UserSelectionAndChatInterface;