import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import axiosInstance from '../api/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Message {
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
}

interface User {
  _id: string;
  fullname?: string;      // ✅ Changed to lowercase
  companyname?: string;   // ✅ Added for employers
  email: string;
  usertype?: string;
}

const Chat: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current user from localStorage
  const currentUserId = localStorage.getItem('id') || '';
  const currentUserName = localStorage.getItem('username') || 'User';
console.log('=== CHAT COMPONENT LOADED ===');
  console.log('localStorage.getItem("id"):', localStorage.getItem('id'));
  console.log('currentUserId:', currentUserId);
  console.log('currentUserName:', currentUserName);
  // ✅ Helper function to get display name
  const getDisplayName = (user: User) => {
    return user.fullname || user.companyname || 'Unknown User';
  };

  // Initialize socket and fetch users
  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Fetch all users
    axiosInstance
      .get('/api/users')
      .then((res) => {
        console.log('API Response:', res.data);
        // Filter out current user
        const filteredUsers = res.data.filter((u: User) => u.email !== currentUserId);
        console.log('Filtered users:', filteredUsers);
        setUsers(filteredUsers);
      })
      .catch((err) => console.error('Failed to load users:', err));

    return () => {
      newSocket.close();
    };
  }, [currentUserId]);

  // Handle user selection and room joining
  useEffect(() => {
    if (!socket || !selectedUser) return;

    // Generate consistent room ID
    const roomId = [currentUserId, selectedUser._id].sort().join('-');

    // Join room
    socket.emit('join_room', roomId);

    // Fetch previous messages
    axiosInstance
      .get(`/api/messages/${roomId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => {
        console.error('Failed to load messages:', err);
        setMessages([]);
      });

    // Listen for new messages
    const handleReceiveMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    // Listen for typing indicator
    const handleTyping = () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 2000);
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleTyping);
    };
  }, [socket, selectedUser, currentUserId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (!input.trim() || !socket || !selectedUser) return;

    const roomId = [currentUserId, selectedUser._id].sort().join('-');
    const messageData = {
      roomId,
      senderId: currentUserId,
      senderName: currentUserName,
      message: input,
      timestamp: new Date(),
    };

    socket.emit('send_message', messageData);
    setInput('');
  };

  // Handle typing event
  const handleTyping = () => {
    if (socket && selectedUser) {
      const roomId = [currentUserId, selectedUser._id].sort().join('-');
      socket.emit('typing', { roomId });
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const name = getDisplayName(user);
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container-fluid" style={{ height: '100vh', padding: 0 }}>
      <div className="row h-100" style={{ margin: 0 }}>
        {/* Sidebar - User List */}
        <div
          className="col-md-4 col-lg-3 bg-light border-end p-0"
          style={{ height: '100vh', overflowY: 'auto' }}
        >
          {/* Header */}
          <div className="bg-primary text-white p-3">
            <h5 className="mb-0">💬 Messages</h5>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-bottom">
            <input
              type="text"
              className="form-control"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* User List */}
          <div className="list-group list-group-flush">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-muted">
                {searchTerm ? 'No users found' : 'No users available'}
              </div>
            ) : (
              filteredUsers.map((user) => {
                const displayName = getDisplayName(user);
                return (
                  <div
                    key={user._id}
                    className={`list-group-item list-group-item-action ${
                      selectedUser?._id === user._id ? 'active' : ''
                    }`}
                    onClick={() => {
                      setSelectedUser(user);
                      setMessages([]);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                        style={{ width: 40, height: 40, fontSize: '1.2rem' }}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{displayName}</h6>
                        <small
                          className={
                            selectedUser?._id === user._id
                              ? 'text-white-50'
                              : 'text-muted'
                          }
                        >
                          {user.usertype || 'User'}
                        </small>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div
          className="col-md-8 col-lg-9 d-flex flex-column p-0"
          style={{ height: '100vh' }}
        >
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-bottom p-3 shadow-sm">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                    style={{ width: 50, height: 50, fontSize: '1.5rem' }}
                  >
                    {getDisplayName(selectedUser).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="mb-0">{getDisplayName(selectedUser)}</h5>
                    <small className="text-muted">{selectedUser.email}</small>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-grow-1 p-3 overflow-auto"
                style={{
                  height: 'calc(100vh - 140px)',
                  backgroundColor: '#f8f9fa',
                }}
              >
                {messages.length === 0 ? (
                  <div className="text-center text-muted mt-5">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-3 ${
                        msg.senderId === currentUserId ? 'text-end' : 'text-start'
                      }`}
                    >
                      <div
                        className={`d-inline-block p-3 rounded-3 shadow-sm ${
                          msg.senderId === currentUserId
                            ? 'bg-primary text-white'
                            : 'bg-white border'
                        }`}
                        style={{ maxWidth: '70%', wordWrap: 'break-word' }}
                      >
                        {msg.senderId !== currentUserId && (
                          <strong className="d-block mb-1">{msg.senderName}</strong>
                        )}
                        <p className="mb-1">{msg.message}</p>
                        <small
                          className={
                            msg.senderId === currentUserId
                              ? 'text-white-50'
                              : 'text-muted'
                          }
                          style={{ fontSize: '0.7rem' }}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </small>
                      </div>
                    </div>
                  ))
                )}
                {typing && (
                  <p className="text-muted fst-italic">
                    <small>{getDisplayName(selectedUser)} is typing...</small>
                  </p>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Box */}
              <div className="bg-white border-top p-3 shadow-sm">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      handleTyping();
                      if (e.key === 'Enter') sendMessage();
                    }}
                  />
                  <button
                    className="btn btn-primary px-4"
                    onClick={sendMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              <div className="text-center">
                <h4>👈 Select a user to start chatting</h4>
                <p>Choose someone from the list on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
