import React from 'react';
import { Home, BarChart2, Image, MessageCircle, Newspaper, ShoppingBag, Users, User, Search, Bell, Settings, ChevronDown, Paperclip, Smile, Send } from 'lucide-react';

const EnhancedChatInterface = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard' },
    { icon: BarChart2, label: 'Spot Rate' },
    { icon: Image, label: 'Media' },
    { icon: MessageCircle, label: 'Messages', active: true },
    { icon: Newspaper, label: 'News' },
    { icon: ShoppingBag, label: 'Shop' },
    { icon: Users, label: 'Users' },
  ];

  const superAdminChats = [
    { name: 'Super Admin', status: 'online', message: 'New update available', time: '11:30 AM', isAdmin: true },
  ];

  const regularChats = [
    { name: 'Theron Trump', status: 'offline', message: "Let's discuss the project", time: '10:30 AM' },
    { name: 'Sarah Kortney', status: 'online', message: 'The designs are ready', time: '09:45 AM' },
    { name: 'Mical Clark', status: 'away', message: 'Meeting at 3 PM', time: 'Yesterday' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden px-4">

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col rounded-lg overflow-hidden">
        <div className="bg-white shadow">
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center space-x-3">
              <img src="" alt="Theron Trump" className="w-10 h-10 rounded-full" />
              <div>
                <h3 className="font-semibold text-gray-800">Theron Trump</h3>
                <p className="text-sm text-gray-500">Last seen 10:30m ago</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-gray-700">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
          <ChatMessage sender="Theron Trump" content="What do you think about our plans for this product launch?" time="09:25" />
          <ChatMessage sender="Theron Trump" content="It looks to me like you have a lot planned before your deadline. I would suggest you push your deadline back so you have time to run a successful advertising campaign." time="09:28" />
          <ChatMessage sender="You" content="I would suggest you discuss this further with the advertising team." time="09:41" isOwn />
        </div>
        <div className="bg-white p-4 border-t">
          <div className="flex items-center space-x-2">
            <button className="text-gray-500 hover:text-gray-700">
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button className="text-gray-500 hover:text-gray-700">
              <Smile className="h-5 w-5" />
            </button>
            <button className="bg-purple-600 text-white rounded-full p-2">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
            <button className="bg-purple-600 text-white rounded-full p-2">
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
          <div className="flex mt-4 space-x-2">
            <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Direct</button>
            <button className="text-gray-600 px-3 py-1 rounded-full text-sm">Group</button>
            <button className="text-gray-600 px-3 py-1 rounded-full text-sm">Public</button>
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
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Super Admin</h3>
            {superAdminChats.map((chat, index) => (
              <ChatItem key={index} {...chat} />
            ))}
          </div>
          <div className="mt-4 px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Chats</h3>
            {regularChats.map((chat, index) => (
              <ChatItem key={index} {...chat} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatItem = ({ name, status, message, time, isAdmin }) => (
  <div className={`flex items-center py-3 hover:bg-gray-100 rounded-lg cursor-pointer ${isAdmin ? 'bg-yellow-50' : ''}`}>
    <img src="/api/placeholder/32/32" alt={name} className="w-10 h-10 rounded-full mr-3" />
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline">
        <h4 className={`text-sm font-medium truncate ${isAdmin ? 'text-yellow-700' : 'text-gray-900'}`}>{name}</h4>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <p className="text-sm text-gray-500 truncate">{message}</p>
    </div>
    <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500' : status === 'away' ? 'bg-yellow-500' : 'bg-gray-300'}`}></span>
  </div>
);

const ChatMessage = ({ sender, content, time, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn ? 'bg-blue-500 text-white' : 'bg-white'}`}>
      {!isOwn && <p className="font-semibold text-sm mb-1">{sender}</p>}
      <p className="text-sm">{content}</p>
      <p className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}>{time}</p>
    </div>
  </div>
);

export default EnhancedChatInterface;