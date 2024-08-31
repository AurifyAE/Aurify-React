import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { Search, Paperclip, Send } from 'lucide-react';
import Avatar from '../assets/Avatar.jpg'
import axiosInstance from '../axios/axiosInstance';

const socket = io("http://localhost:8000");

const EnhancedChatInterface = ({ adminId }) => {
  const [chats, setChats] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [Id, setId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

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
          return response.data.data._id; // Return the Id
        } else {
          console.error('Invalid response or missing data:', response);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    const fetchUsersAndChats = async () => {
      const adminId = await fetchAdminId();
      if (!adminId) return;

      const emailId = localStorage.getItem('userEmail');
      try {
        const response = await axiosInstance.get(`/admin/${emailId}/users`);
        if (response.data.success) {
          setUsers(response.data.users);
          await fetchAllChats(response.data.users, adminId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsersAndChats();

    socket.emit('login', { userId: adminId, userType: 'admin' });

    socket.on("message", (message) => {
      setChats((prevChats) => {
        const updatedChats = { ...prevChats };
        if (!updatedChats[message.sender]) {
          updatedChats[message.sender] = [];
        }
        updatedChats[message.sender].push({
          message: message.content,
          sender: message.sender,
          time: message.timestamp
        });
        return updatedChats;
      });
    });

    return () => {
      socket.off("message");
    };
  }, [adminId]);

  const fetchAllChats = async (userList, adminId) => {
    const chatPromises = userList.map(user => 
      axiosInstance.get(`/messages/${adminId}/${user._id}`)
        .then(response => ({ userId: user._id, conversation: response.data.chat.conversation }))
        .catch(error => {
          console.error(`Error fetching chat for user ${user._id}:`, error);
          return { userId: user._id, conversation: [] };
        })
    );

    try {
      const allChats = await Promise.all(chatPromises);
      const updatedChats = {};
      const usersWithChats = [];

      allChats.forEach(({ userId, conversation }) => {
        if (conversation && conversation.length > 0) {
          updatedChats[userId] = conversation;
          usersWithChats.push(userId);
        }
      });

      setChats(updatedChats);
      setFilteredUsers(userList.filter(user => usersWithChats.includes(user._id)));
    } catch (error) {
      console.error('Error fetching all chats:', error);
    }
  };


  useEffect(() => {
    if (selectedUser && Id) {
      fetchChat();
      const room = `${Id}-${selectedUser._id}`;
      socket.emit('joinRoom', room);
    }

    return () => {
      if (selectedUser && Id) {
        const room = `${Id}-${selectedUser._id}`;
        socket.emit('leaveRoom', room);
      }
    };
  }, [selectedUser, Id]);

  const fetchChat = async () => {
    if (!selectedUser || !Id) return;
    
    try {
      const response = await axiosInstance.get(`/messages/${Id}/${selectedUser._id}`);
      console.log(response.data.chat.conversation);
      if (response.data.chat.conversation) {
        setChats(prevChats => ({
          ...prevChats,
          [selectedUser._id]: response.data.chat.conversation
        }));
      } else {
        console.error('No conversation data in response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" && selectedUser && Id) {
      const messageData = {
        message: newMessage,
        sender: Id,
        receiver: selectedUser._id,
        time: new Date().toISOString(),
      };
  
      try {
        const response = await axiosInstance.post(`/messages/${selectedUser._id}`, messageData);
  
        if (response.data.success) {
          const room = `${Id}-${selectedUser._id}`;
          socket.emit('sendMessage', { ...messageData, room });
          setChats(prevChats => ({
            ...prevChats,
            [selectedUser._id]: [...(prevChats[selectedUser._id] || []), messageData]
          }));
  
          setNewMessage("");
          if (!filteredUsers.find(user => user._id === selectedUser._id)) {
            setFilteredUsers(prevUsers => [...prevUsers, selectedUser]);
          }
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

  const messages = chats[selectedUser?._id] || [];

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
        <div className="flex-1 bg-gray-50 p-4 overflow-y-auto hide-scrollbar" style={{ maxHeight: 'calc(100vh - 250px)' }}>
          {messages.map((msg, index) => (
            <ChatMessage key={index} {...msg} isOwn={msg.sender === Id} />
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
            {filteredUsers.map((user) => (
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

const ChatMessage = ({ message, time, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
      <p className="text-sm">{message}</p>
      <p className={`text-xs mt-1 ${isOwn ? 'text-purple-200' : 'text-gray-500'}`}>
        {new Date(time).toLocaleTimeString()}
      </p>
    </div>
  </div>
);

export default EnhancedChatInterface;