import { useState, useRef, useEffect } from 'react';
import { FaComment, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { streamChatMessage } from '../services/chatbotServices';

const WIDGET_VERSION = 'v1.0.2'; // Build version for debugging

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! Tôi là trợ lý ảo của Barbershop. Tôi có thể giúp gì cho bạn?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  
  const messagesEndRef = useRef(null);
  const abortStreamRef = useRef(null);
  const streamingTextRef = useRef(''); // Store accumulated streaming text

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingMessage]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isStreaming) return;

    console.log(`[ChatWidget ${WIDGET_VERSION}] Sending message:`, inputMessage);

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsStreaming(true);
    setCurrentStreamingMessage('');
    streamingTextRef.current = ''; // Reset streaming text

    // Create a placeholder for bot response
    const botMessageId = Date.now() + 1;

    abortStreamRef.current = await streamChatMessage(
      inputMessage,
      // onChunk
      (chunk) => {
        console.log('[ChatWidget] Received chunk:', chunk);
        streamingTextRef.current += chunk; // Accumulate in ref
        setCurrentStreamingMessage(streamingTextRef.current); // Update display
      },
      // onComplete
      () => {
        console.log('[ChatWidget] Stream complete. Final text:', streamingTextRef.current);
        setMessages((prev) => [
          ...prev,
          {
            id: botMessageId,
            text: streamingTextRef.current, // Use ref value
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
        setCurrentStreamingMessage('');
        streamingTextRef.current = ''; // Clear ref
        setIsStreaming(false);
      },
      // onError
      (error) => {
        console.error('[ChatWidget] Chat error:', error);
        setMessages((prev) => [
          ...prev,
          {
            id: botMessageId,
            text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
        setCurrentStreamingMessage('');
        streamingTextRef.current = ''; // Clear ref on error
        setIsStreaming(false);
      }
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">💈</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Barbershop Assistant</h3>
                <p className="text-yellow-100 text-xs">Online • Trả lời ngay • {WIDGET_VERSION}</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:bg-yellow-600 p-2 rounded-full transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Streaming Message */}
            {isStreaming && currentStreamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-[75%] px-4 py-2 rounded-2xl bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-200">
                  <p className="text-sm whitespace-pre-wrap">
                    {currentStreamingMessage}
                    <span className="inline-block w-2 h-4 bg-gray-800 ml-1 animate-pulse">|</span>
                  </p>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isStreaming && !currentStreamingMessage && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                disabled={isStreaming}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-yellow-400 disabled:bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isStreaming}
                className="bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-full transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FaPaperPlane size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center gap-2"
        >
          <FaComment size={24} />
          <span className="font-semibold pr-2">Chat ngay</span>
        </button>
      )}
    </div>
  );
}
