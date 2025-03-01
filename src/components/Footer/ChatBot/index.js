// ChatBot.js
import React, { useState } from 'react';
import axios from 'axios';
import { LuArrowRight } from 'react-icons/lu';

const ChatBot = () => {
  const [messages, setMessages] = useState([{ text: 'What can I assist you with today?', isBot: true }]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { text: input, isBot: false }];
    setMessages(newMessages);
    setInput('');

    // Get response from OpenAI API
    const botResponse = await fetchBotResponse(input);
    setMessages([...newMessages, { text: botResponse, isBot: true }]);
  };

  const fetchBotResponse = async (userInput) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003',  // Confirm the model you’re using is available
          prompt: userInput,
          max_tokens: 50,            // Adjust based on your needs
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      
      console.log("Response data:", response.data);
      return response.data.choices[0].text.trim(); // Make sure this line is accessing the data correctly
  
    } catch (error) {
      console.error("Error fetching bot response:", error.response ? error.response.data : error.message);
      return "Sorry, I couldn't process that. Please try again.";
    }
  };

  return (
    <div className="chatbot">
      <div className="chatbot-title">
        <div className='chatbot-title-container'>Poly Chat Bot</div>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.isBot ? 'bot-message' : 'user-message'}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>
        <LuArrowRight className="arrow-icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
