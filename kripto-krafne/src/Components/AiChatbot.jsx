import { useState, useRef, useEffect } from "react";
import "./AIChatbot.css";

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Pozdrav! Ja sam AI asistent KriptoKrafne platforme. Tu sam da vam pomognem s edukacijom o kibernetičkoj sigurnosti. Možete me pitati o CTF izazovima, sigurnosnim konceptima ili tražiti hintove za zadatke. Kako vam mogu pomoći danas?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories] = useState([
    {
      id: "kriptografija",
      name: "Kriptografija",
      icon: "🔐",
      description: "Šifriranje, dešifriranje, Caesar, Vigenère, XOR, Base64, AES"
    },
    {
      id: "forenzika",
      name: "Forenzika",
      icon: "🔍",
      description: "Analiza datoteka, ekstrakcija skrivenih podataka, metapodaci"
    },
    {
      id: "web",
      name: "Web sigurnost",
      icon: "🌐",
      description: "SQL injection, XSS, CSRF, SSRF, logičke ranjivosti"
    },
    {
      id: "mreža",
      name: "Mrežna sigurnost",
      icon: "📡",
      description: "Analiza mrežnog prometa, PCAP, HTTP, TCP, UDP, DNS"
    },
    {
      id: "reversing",
      name: "Reverzno inženjerstvo",
      icon: "⚙️",
      description: "Analiza binarnih datoteka, assembly, disassembleri"
    },
    {
      id: "soc",
      name: "Socijalni inženjering",
      icon: "👥",
      description: "Manipulacija, phishing, prepoznavanje lažnih poruka"
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  
useEffect(() => {
  console.log("Komponenta se mountala/updateala");
  
  // Dodaj event listener za sprječavanje default ponašanja
  const preventDefault = (e) => {
    if (e.target.type === 'submit' || e.target.type === 'button') {
      e.preventDefault();
    }
  };
  
  document.addEventListener('click', preventDefault);
  
  return () => {
    document.removeEventListener('click', preventDefault);
  };
}, []);
const sendMessage = async (messageText = input) => {
  const textToSend = messageText || input;
  if (!textToSend.trim()) return;

  console.log("1. sendMessage pokrenut");
  
  const userMsg = { role: "user", content: textToSend };
  setMessages(prev => [...prev, userMsg]);
  setInput("");
  setLoading(true);

  try {
    console.log("2. Šaljem fetch zahtjev");
    
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ message: textToSend })
    });
    
    console.log("3. Fetch završen, status:", res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("HTTP error details:", errorText);
      throw new Error(`HTTP error! status: ${res.status}, details: ${errorText}`);
    }
    
    const data = await res.json();
    console.log("4. Primio odgovor:", data);
    
    const botMsg = { 
      role: "assistant", 
      content: data.response,
      timestamp: data.timestamp
    };
    setMessages(prev => [...prev, botMsg]);
    
  } catch (err) {
    console.error("Chat error:", err);
    const errorMsg = { 
      role: "assistant", 
      content: `Greška: ${err.message}`,
      isError: true
    };
    setMessages(prev => [...prev, errorMsg]);
  } finally {
    setLoading(false);
    console.log("5. sendMessage završio");
  }
};

  const handleCategoryClick = (category) => {
    console.log("Kliknuta kategorija:", category.name);
    const question = `Možeš li mi objasniti osnove kategorije ${category.name}?`;
    sendMessage(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSendClick = () => {
    // Ova funkcija se poziva samo na klik buttona - nema eventa
    sendMessage();
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Pozdrav! Ja sam AI asistent KriptoKrafne platforme. Tu sam da vam pomognem s edukacijom o kibernetičkoj sigurnosti. Možete me pitati o CTF izazovima, sigurnosnim konceptima ili tražiti hintove za zadatke. Kako vam mogu pomoći danas?"
      }
    ]);
  };

  return (
      <div className="chatbot-container ">
        <div className="chatbot-header bg-pink-300" >
          <div className="header-content">
            <h1>KriptoKrafne AI Asistent</h1>
            <p>Edukativna platforma za kibernetičku sigurnost</p>
          </div>
          <button className="clear-button" onClick={clearChat} type="button">
            Očisti chat
          </button>
        </div>

        <div className="chat-content">
          <div className="categories-sidebar">
            <h3>CTF Kategorije</h3>
            <div className="categories-list">
              {categories.map(category => (
                <button
                  key={category.id}
                  className="category-card"
                  onClick={() => handleCategoryClick(category)}
                  type="button"
                >
                  <div className="category-icon">{category.icon}</div>
                  <div className="category-info">
                    <div className="category-name">{category.name}</div>
                    <div className="category-desc">{category.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="chat-main">
            <div className="messages-container">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.role} ${message.isError ? 'error' : ''}`}
                >
                  <div className="message-content">
                    {message.content}
                  </div>
                  {message.timestamp && (
                    <div className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString('hr-HR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="message assistant typing">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
              

              
            </div>
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Unesite pitanje o kibernetičkoj sigurnosti..."
                  disabled={loading}
                />
                <button 
                  onClick={handleSendClick}
                  type="button"
                  disabled={loading || !input.trim()}
                  className="send-button"
                >
                  {loading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}