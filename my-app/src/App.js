import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const emoji_mapping = {
  "love": ["❤️", "💕", "😍", "💖", "😘"],
  "joy": ["😊", "😄", "😁", "😆", "😃"],
  "sadness": ["😢", "😔", "😞", "😭", "😪"],
  "anger": ["😡", "😤", "😠", "😾", "👿"],
  "fear": ["😨", "😱", "😰", "😳", "😬"],
  "surprise": ["😮", "😲", "😯", "😳", "😱"],
}

const App = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const debounceTimer = useRef(null);
  const [emojiOptions, setEmojiOptions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:3333');
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('WebSocket connection established');
      setUsername(prompt('Enter your username:'));
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      newSocket.close();
    };
  }, []);

  // Effect to scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const API_URL = "https://api-inference.huggingface.co/models/forwarder1121/results"
  const headers = {"Authorization": "Bearer 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"}
  
  async function query(payload) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: payload }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setEmojiOptions(emoji_mapping[data[0][0].label]);
    } catch (error) {
      console.error('Error fetching emoji options:', error.message);
      setEmojiOptions([]);
    }
  }

  const handleChange = async (event) => {
    const value = event.target.value;
    setMessage(value);
  
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  
    if (value !== '') {
      debounceTimer.current = setTimeout(async () => {
        await query(value);
      }, 1000);
    } else {
      setEmojiOptions([]);
    }
  };
  

  const handleEmojiSelect = (emoji) => {
    setMessage(message + emoji);
    setEmojiOptions([]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (socket && message.trim()) {
      socket.send(JSON.stringify({ sender: username, message: message.trim() }));
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'You', message: message.trim() },
      ]);
      setMessage('');
      setEmojiOptions([]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Online Chat</h1>
      </header>
      <main>
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-bubble ${
                  msg.sender === 'You' ? 'sent' : 'received'
                }`}
              >
                <div className="message-sender">{msg.sender}</div>
                <div className="message-text">{msg.message}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="message-input">
            <div className="emoji-options">
              {emojiOptions.length > 0 && (
                <div className="emoji-options-container">
                  {emojiOptions.map((emoji, index) => (
                    <span
                      key={index}
                      className="emoji-option"
                      onClick={() => handleEmojiSelect(emoji)}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className='input-container'>
              <input
                type="text"
                value={message}
                onChange={handleChange}
                placeholder="Type your message..."
              />
              <button type="submit">Send</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default App;
