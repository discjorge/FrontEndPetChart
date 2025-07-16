import { useState, useEffect } from 'react';
import { useAuth } from './AuthContent.jsx';
import '../styles/Dashboard.css';

const Messages = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Messages component - useEffect triggered');
    console.log('Messages component - User exists:', !!user);
    console.log('Messages component - Token exists:', !!token);
    
    if (user && token) {
      console.log('Messages component - Calling fetchMessages');
      fetchMessages();
    } else {
      console.log('Messages component - User or token missing, not fetching');
    }
  }, [user, token]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Messages component - User:', user);
      console.log('Messages component - Token:', token);
      console.log('Messages component - User type:', user?.userType);
      
      const endpoint = user.userType === 'veterinarian' 
        ? '/messages/vet' 
        : '/messages/user';
      
      console.log('Messages component - Fetching from endpoint:', endpoint);
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Messages component - Response status:', response.status);
      console.log('Messages component - Response ok:', response.ok);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        
        console.error('Messages component - Error response:', errorData);
        
        // Handle the specific case where backend returns 404 with "no messages" message
        if (response.status === 404 && 
            (errorData.message?.includes('no messages') || 
             errorData.includes('no messages') ||
             errorData.message?.includes('You have no messages yet'))) {
          console.log('Messages component - No messages found, setting empty array');
          setMessages([]);
          return;
        }
        
        throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Messages component - Response data:', data);
      
      // Handle different possible response structures
      let messagesArray = [];
      
      if (data.messages && Array.isArray(data.messages)) {
        messagesArray = data.messages;
      } else if (Array.isArray(data)) {
        messagesArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        messagesArray = data.data;
      } else if (data.message && Array.isArray(data.message)) {
        messagesArray = data.message;
      }
      
      console.log('Messages component - Extracted messages array:', messagesArray);
      setMessages(messagesArray);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Unable to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="messages-card">
      <h3>Messages</h3>
      {loading ? (
        <p className="messages-loading">Loading messages...</p>
      ) : error ? (
        <p className="messages-error">{error}</p>
      ) : messages.length > 0 ? (
        <div className="messages-list">
          {messages.slice(0, 5).map((message, index) => {
            console.log('Messages component - Rendering message:', message);
            return (
              <div key={index} className="message-item">
                <div className="message-header">
                  <span className="message-sender">
                    {message.owner_name || `${message.first_name || ''} ${message.last_name || ''}`.trim() || message.senderName || message.from || message.sender || message.userName || `User ${message.user_id}`}
                  </span>
                  <span className="message-date">
                    {formatDate(message.created_at || message.createdAt || message.date || message.timestamp || message.sentAt)}
                  </span>
                </div>
                <div className="message-subject">
                  {message.pet_name ? `Pet Name: ${message.pet_name}` : 'Message from Vet'}
                </div>
                <div className="message-preview">
                  {truncateText(message.note || message.content || message.body || message.message || message.text || 'No content')}
                </div>
                {/* {!message.seen && (
                  <div className="unread-indicator">●</div>
                )} */}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-messages">No messages yet</p>
      )}
    </div>
  );
};

export default Messages; 