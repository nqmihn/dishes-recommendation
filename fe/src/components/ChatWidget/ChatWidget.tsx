import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import { chatService } from '../../services/chat-service';
import { formatCurrency, getProductImageUrl } from '../../utils/format';
import type { Product } from '../../types';
import './ChatWidget.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(trimmed, sessionToken);
      setSessionToken(response.session_token);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        products: response.products?.length > 0 ? response.products : undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionToken(undefined);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={`chat-fab ${isOpen ? 'chat-fab--hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Mở chat AI"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="chat-popup">
          {/* Header */}
          <div className="chat-popup-header">
            <div className="chat-popup-header-info">
              <Bot size={20} />
              <div>
                <div className="chat-popup-title">Trợ lý ẩm thực AI</div>
                <div className="chat-popup-subtitle">Hỏi tôi về món ăn bạn muốn!</div>
              </div>
            </div>
            <div className="chat-popup-header-actions">
              <button className="chat-popup-new-btn" onClick={handleNewChat} title="Cuộc trò chuyện mới">
                Mới
              </button>
              <button className="chat-popup-close" onClick={() => setIsOpen(false)} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-popup-messages">
            {messages.length === 0 && (
              <div className="chat-empty">
                <Bot size={48} className="chat-empty-icon" />
                <p>Xin chào! 👋</p>
                <p>Tôi có thể giúp bạn tìm món ăn phù hợp. Hãy cho tôi biết bạn muốn ăn gì nhé!</p>
                <div className="chat-suggestions">
                  <button onClick={() => setInput('Gợi ý món ăn nhẹ cho bữa trưa')}>
                    🥗 Món nhẹ bữa trưa
                  </button>
                  <button onClick={() => setInput('Tôi muốn ăn phở')}>
                    🍜 Các loại phở
                  </button>
                  <button onClick={() => setInput('Món nào ít calo?')}>
                    🔥 Ít calo
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message chat-message--${msg.role}`}>
                <div className="chat-message-avatar">
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="chat-message-content">
                  <div className="chat-message-text">{msg.content}</div>

                  {/* Product recommendations */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="chat-products">
                      {msg.products.map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          className="chat-product-card"
                          onClick={() => setIsOpen(false)}
                        >
                          <img
                            src={getProductImageUrl(product)}
                            alt={product.name}
                            className="chat-product-image"
                          />
                          <div className="chat-product-info">
                            <div className="chat-product-name">{product.name}</div>
                            {product.short_description && (
                              <div className="chat-product-desc">{product.short_description}</div>
                            )}
                            <div className="chat-product-price">{formatCurrency(product.base_price)}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-message chat-message--assistant">
                <div className="chat-message-avatar">
                  <Bot size={16} />
                </div>
                <div className="chat-message-content">
                  <div className="chat-message-typing">
                    <Loader2 size={16} className="chat-spinner" />
                    Đang suy nghĩ...
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chat-popup-input" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              disabled={isLoading}
              maxLength={2000}
            />
            <button type="submit" disabled={!input.trim() || isLoading} aria-label="Gửi">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
