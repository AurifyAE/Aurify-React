import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { io } from "socket.io-client";
import { Search, Paperclip, Send } from 'lucide-react';
import Avatar from '../../assets/user.png';
import { MessageSquare } from 'lucide-react';
import axiosInstance from '../../axios/axiosInstance';

const SOCKET_SERVER_URL = process.env.REACT_APP_API_URL.replace('/api', '');
const SECRET_KEY = process.env.REACT_APP_SOCKET_SECRET_KEY;

const socket = io(SOCKET_SERVER_URL, {
  auth: { secret: SECRET_KEY },
  transports: ["websocket"],
});

const EmptyChatState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-center px-4">
      <MessageSquare className="w-16 h-16 text-purple-300 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Chat Selected</h2>
      <p className="text-gray-500 max-w-md">
        Select a user from the sidebar to start a conversation or view chat history.
      </p>
    </div>
  );
};

const EnhancedChatInterface = ({ adminId }) => {
  const [chats, setChats] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [Id, setId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messageEndRef = useRef(null);
  const socketConnected = useRef(false);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  const updateRecentChats = useCallback((userId, lastActivity) => {
    setRecentChats(prevRecentChats => {
      const updatedChats = prevRecentChats.filter(chat => chat.id !== userId);
      return [{ id: userId, lastActivity }, ...updatedChats];
    });
    setFilteredUsers(prevFilteredUsers => {
      const userExists = prevFilteredUsers.some(user => user._id === userId);
      if (!userExists) {
        const newUser = users.find(user => user._id === userId);
        if (newUser) {
          return [...prevFilteredUsers, newUser];
        }
      }
      return prevFilteredUsers;
    });
  }, [users]);

  const fetchUsersAndChats = useCallback(async () => {
    if (!Id) return;

    try {
      const response = await axiosInstance.get(`/admin/${Id}/users`);
      if (response.data.success) {
        setUsers(response.data.users);
        await fetchAllChats(response.data.users, Id);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [Id]);

  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const userName = localStorage.getItem('userName');
        if (!userName) {
          console.error('userName not found in localStorage.');
          return;
        }
        const response = await axiosInstance.get(`/data/${userName}`);
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

  const handleNewMessage = useCallback((message) => {
    setChats((prevChats) => {
      const updatedChats = { ...prevChats };
      if (!updatedChats[message.sender]) {
        updatedChats[message.sender] = [];
      }
      const messageExists = updatedChats[message.sender].some(
        (msg) => msg.time === message.time && msg.message === message.message
      );
      if (!messageExists) {
        updatedChats[message.sender] = [
          ...updatedChats[message.sender],
          {
            message: message.message,
            sender: message.sender,
            time: message.time,
            read: selectedUser && selectedUser._id === message.sender
          }
        ];
      }
      return updatedChats;
    });
    updateRecentChats(message.sender, message.time);
    if (message.sender !== Id) {
      if (selectedUser && selectedUser._id === message.sender) {
        // Mark the message as read immediately if it's from the selected user
        setChats(prevChats => ({
          ...prevChats,
          [message.sender]: prevChats[message.sender].map(msg => ({ ...msg, read: true }))
        }));
        updateServerReadStatus(message.sender);
      } else {
        // Increment unread count only if it's not from the selected user
        setUnreadCounts(prev => ({
          ...prev,
          [message.sender]: (prev[message.sender] || 0) + 1
        }));
      }
    }
  }, [updateRecentChats, Id, selectedUser]);

  const handleUserStatusUpdate = useCallback((update) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user._id === update.userId ? { ...user, ...update } : user
      )
    );
    // Trigger an update to recentChats to ensure re-render
    setRecentChats(prev => [...prev]);
  }, []);

  const handleNewUser = useCallback((newUser) => {
    setUsers(prevUsers => {
      if (!prevUsers.some(user => user._id === newUser._id)) {
        return [...prevUsers, newUser];
      }
      return prevUsers;
    });
    setRecentChats(prevChats => {
      if (!prevChats.some(chat => chat.id === newUser._id)) {
        return [{ id: newUser._id, lastActivity: new Date().toISOString() }, ...prevChats];
      }
      return prevChats;
    });
  }, []);

  useEffect(() => {
    if (Id) {
      fetchUsersAndChats();
      
      if (!socketConnected.current) {
        socket.emit('login', { userId: Id, userType: 'admin' });
        socketConnected.current = true;
      }

      const messageHandler = (message) => {
        handleNewMessage(message);
      };
      
      const userStatusHandler = (update) => {
        handleUserStatusUpdate(update);
      };
      
      const newUserHandler = (newUser) => {
        handleNewUser(newUser);
      };


      socket.on("message", handleNewMessage);
      socket.on("userStatusUpdate", handleUserStatusUpdate);
      socket.on("newUser", handleNewUser);
  
      // Add a periodic refresh for the user list
      const userListRefreshInterval = setInterval(fetchUsersAndChats, 60000); // Refresh every minute
  
      return () => {
        socket.off("message", handleNewMessage);
        socket.off("userStatusUpdate", handleUserStatusUpdate);
        socket.off("newUser", handleNewUser);
        clearInterval(userListRefreshInterval);
      };
    }
  }, [Id, fetchUsersAndChats, handleNewMessage, handleUserStatusUpdate, handleNewUser]);

  const fetchAllChats = async (userList, adminId) => {
    const chatPromises = userList.map(user => 
      axiosInstance.get(`/messages/${adminId}/${user._id}`)
        .then(response => ({ 
          userId: user._id, 
          conversation: response.data.chat.conversation,
          unreadCount: response.data.chat.conversation.filter(msg => !msg.read && msg.sender === user._id).length
         }))
        .catch(error => {
          console.error(`Error fetching chat for user ${user._id}:`, error);
          return { userId: user._id, conversation: [], unreadCount: 0  };
        })
    );

    try {
      const allChats = await Promise.all(chatPromises);
      const updatedChats = {};
      const usersWithChats = [];
      const newUnreadCounts = {};

      allChats.forEach(({ userId, conversation, unreadCount }) => {
        if (conversation && conversation.length > 0) {
          updatedChats[userId] = conversation;
          usersWithChats.push({
            id: userId,
            lastActivity: conversation[conversation.length - 1].time
          });
          newUnreadCounts[userId] = unreadCount;
        }
      });

      setChats(updatedChats);
      setRecentChats(usersWithChats.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity)));
      setUnreadCounts(newUnreadCounts);
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
        read: true
      };

      try {
        const room = `${Id}-${selectedUser._id}`;
        
        // Optimistic update
        setChats(prevChats => ({
          ...prevChats,
          [selectedUser._id]: [...(prevChats[selectedUser._id] || []), messageData]
        }));
        setNewMessage("");
        updateRecentChats(selectedUser._id, messageData.time);

        // Send the message
        await new Promise((resolve, reject) => {
          socket.emit('sendMessage', { ...messageData, room }, (ack) => {
            if (ack && ack.success) resolve();
            else reject(new Error('Failed to send message'));
          });
        });
      } catch (error) {
        console.error('Error sending message:', error);
        // Rollback the optimistic update
        setChats(prevChats => ({
          ...prevChats,
          [selectedUser._id]: prevChats[selectedUser._id].filter(msg => msg !== messageData)
        }));
        // Show an error to the user
        alert('Failed to send message. Please try again.');
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

  const sortedUsers = useMemo(() => {
    const userMap = new Map(users.map(user => [user._id, user]));
    return recentChats
      .filter(chat => userMap.has(chat.id))
      .map(chat => ({
        ...userMap.get(chat.id),
        lastActivity: chat.lastActivity,
        unreadCount: unreadCounts[chat.id] || 0
      }))
      .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
  }, [users, recentChats, unreadCounts]);


  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user);
    updateRecentChats(user._id, new Date().toISOString());
    setChats(prevChats => ({
      ...prevChats,
      [user._id]: (prevChats[user._id] || []).map(msg => ({ ...msg, read: true }))
    }));
    setUnreadCounts(prev => ({ ...prev, [user._id]: 0 }));

    socket.emit('markAsRead', { userId: user._id, adminId: Id });
    updateServerReadStatus(user._id);
  }, [updateRecentChats, Id]);

  const updateServerReadStatus = async (userId) => {
    try {
      await axiosInstance.post(`/messages/markAsRead`, { userId, adminId: Id });
    } catch (error) {
      console.error('Error updating read status on server:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-150px)] bg-gray-100 overflow-hidden px-4 mb-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col rounded-lg overflow-hidden mr-6">
        {selectedUser ? (
          <>
            <div className="bg-white shadow">
              <div className="flex justify-between items-center px-4 py-3">
                <div className="flex items-center space-x-3">
                  <img src={Avatar} alt={selectedUser.userName} className="w-10 h-10 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedUser.userName}</h3>
                    <p className="text-sm text-gray-500">{selectedUser.spreadTitle}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-gray-50 p-4 overflow-y-auto hide-scrollbar">
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
          </>
        ) : (
          <EmptyChatState />
        )}
      </div>
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 overflow-hidden rounded-lg shadow-lg flex flex-col">
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
        <div className="overflow-y-auto flex-1">
          <div className="mt-4 px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent Chats</h3>
            {sortedUsers.map((user) => (
              <ChatItem
                key={user._id}
                {...user}
                unreadCount={user.unreadCount}
                isSelected={selectedUser && selectedUser._id === user._id}
                onClick={() => handleUserSelect(user)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatItem = React.memo(({ _id, userName, spreadTitle, location, isSelected, onClick, unreadCount }) => (
  <div
    className={`flex items-center py-3 hover:bg-gray-100 rounded-lg cursor-pointer ${isSelected ? 'bg-purple-100' : ''}`}
    onClick={onClick}
  >
    <img src={Avatar} alt={userName} className="w-10 h-10 rounded-full mr-3" />
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline">
        <h4 className={`text-sm font-medium truncate ${isSelected ? 'text-purple-700' : 'text-gray-900'}`}>{userName}</h4>
        {unreadCount > 0 && (
          <span className="ml-2 bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  </div>
));

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