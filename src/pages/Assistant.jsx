import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Send, Copy, Bookmark, RefreshCw, Plus, 
  Trash, BookOpen, Film, Database, AlertCircle, 
  HelpCircle, ExternalLink, Menu, X, ChevronLeft, Check, 
  Sliders, MessageSquare, AlertTriangle, Layers, Video, Award,
  CheckCircle, FolderOpen, ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ThundraLogo from '../components/ThundraLogo';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Assistant() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  
  // Track active project context loaded in chat
  const [activeProjectContext, setActiveProjectContext] = useState(null);
  
  const chatEndRef = useRef(null);

  // Fallback preset projects to import as context
  const mockProjects = [
    { id: "p1", title: "AI Future Trends", type: "TikTok Short", fps: 30, scenes: 4 },
    { id: "p2", title: "Traditional Biryani Recipe", type: "Food Vlog", fps: 24, scenes: 8 },
    { id: "p3", title: "Cyberpunk Travel Vlog", type: "Travel Reel", fps: 23.976, scenes: 12 }
  ];

  // Initialize or Load Chat History
  useEffect(() => {
    const savedChats = localStorage.getItem('thundra_chats');
    if (savedChats) {
      const parsed = JSON.parse(savedChats);
      setChats(parsed);
      if (parsed.length > 0) {
        setActiveChatId(parsed[0].id);
      }
    } else {
      const initial = [
        {
          id: "chat_initial",
          title: "Resolve Color Grading Guide",
          saved: false,
          messages: [
            {
              id: "msg_1",
              sender: "user",
              text: "Give me a professional color grading workflow",
              time: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: "msg_2",
              sender: "ai",
              text: `### Cinematic Color Grading & Look Development

#### 📝 Overview
Color grading establishes the emotional and narrative tone of your video. A professional grading workflow consists of normalizing raw log profiles (like S-Log3 or C-Log) into standard Rec.709 color space, balancing contrast primaries, isolating skin tone vectors, and applying creative film-print emulation.

#### 🎬 Step-by-Step Workflow
1. **Normalize Log Footage**: Apply a Color Space Transform (CST) to map S-Log3/C-Log/V-Log into Rec.709 intermediate gamuts.
2. **Primary Contrast Balance**: Adjust Offset and Lift/Gamma/Gain wheels to secure deep black levels and retain highlights.
3. **Isolate Skin Tones**: Use the Qualifier to mask skin tones, ensuring they sit directly on the skin tone indicator line in the Vectorscope.
4. **Creative Look & Split-Toning**: Balance shadows with cool cyan hues and highlights with warm golden tones to create cinematic separation.
5. **Film Emulation & Textures**: Layer subtle film grain, halation overlays, and vignettes to replicate classic cinematic print looks.

#### 🛠️ Recommended Tools
- DaVinci Resolve Color Node Editor
- Dehancer Pro Plugin
- Hardware Color Calibration Scopes

#### ⚙️ Recommended Settings
- Color Science: DaVinci YRGB Color Managed
- Gamma Profile: Rec.709 Gamma 2.4 (for web/broadcast)

#### ⚠️ Common Mistakes
- Applying creative styling LUTs directly onto un-normalized flat camera profiles.

#### 💡 Professional Tips
- Adjust the Primary Offset wheel first to establish base exposure before diving into secondary nodes.

#### 🚀 Advanced Techniques
- Utilize Parallel and Layer Mixer nodes to isolate specific highlight/shadow ranges without destroying color data.`,
              resources: [
                { name: "Thundra Workspace", url: "/projects" },
                { name: "Editor Handbook", url: "https://helpx.adobe.com" }
              ],
              time: new Date(Date.now() - 3550000).toISOString()
            }
          ]
        }
      ];
      setChats(initial);
      setActiveChatId("chat_initial");
      localStorage.setItem('thundra_chats', JSON.stringify(initial));
    }
  }, []);

  const saveChatsToStorage = (updatedChats) => {
    setChats(updatedChats);
    localStorage.setItem('thundra_chats', JSON.stringify(updatedChats));
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatId, isTyping]);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const handleNewChat = () => {
    const newId = `chat_${Date.now()}`;
    const newSession = {
      id: newId,
      title: "New Video Strategy Chat",
      saved: false,
      messages: []
    };
    const updated = [newSession, ...chats];
    saveChatsToStorage(updated);
    setActiveChatId(newId);
    setActiveProjectContext(null);
    setSidebarOpen(false);
  };

  const handleDeleteChat = (id, e) => {
    e.stopPropagation();
    const updated = chats.filter(c => c.id !== id);
    saveChatsToStorage(updated);
    if (activeChatId === id) {
      if (updated.length > 0) {
        setActiveChatId(updated[0].id);
      } else {
        const fallbackId = `chat_${Date.now()}`;
        const fallbackSession = {
          id: fallbackId,
          title: "New Video Strategy Chat",
          saved: false,
          messages: []
        };
        setChats([fallbackSession]);
        setActiveChatId(fallbackId);
        setActiveProjectContext(null);
        localStorage.setItem('thundra_chats', JSON.stringify([fallbackSession]));
      }
    }
  };

  const handleBookmarkToggle = (chatId, messageId) => {
    const updated = chats.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          saved: !c.saved
        };
      }
      return c;
    });
    saveChatsToStorage(updated);
  };

  const handleCopyMessage = (text, msgId) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSendMessage = (textToSend) => {
    const promptText = textToSend || inputValue;
    if (!promptText.trim()) return;

    if (!activeChatId) {
      handleNewChat();
    }

    const currentChat = chats.find(c => c.id === activeChatId) || chats[0];
    const userMsgId = `msg_user_${Date.now()}`;
    const newUserMsg = {
      id: userMsgId,
      sender: "user",
      text: promptText,
      time: new Date().toISOString()
    };

    let updatedTitle = currentChat.title;
    if (currentChat.messages.length === 0 || currentChat.title === "New Video Strategy Chat") {
      updatedTitle = promptText.length > 25 ? promptText.substring(0, 22) + "..." : promptText;
    }

    const updatedMessages = [...currentChat.messages, newUserMsg];
    const updatedChats = chats.map(c => {
      if (c.id === currentChat.id) {
        return { ...c, title: updatedTitle, messages: updatedMessages };
      }
      return c;
    });

    saveChatsToStorage(updatedChats);
    setInputValue('');
    setIsTyping(true);

    fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: promptText,
        history: currentChat.messages
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Connection to Thundra AI service failed.");
      }
      return data;
    })
    .then((data) => {
      const aiMsgId = `msg_ai_${Date.now()}`;
      const newAiMsg = {
        id: aiMsgId,
        sender: "ai",
        text: data.content,
        resources: [
          { name: "Thundra Workspace", url: "/projects" },
          { name: "Editor Handbook", url: "https://helpx.adobe.com" }
        ],
        time: new Date().toISOString()
      };

      const finalChats = chats.map(c => {
        if (c.id === currentChat.id) {
          return { ...c, messages: [...updatedMessages, newAiMsg] };
        }
        return c;
      });

      saveChatsToStorage(finalChats);
      setIsTyping(false);
    })
    .catch((err) => {
      console.error("AI fetch error:", err);
      
      const errorMsg = `### ⚠️ AI Service Connection Required

No active AI API key was found in the backend configuration.

#### ⚙️ Configuration Setup Instructions
1. Open the backend environment file [\`backend/.env\`](file:///c:/Users/ESHOP/Desktop/AptechVision/backend/.env).
2. Set one of the following keys to your active API credentials:
   * **\`GEMINI_API_KEY\`**
   * **\`OPENAI_API_KEY\`**
   * **\`CLAUDE_API_KEY\`**
3. Save the file and restart the backend server.`;

      const aiMsgId = `msg_ai_${Date.now()}`;
      const newAiMsg = {
        id: aiMsgId,
        sender: "ai",
        text: err.message.includes("No AI API key found") ? errorMsg : `### ⚠️ AI Service Connection Error\n\n${err.message}`,
        resources: [],
        time: new Date().toISOString()
      };

      const finalChats = chats.map(c => {
        if (c.id === currentChat.id) {
          return { ...c, messages: [...updatedMessages, newAiMsg] };
        }
        return c;
      });

      saveChatsToStorage(finalChats);
      setIsTyping(false);
    });
  };

  const handleRegenerate = (chatId, lastUserText) => {
    setIsTyping(true);
    const currentChat = chats.find(c => c.id === chatId);
    if (!currentChat) return;

    const filteredMsgs = [...currentChat.messages];
    if (filteredMsgs[filteredMsgs.length - 1]?.sender === 'ai') {
      filteredMsgs.pop();
    }

    fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: lastUserText,
        history: filteredMsgs.slice(0, -1)
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Connection to Thundra AI service failed.");
      }
      return data;
    })
    .then((data) => {
      const altHeader = `*Alternative Solution*\n\n`;
      const finalMsg = {
        id: `msg_ai_regen_${Date.now()}`,
        sender: "ai",
        text: altHeader + data.content,
        resources: [
          { name: "Thundra Workspace", url: "/projects" },
          { name: "Editor Handbook", url: "https://helpx.adobe.com" }
        ],
        time: new Date().toISOString()
      };

      const updated = chats.map(c => {
        if (c.id === chatId) {
          return { ...c, messages: [...filteredMsgs, finalMsg] };
        }
        return c;
      });
      saveChatsToStorage(updated);
      setIsTyping(false);
    })
    .catch((err) => {
      console.error("AI regenerate error:", err);
      
      const errorMsg = `### ⚠️ AI Service Connection Required

No active AI API key was found in the backend configuration.

#### ⚙️ Configuration Setup Instructions
1. Open the backend environment file [\`backend/.env\`](file:///c:/Users/ESHOP/Desktop/AptechVision/backend/.env).
2. Set one of the following keys to your active API credentials:
   * **\`GEMINI_API_KEY\`**
   * **\`OPENAI_API_KEY\`**
   * **\`CLAUDE_API_KEY\`**
3. Save the file and restart the backend server.`;

      const finalMsg = {
        id: `msg_ai_regen_${Date.now()}`,
        sender: "ai",
        text: err.message.includes("No AI API key found") ? errorMsg : `### ⚠️ AI Service Connection Error\n\n${err.message}`,
        resources: [],
        time: new Date().toISOString()
      };

      const updated = chats.map(c => {
        if (c.id === chatId) {
          return { ...c, messages: [...filteredMsgs, finalMsg] };
        }
        return c;
      });
      saveChatsToStorage(updated);
      setIsTyping(false);
    });
  };

  const handleImportProject = (proj) => {
    setActiveProjectContext(proj);
    const text = `I've imported my project: "${proj.title}" (${proj.type}, ${proj.fps}fps, ${proj.scenes} scenes). Suggest an optimal pacing and rendering setup for this project.`;
    handleSendMessage(text);
  };


  // Helper parser to render stylized Markdown headings, bullets, and code blocks
  const renderMessageContent = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headings (Clean & structured but not over-bolded standard body)
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm md:text-base font-semibold text-white mt-4 mb-2 first:mt-0 tracking-wide">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={idx} className="text-xs md:text-sm font-semibold text-blueTheme uppercase tracking-wider mt-3 mb-1.5">{line.replace('#### ', '')}</h4>;
      }
      
      // Code blocks
      if (line.startsWith('```')) {
        const remainingLines = lines.slice(idx + 1);
        const endBlockIdx = remainingLines.findIndex(l => l.startsWith('```'));
        if (endBlockIdx !== -1) {
          const codeContent = remainingLines.slice(0, endBlockIdx).join('\n');
          lines.splice(idx, endBlockIdx + 2);
          return (
            <div key={idx} className="relative my-3 rounded-lg overflow-hidden border border-white/10 bg-[#070B12] font-mono text-[10px] text-slate-350">
              <div className="bg-[#101826] px-3.5 py-1.5 border-b border-white/5 flex items-center justify-between text-[9px] uppercase tracking-widest text-slate-400 font-semibold">
                <span>Code Preset</span>
                <button 
                  onClick={() => handleCopyMessage(codeContent, idx)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-blueTheme font-semibold"
                >
                  {copiedMsgId === idx ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMsgId === idx ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 overflow-x-auto leading-relaxed"><code>{codeContent}</code></pre>
            </div>
          );
        }
      }

      // Bullet points (Standard circular dots, clean and normal weight like ChatGPT)
      if (line.startsWith('* ')) {
        const content = line.substring(2);
        if (content.includes('**: ')) {
          const parts = content.split('**: ');
          return (
            <div key={idx} className="flex gap-2 text-xs md:text-sm font-normal text-slate-300 py-1 pl-3 leading-relaxed">
              <span className="text-slate-400 shrink-0">•</span>
              <span>
                <strong className="text-white font-semibold">{parts[0].replace('**', '')}:</strong> {parts[1]}
              </span>
            </div>
          );
        }
        return (
          <div key={idx} className="flex gap-2 text-xs md:text-sm font-normal text-slate-300 py-1 pl-3 leading-relaxed">
            <span className="text-slate-400 shrink-0">•</span>
            <span>{content}</span>
          </div>
        );
      }

      // Numbered lists (Gemini/ChatGPT style, clean & normal weight)
      if (/^\d+\.\s/.test(line)) {
        const content = line.replace(/^\d+\.\s/, '');
        const number = line.match(/^\d+/)[0];
        
        if (content.includes('**: ')) {
          const parts = content.split('**: ');
          return (
            <div key={idx} className="flex gap-2 text-xs md:text-sm font-normal text-slate-300 py-1 pl-1 leading-relaxed items-start">
              <span className="text-slate-400 font-semibold shrink-0">{number}.</span>
              <span>
                <strong className="text-white font-semibold">{parts[0].replace('**', '')}:</strong> {parts[1]}
              </span>
            </div>
          );
        }

        return (
          <div key={idx} className="flex gap-2 text-xs md:text-sm font-normal text-slate-355 py-1 pl-1 leading-relaxed items-start">
            <span className="text-slate-400 font-semibold shrink-0">{number}.</span>
            <span>{content}</span>
          </div>
        );
      }

      if (line.trim() === '') return <div key={idx} className="h-2" />;
      
      // Inline bold parsing
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={idx} className="text-xs md:text-sm font-normal text-slate-300 leading-relaxed mb-2">
            {parts.map((p, i) => i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{p}</strong> : p)}
          </p>
        );
      }

      return <p key={idx} className="text-xs md:text-sm font-normal text-slate-355 leading-relaxed mb-2">{line}</p>;
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-transparent text-slate-100 font-body relative flex flex-col justify-between">
      
      {/* THUNDRA AI LOGO & HOME NAVIGATION LINK */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          to="/"
          className="flex items-center gap-1.5 font-brand text-sm md:text-base font-black tracking-[0.03em] text-white shrink-0 group select-none cursor-pointer"
          title="Return to Home Page"
        >
          <ThundraLogo className="w-8 h-8 md:w-9 md:h-9 group-hover:rotate-3 transition-transform duration-300" />
          <span className="bg-gradient-to-r from-white via-slate-150 to-purpleLight bg-clip-text text-transparent">Thundra AI</span>
        </Link>
      </div>

      {/* CHAT INTERFACE CONTAINER (LOCKED TO VIEWPORT HEIGHT - TALLER DISPLAY) */}
      <div className="flex-1 h-0 max-w-7xl w-full mx-auto px-2 md:px-6 pb-3 md:pb-4 pt-14 md:pt-14 flex gap-4 md:gap-6 z-10 relative items-stretch">
        
        {/* SIDEBAR PANEL */}
        <div className={`
          fixed inset-y-0 left-0 z-40 w-[290px] bg-[#101826]/98 border-r border-[#3D5A80]/20 p-5 flex flex-col justify-between 
          transition-transform duration-300 backdrop-blur-2xl md:relative md:translate-x-0 md:bg-[#101826]/40 md:backdrop-blur-md md:rounded-2xl md:border md:h-full md:overflow-hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          
          <div className="space-y-5 flex-1 flex flex-col overflow-hidden h-full">
            {/* Sidebar Title / Header */}
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blueTheme animate-pulse" />
                <h2 className="font-black text-[11px] text-white font-heading tracking-wider uppercase">✨ Thundra AI Helper</h2>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"
                title="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="w-full py-2.5 px-4 rounded-xl border border-blueTheme/30 bg-blueTheme/5 text-blueTheme hover:bg-blueTheme/10 hover:border-blueTheme/50 transition-all font-black text-xs flex items-center justify-center gap-2 group cursor-pointer shrink-0 shadow-sm shadow-blueTheme/5"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>✨ Start New Chat</span>
            </button>

            {/* Scrollable Sidebar lists (using our new chat-scrollbar) */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-1.5 chat-scrollbar">
              {/* Recent chats */}
              <div>
                <span className="text-[9.5px] uppercase tracking-wider text-blueTheme/85 font-black block mb-2 px-1">💬 My Chats</span>
                <div className="space-y-1">
                  {chats.map(chat => (
                    <div
                      key={chat.id}
                      onClick={() => {
                        setActiveChatId(chat.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full p-2.5 rounded-lg text-left text-xs md:text-sm font-bold transition-all flex items-center justify-between group cursor-pointer border
                        ${chat.id === activeChatId 
                          ? 'bg-[#3D5A80]/20 border-[#3D5A80]/40 text-white' 
                          : 'bg-transparent border-transparent text-slate-300 hover:bg-white/[0.03] hover:text-slate-100'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 truncate flex-1">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${chat.id === activeChatId ? 'text-blueTheme' : 'text-slate-400'}`} />
                        <span className="truncate">{chat.title}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                        title="Delete chat log"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Consultations */}
              <div>
                <span className="text-[9.5px] uppercase tracking-wider text-[#D4A574] font-black block mb-2 px-1">⭐ Saved Answers</span>
                <div className="space-y-1">
                  {chats.filter(c => c.saved).length === 0 ? (
                    <p className="text-[9.5px] text-slate-455 italic px-2 py-1 font-semibold">Saved tips will show here.</p>
                  ) : (
                    chats.filter(c => c.saved).map(chat => (
                      <div
                        key={`saved_${chat.id}`}
                        onClick={() => {
                          setActiveChatId(chat.id);
                          setSidebarOpen(false);
                        }}
                        className="w-full p-2.5 rounded-lg text-left text-xs md:text-sm bg-slate-900/35 border border-pinkTheme/10 text-slate-200 hover:border-pinkTheme/30 hover:text-white transition-all flex items-center gap-2 cursor-pointer font-bold"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-[#D4A574] fill-[#D4A574]/20 shrink-0" />
                        <span className="truncate">{chat.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Active Projects context loader */}
              <div>
                <div className="flex items-center justify-between block mb-2 px-1">
                  <span className="text-[9.5px] uppercase tracking-wider text-blueTheme/85 font-black">🎥 Choose a Video Project</span>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" title="Click to feed this project setting directly into your AI Assistant context" />
                </div>
                <p className="text-[9px] text-slate-500 italic px-2 mb-2 select-none">Click any project below to load it into the chat!</p>
                <div className="space-y-2">
                  {mockProjects.map(proj => {
                    const isActive = activeProjectContext?.id === proj.id;
                    return (
                      <div
                        key={proj.id}
                        onClick={() => handleImportProject(proj)}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer group ${
                          isActive 
                            ? 'bg-blueTheme/15 border-blueTheme/55 shadow-[0_0_8px_rgba(79,209,255,0.08)]' 
                            : 'border-white/[0.05] bg-[#070B12]/40 hover:border-blueTheme/30 hover:bg-blueTheme/[0.01]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-black truncate transition-colors ${
                            isActive ? 'text-blueTheme' : 'text-slate-100 group-hover:text-blueTheme'
                          }`}>{proj.title}</span>
                          {isActive ? (
                            <CheckCircle className="w-3.5 h-3.5 text-blueTheme" />
                          ) : (
                            <FolderOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-blueTheme transition-colors" />
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-1 text-[9.5px] text-slate-355 font-bold">
                          <span>{proj.type}</span>
                          <span className="font-mono">{proj.fps}fps</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Footer info */}
          <div className="pt-3 border-t border-white/[0.04] text-[10px] text-slate-400 flex flex-col gap-1 shrink-0 font-bold select-none">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#D4A574]" />
              <span className="font-black text-slate-300">Thundra Assistant v1.4</span>
            </div>
            <span>Premium Video Workspace</span>
          </div>
        </div>

        {/* MAIN CHAT CONSOLE AREA (LOCKED HEIGHT, INDEPENDENT SCROLL) */}
        <div className="flex-1 h-full flex flex-col border border-white/[0.06] bg-[#101826]/45 backdrop-blur-md rounded-2xl relative overflow-hidden shadow-2xl">
          
          {/* Chat Panel Header */}
          <div className="px-5 py-3.5 border-b border-white/[0.06] bg-[#101826]/30 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-1.5 rounded bg-white/5 text-slate-300 hover:text-white cursor-pointer hover:bg-white/10"
              >
                <Menu className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                <div>
                  <h1 className="font-black text-xs md:text-sm text-white font-heading flex items-center gap-1.5">
                    <span>Thundra AI Helper</span>
                    <span className="text-[9px] font-bold text-slate-300 px-2 py-0.5 rounded-full bg-white/10 border border-white/15 hidden sm:inline-block">Friendly Engine</span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Context active project notice */}
            <div className="flex items-center gap-3 text-[10px]">

              {activeProjectContext && (
                <div className="hidden md:flex items-center gap-1.5 bg-blueTheme/15 border border-blueTheme/40 text-blueTheme px-3 py-1 rounded-full font-black animate-pulse shadow-sm">
                  <Check className="w-3 h-3" />
                  <span>Context: {activeProjectContext.title}</span>
                </div>
              )}
              <span className="hidden lg:inline text-slate-355 font-bold">GPU Engine: Active</span>
              <div className="flex items-center gap-1.5 bg-[#4FD1FF]/10 border border-[#4FD1FF]/20 px-2.5 py-1 rounded text-[#4FD1FF] font-black">
                <Sliders className="w-2.5 h-2.5" />
                <span>Post-Prod</span>
              </div>
            </div>
          </div>

          {/* SCROLLABLE MESSAGES STREAM PANEL */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative scroll-smooth chat-scrollbar">
            
            {(!activeChat || activeChat.messages.length === 0) ? (
              /* EMPTY WELCOME PANEL STATE (SIMPLE & FRIENDLY FOR ALL USERS) */
              <div className="max-w-2xl mx-auto py-6 space-y-7 flex flex-col justify-center min-h-full">
                
                {/* Logo & Welcome Header */}
                <div className="text-center space-y-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purpleTheme to-blueTheme p-[1px] mx-auto shadow-lg shadow-blueTheme/15">
                    <div className="w-full h-full bg-[#101826] rounded-2xl flex items-center justify-center text-blueTheme">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="text-xl md:text-2xl font-bold font-heading text-white bg-gradient-to-r from-white via-slate-100 to-blueTheme bg-clip-text text-transparent select-none">
                      Welcome to Thundra AI! ✨
                    </h2>
                    <p className="text-xs md:text-sm font-normal text-slate-350 max-w-lg mx-auto leading-relaxed">
                      I am your friendly AI video editing helper. Ask me any question, or select a topic box below to start learning!
                    </p>
                  </div>
                </div>

                {/* Categories of Actions (Very User Friendly) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  
                  {/* Category A: Channel Growth & Creative */}
                  <div className="space-y-3 p-4 rounded-2xl border border-white/[0.03] bg-[#101826]/30">
                    <div className="flex items-center gap-2 text-[#D4A574] font-bold text-xs uppercase tracking-widest font-heading select-none">
                      <Sparkles className="w-4 h-4" />
                      <span>🎨 Creative & Fun Stuff (Get Ideas)</span>
                    </div>
                    <p className="text-[10.5px] font-normal text-slate-400">
                      Get cool ideas for video concepts, write fun viral video hooks, or find B-roll templates.
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleSendMessage("How to edit viral reels?")}
                        className="w-full p-2.5 text-left text-xs md:text-sm font-semibold text-slate-200 rounded-lg bg-slate-950/20 border border-white/[0.04] hover:border-blueTheme/30 hover:bg-blueTheme/[0.02] transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span>How to edit viral reels?</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blueTheme group-hover:translate-x-0.5 transition-all" />
                      </button>
                      <button
                        onClick={() => handleSendMessage("Create 3 viral hooks for my short-form video about a camera editing software")}
                        className="w-full p-2.5 text-left text-xs md:text-sm font-semibold text-slate-200 rounded-lg bg-slate-950/20 border border-white/[0.04] hover:border-blueTheme/30 hover:bg-blueTheme/[0.02] transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span>Create Viral Hooks</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blueTheme group-hover:translate-x-0.5 transition-all" />
                      </button>
                      <button
                        onClick={() => handleSendMessage("Suggest B-roll ideas and camera shots for travel videos")}
                        className="w-full p-2.5 text-left text-xs md:text-sm font-semibold text-slate-200 rounded-lg bg-slate-950/20 border border-white/[0.04] hover:border-blueTheme/30 hover:bg-blueTheme/[0.02] transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span>Suggest B-Roll Shot List</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blueTheme group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>
                  </div>

                  {/* Category B: Tech Post-Production */}
                  <div className="space-y-3 p-4 rounded-2xl border border-white/[0.03] bg-[#101826]/30">
                    <div className="flex items-center gap-2 text-blueTheme font-bold text-xs uppercase tracking-widest font-heading select-none">
                      <Sliders className="w-4 h-4" />
                      <span>⚙️ Tech Helpers (Fix Problems)</span>
                    </div>
                    <p className="text-[10.5px] font-normal text-slate-400">
                      Fix computer lag, create color grading styles, or setup YouTube project templates.
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleSendMessage("Best Premiere Pro workflow for YouTube?")}
                        className="w-full p-2.5 text-left text-xs md:text-sm font-semibold text-slate-200 rounded-lg bg-slate-950/20 border border-white/[0.04] hover:border-blueTheme/30 hover:bg-blueTheme/[0.02] transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span>YouTube Premiere Pro Workflow</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blueTheme group-hover:translate-x-0.5 transition-all" />
                      </button>
                      <button
                        onClick={() => handleSendMessage("Give me a professional color grading workflow")}
                        className="w-full p-2.5 text-left text-xs md:text-sm font-semibold text-slate-200 rounded-lg bg-slate-950/20 border border-white/[0.04] hover:border-blueTheme/30 hover:bg-blueTheme/[0.02] transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span>Resolve Grading Node Setup</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blueTheme group-hover:translate-x-0.5 transition-all" />
                      </button>
                      <button
                        onClick={() => handleSendMessage("Help me troubleshoot timeline lag in Premiere Pro")}
                        className="w-full p-2.5 text-left text-xs md:text-sm font-semibold text-slate-200 rounded-lg bg-slate-950/20 border border-white/[0.04] hover:border-blueTheme/30 hover:bg-blueTheme/[0.02] transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span>Fix Timeline Lag / Crashes</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blueTheme group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Dynamic context loader alert info */}
                <div className="flex items-center gap-3 bg-white/[0.01] border border-white/[0.04] p-3.5 rounded-xl text-xs font-medium text-slate-200 select-none">
                  <Database className="w-4 h-4 text-blueTheme shrink-0" />
                  <span>
                    <strong>💡 Pro-Tip:</strong> You can click any video project under <strong>🎥 Choose a Video Project</strong> in the sidebar to load it directly!
                  </span>
                </div>

              </div>
            ) : (
              /* ACTIVE MESSAGES STREAM (OPEN FORMATTED LAYOUT LIKE CHATGPT / GEMINI) */
              <div className="max-w-3xl mx-auto space-y-7 flex flex-col">
                {activeChat.messages.map((msg, idx) => {
                  const isAi = msg.sender === 'ai';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="w-full"
                    >
                      {/* Active Project Banner inside user message if context was active */}
                      {!isAi && idx === 0 && activeProjectContext && (
                        <div className="flex items-center gap-1.5 bg-blueTheme/10 border border-blueTheme/30 text-[9.5px] text-blueTheme px-3 py-1 rounded-md mb-2.5 uppercase tracking-wider font-extrabold self-end ml-auto max-w-[70%]">
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Timeline context loaded for: {activeProjectContext.title}</span>
                        </div>
                      )}

                      {isAi ? (
                        /* AI ROW: AVATAR ON LEFT, TEXT ON RIGHT (NO BOX / NO BORDER CLUTTER) */
                        <div className="flex gap-4 w-full items-start">
                          {/* Thundra Sparkles Avatar */}
                          <div className="w-8 h-8 rounded-full bg-blueTheme/10 border border-blueTheme/25 flex items-center justify-center text-blueTheme shrink-0 mt-1 shadow-sm select-none">
                            <Sparkles className="w-4 h-4 animate-pulse" />
                          </div>

                          {/* AI Response Text Block */}
                          <div className="flex-1 space-y-3 min-w-0">
                            <div className="text-xs md:text-sm font-normal text-slate-350 leading-relaxed space-y-2.5">
                              {renderMessageContent(msg.text)}
                            </div>

                            {/* Dynamic Inline Resources and Actions Toolbar */}
                            <div className="flex flex-wrap items-center gap-3 text-slate-500 text-xs mt-3 select-none pt-2 border-t border-white/[0.03]">
                              {/* Copy response */}
                              <button
                                onClick={() => handleCopyMessage(msg.text, msg.id)}
                                className="p-1 hover:text-white transition-colors cursor-pointer"
                                title="Copy response"
                              >
                                {copiedMsgId === msg.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                              </button>

                              {/* Bookmark response */}
                              <button
                                onClick={() => handleBookmarkToggle(activeChat.id, msg.id)}
                                className={`p-1 hover:text-white transition-colors cursor-pointer ${activeChat.saved ? 'text-[#D4A574]' : ''}`}
                                title="Save consultation"
                              >
                                <Bookmark className={`w-4 h-4 ${activeChat.saved ? 'fill-[#D4A574]' : ''}`} />
                              </button>

                              {/* Regenerate response */}
                              {idx === activeChat.messages.length - 1 && (
                                <button
                                  onClick={() => {
                                    const userMsgs = activeChat.messages.filter(m => m.sender === 'user');
                                    if (userMsgs.length > 0) {
                                      handleRegenerate(activeChat.id, userMsgs[userMsgs.length - 1].text);
                                    }
                                  }}
                                  className="p-1 hover:text-white transition-colors cursor-pointer"
                                  title="Regenerate response"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              )}

                              {/* Helpful references inline (No clunky separate box) */}
                              {msg.resources && msg.resources.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 pl-3 border-l border-white/10 text-[10px] text-slate-500">
                                  <BookOpen className="w-3 h-3 text-slate-550 shrink-0" />
                                  <span className="font-bold text-slate-400">References:</span>
                                  {msg.resources.map((res, rIdx) => (
                                    <a
                                      key={rIdx}
                                      href={res.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:text-blueTheme underline transition-colors truncate max-w-[140px]"
                                    >
                                      {res.name}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* USER ROW: CLEAN COMPACT FLOATING CAPSULE ON RIGHT */
                        <div className="flex justify-end w-full">
                          <div className="max-w-[70%] rounded-2xl px-4 py-2.5 bg-secondaryBg/80 border border-white/5 text-slate-200 text-xs md:text-sm font-normal shadow-sm">
                            {msg.text}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Typing Loader animation */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 w-full items-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-blueTheme/10 border border-blueTheme/25 flex items-center justify-center text-blueTheme shrink-0 mt-1 shadow-sm">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="flex-1 py-1.5 flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blueTheme animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-blueTheme animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-blueTheme animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[10px] text-slate-550 font-mono font-bold">Thundra helper typing...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </div>
            )}

          </div>

          {/* Sticky Message Input Bar */}
          <div className="p-4 border-t border-white/[0.06] bg-[#101826]/35 shrink-0 z-10">
            <div className="max-w-3xl mx-auto relative">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2.5 bg-slate-950/65 border border-white/10 hover:border-blueTheme/30 focus-within:border-blueTheme/50 rounded-full px-5 py-2.5 transition-all shadow-inner"
              >
                {/* Simulated file attachments icon */}
                <button
                  type="button"
                  onClick={() => alert("Timeline Context File attachment simulation triggered. Drag and drop proxies, edit-logs, or scripts directly into the chat in a future version!")}
                  className="text-slate-500 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Attach timeline file"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about video editing (e.g. how to fix lag)..."
                  className="w-full bg-transparent border-0 outline-none text-xs md:text-sm font-semibold text-white placeholder-slate-500 py-1"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className={`
                    p-2 rounded-full transition-all shrink-0 cursor-pointer
                    ${(inputValue.trim() && !isTyping)
                      ? 'bg-gradient-to-r from-purpleTheme to-blueTheme text-white hover:scale-105 shadow-md shadow-blueTheme/15'
                      : 'bg-white/[0.02] text-slate-650'
                    }
                  `}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <div className="flex justify-between items-center text-[9px] text-slate-500 mt-2 px-4 select-none font-bold">
                <span>Thundra AI provides expert post-production and storytelling advice.</span>
                <span>Press Enter to consult</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
