import { useState, useEffect } from 'react';
import { useAuth } from './AuthContent.jsx';
import '../styles/Dashboard.css';

const Messages = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchMessages();
    }
  }, [user, token]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError('');
      
      const endpoint = user.userType === 'veterinarian' 
        ? '/messages/vet' 
        : '/messages/user';
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else {
        setMessages([]);
      }
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
          {messages.slice(0, 5).map((message, index) => (
            <div key={index} className="message-item">
              <div className="message-header">
                <span className="message-sender">
                  {message.senderName || message.from || 'Unknown'}
                </span>
                <span className="message-date">
                  {formatDate(message.createdAt || message.date)}
                </span>
              </div>
              <div className="message-subject">
                {message.subject || 'No Subject'}
              </div>
              <div className="message-preview">
                {truncateText(message.content || message.body || 'No content')}
              </div>
              {message.unread && (
                <div className="unread-indicator">●</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-messages">No messages yet</p>
      )}
    </div>
  );
};

export default Messages; 