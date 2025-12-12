import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { MOCK_USERS, MOCK_COMMUNITIES } from '../constants';
import { Search, Send, MoreVertical, Phone, Video, Plus, Image as ImageIcon, Mic, Paperclip, Bell, Info, Users, Building2, Edit, ChevronLeft } from 'lucide-react';

interface MessagesViewProps {
  currentUser: UserProfile;
  initialSelectedUserId?: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatSession {
  id: string;
  type: 'dm' | 'channel';
  participantId?: string; // For DM
  communityId?: string; // For Channel
  lastMessage?: Message;
  unreadCount: number;
}

const MessagesView: React.FC<MessagesViewProps> = ({ currentUser, initialSelectedUserId }) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'channels'>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    // 1. Define Sessions structure
    const dmChats: ChatSession[] = MOCK_USERS
      .filter(u => u.id !== currentUser.id)
      .map((u, i) => ({
        id: `dm-${u.id}`,
        type: 'dm',
        participantId: u.id,
        unreadCount: i === 0 ? 2 : 0,
      }));

    const channelChats: ChatSession[] = MOCK_COMMUNITIES.map((c, i) => ({
        id: `ch-${c.id}`,
        type: 'channel',
        communityId: c.id,
        unreadCount: i === 0 ? 5 : 0,
    }));

    const allChats = [...dmChats, ...channelChats];
    const initialMessages: Record<string, Message[]> = {};

    // 2. Generate Distinct Histories
    allChats.forEach(chat => {
       const msgs: Message[] = [];
       const now = Date.now();

       if (chat.type === 'dm') {
           const partner = MOCK_USERS.find(u => u.id === chat.participantId);
           
           if (partner?.role === 'Nurse') {
                // Conversation with Nurse Mike
                msgs.push(
                   { id: `m-${chat.id}-1`, senderId: currentUser.id, text: "Hey Mike, is bed 4 in the ED clear yet? I have an admission.", timestamp: new Date(now - 86400000), isRead: true },
                   { id: `m-${chat.id}-2`, senderId: partner.id, text: "Just cleaning it now. Give me 10 mins.", timestamp: new Date(now - 86300000), isRead: true },
                   { id: `m-${chat.id}-3`, senderId: currentUser.id, text: "Thanks. Also, nice catch on the sepsis protocol earlier.", timestamp: new Date(now - 3600000), isRead: true },
                   { id: `m-${chat.id}-4`, senderId: partner.id, text: "No problem! Patient is stable now.", timestamp: new Date(now - 3500000), isRead: true }
                );
           } else if (partner?.role === 'Paramedic') {
                // Conversation with Paramedic John
                msgs.push(
                   { id: `m-${chat.id}-1`, senderId: partner.id, text: "Bringing in a 25M motorcycle crash. ETA 10m.", timestamp: new Date(now - 7200000), isRead: true },
                   { id: `m-${chat.id}-2`, senderId: currentUser.id, text: "Trauma team activated. What are the vitals?", timestamp: new Date(now - 7100000), isRead: true },
                   { id: `m-${chat.id}-3`, senderId: partner.id, text: "BP 88/50, HR 135. Pelvis unstable. Bound it in the field.", timestamp: new Date(now - 7000000), isRead: true }
                );
           } else if (partner?.role === 'Doctor' && partner.id === 'u5') {
               // Dr. House
               msgs.push(
                   { id: `m-${chat.id}-1`, senderId: partner.id, text: "You missed the obvious. It's never Lupus.", timestamp: new Date(now - 120000000), isRead: true },
                   { id: `m-${chat.id}-2`, senderId: currentUser.id, text: "The ANA was positive though.", timestamp: new Date(now - 119000000), isRead: true },
                   { id: `m-${chat.id}-3`, senderId: partner.id, text: "False positive. Check for heavy metals.", timestamp: new Date(now - 118000000), isRead: true }
               );
           } else {
                // Generic Med Student / Doctor
                msgs.push(
                   { id: `m-${chat.id}-1`, senderId: partner?.id || 'other', text: "Do you have the slides for Grand Rounds?", timestamp: new Date(now - 100000000), isRead: true },
                   { id: `m-${chat.id}-2`, senderId: currentUser.id, text: "Sent them to your email.", timestamp: new Date(now - 90000000), isRead: true },
                   { id: `m-${chat.id}-3`, senderId: partner?.id || 'other', text: "Let's review the differentials for the cardio case tomorrow.", timestamp: new Date(now - 3600000), isRead: true }
                );
           }
       } else {
           // Channel History
           const communityUsers = MOCK_USERS.filter(u => u.id !== currentUser.id);
           
           if (chat.id.includes('comm-1')) { 
               // General Hospital Residents (Group Chat)
               msgs.push(
                   { id: `m-${chat.id}-1`, senderId: communityUsers[0].id, text: "Has anyone seen the new rotation schedule?", timestamp: new Date(now - 172800000), isRead: true },
                   { id: `m-${chat.id}-2`, senderId: communityUsers[1].id, text: "It's on the intranet. Looks like I'm on nights next month 😭", timestamp: new Date(now - 172000000), isRead: true },
                   { id: `m-${chat.id}-3`, senderId: currentUser.id, text: "I can swap a few shifts if you need coverage.", timestamp: new Date(now - 171000000), isRead: true },
                   { id: `m-${chat.id}-4`, senderId: communityUsers[0].id, text: "You're a lifesaver! Also, free pizza in the lounge right now.", timestamp: new Date(now - 3000000), isRead: true },
                   { id: `m-${chat.id}-5`, senderId: communityUsers[2].id, text: "On my way!", timestamp: new Date(now - 2000000), isRead: true }
               );
           } else if (chat.id.includes('comm-2')) {
               // Internal Medicine Interest
               msgs.push(
                   { id: `m-${chat.id}-1`, senderId: communityUsers[1].id, text: "Who is presenting the difficult airway case on Friday?", timestamp: new Date(now - 86400000), isRead: true },
                   { id: `m-${chat.id}-2`, senderId: communityUsers[2].id, text: "I think it's Sarah (u1).", timestamp: new Date(now - 85000000), isRead: true },
                   { id: `m-${chat.id}-3`, senderId: communityUsers[3].id, text: "Can someone share the Zoom link?", timestamp: new Date(now - 7200000), isRead: true }
               );
           } else {
               // Generic Community
               msgs.push(
                   { id: `m-${chat.id}-1`, senderId: communityUsers[0].id, text: "Welcome to the group everyone!", timestamp: new Date(now - 900000000), isRead: true }
               );
           }
       }
       
       initialMessages[chat.id] = msgs;
       
       // Update chat preview with last message
       const lastMsg = msgs[msgs.length - 1];
       if (lastMsg) {
           chat.lastMessage = lastMsg;
           chat.unreadCount = chat.unreadCount > 0 ? chat.unreadCount : 0; // Keep mock unread count or reset
       }
    });

    setMessages(initialMessages);
    setChats(allChats);

    // Set initial selection
    if (initialSelectedUserId) {
        const targetChat = dmChats.find(c => c.participantId === initialSelectedUserId);
        if (targetChat) {
            setSelectedChatId(targetChat.id);
            setActiveTab('chats');
        }
    } else if (allChats.length > 0 && !selectedChatId) {
        // Default to first chat if nothing selected
        setSelectedChatId(allChats[0].id);
    }
  }, [currentUser.id, initialSelectedUserId]); // Removed selectedChatId dependency to avoid re-generating

  // --- HANDLERS ---

  const activeChat = chats.find(c => c.id === selectedChatId);
  
  // Resolve participant details
  const chatPartner = activeChat?.type === 'dm' ? MOCK_USERS.find(u => u.id === activeChat.participantId) : null;
  const chatCommunity = activeChat?.type === 'channel' ? MOCK_COMMUNITIES.find(c => c.id === activeChat.communityId) : null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChatId) return;

    const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        text: inputText,
        timestamp: new Date(),
        isRead: true
    };

    setMessages(prev => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));
    
    // Update last message in chat list
    setChats(prev => prev.map(c => 
        c.id === selectedChatId 
        ? { ...c, lastMessage: newMessage, unreadCount: 0 } 
        : c
    ));

    setInputText('');
  };

  const getFilteredChats = () => {
      let filtered = chats.filter(c => c.type === (activeTab === 'chats' ? 'dm' : 'channel'));
      
      if (searchQuery) {
          const lowerQ = searchQuery.toLowerCase();
          filtered = filtered.filter(c => {
              if (c.type === 'dm') {
                  const u = MOCK_USERS.find(user => user.id === c.participantId);
                  return u?.name.toLowerCase().includes(lowerQ);
              } else {
                  const comm = MOCK_COMMUNITIES.find(comm => comm.id === c.communityId);
                  return comm?.name.toLowerCase().includes(lowerQ);
              }
          });
      }
      return filtered;
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChatId]);


  return (
    <div className="h-full flex bg-[#F8FAFC] overflow-hidden font-sans">
      
      {/* --- LEFT COLUMN: CONVERSATION LIST (30-32%) --- */}
      <div className="w-full md:w-[32%] lg:w-[30%] bg-white border-r border-[#E2E8F0] flex flex-col h-full shrink-0">
         
         {/* 2.2 Top Bar */}
         <div className="p-4 flex justify-between items-center border-b border-slate-50 shrink-0">
            <div>
                <h2 className="text-[#0A2342] font-bold text-lg leading-none">Messages</h2>
                <p className="text-[#64748B] text-xs mt-1">Chats and channels</p>
            </div>
            <button className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#1CB5B2] hover:bg-[#E0F7F6] transition-colors">
                <Edit className="w-4 h-4" />
            </button>
         </div>

         {/* 2.3 Search Bar */}
         <div className="px-4 py-3 shrink-0">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-[#1CB5B2] transition-colors" />
                <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages and people" 
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-[#1CB5B2] focus:ring-1 focus:ring-[#1CB5B2] transition-all shadow-sm"
                />
            </div>
         </div>

         {/* 2.4 Tabs */}
         <div className="flex border-b border-[#E2E8F0] shrink-0">
            <button 
                onClick={() => setActiveTab('chats')}
                className={`flex-1 py-3 text-sm text-center transition-all relative ${activeTab === 'chats' ? 'text-[#0A2342] font-bold' : 'text-[#64748B] hover:text-[#0A2342]'}`}
            >
                Chats
                {activeTab === 'chats' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1CB5B2]"></span>}
            </button>
            <button 
                onClick={() => setActiveTab('channels')}
                className={`flex-1 py-3 text-sm text-center transition-all relative ${activeTab === 'channels' ? 'text-[#0A2342] font-bold' : 'text-[#64748B] hover:text-[#0A2342]'}`}
            >
                Community channels
                {activeTab === 'channels' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1CB5B2]"></span>}
            </button>
         </div>

         {/* 2.5 & 2.6 Lists */}
         <div className="flex-1 overflow-y-auto">
            {getFilteredChats().length === 0 ? (
                <div className="p-8 text-center text-[#94A3B8]">
                    <p className="text-sm">No conversations found.</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-50">
                    {getFilteredChats().map(chat => {
                        const isSelected = chat.id === selectedChatId;
                        
                        if (chat.type === 'dm') {
                            const user = MOCK_USERS.find(u => u.id === chat.participantId);
                            if (!user) return null;
                            return (
                                <div 
                                    key={chat.id} 
                                    onClick={() => setSelectedChatId(chat.id)}
                                    className={`relative p-4 flex items-start gap-3 cursor-pointer hover:bg-[#EFF6FF] transition-all group ${isSelected ? 'bg-white shadow-sm' : ''}`}
                                >
                                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1CB5B2]"></div>}
                                    
                                    <div className="relative shrink-0">
                                        <img src={user.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#1CB5B2] border-2 border-white rounded-full"></div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h4 className={`text-sm truncate pr-2 ${isSelected ? 'font-bold text-[#0A2342]' : 'font-medium text-[#0A2342]'}`}>{user.name}</h4>
                                            <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">
                                                {chat.lastMessage ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-[#0A2342] font-semibold' : 'text-[#64748B]'}`}>
                                                {chat.lastMessage?.senderId === currentUser.id && 'You: '}
                                                {chat.lastMessage?.text || 'Start a conversation'}
                                            </p>
                                            {chat.unreadCount > 0 && (
                                                <span className="ml-2 bg-[#1CB5B2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                                    {chat.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            // Channel Row
                            const comm = MOCK_COMMUNITIES.find(c => c.id === chat.communityId);
                            if (!comm) return null;
                            return (
                                <div 
                                    key={chat.id} 
                                    onClick={() => setSelectedChatId(chat.id)}
                                    className={`relative p-4 flex items-center gap-3 cursor-pointer hover:bg-[#EFF6FF] transition-all ${isSelected ? 'bg-white shadow-sm' : ''}`}
                                >
                                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1CB5B2]"></div>}
                                    
                                    <div className="w-10 h-10 rounded-full bg-[#E0F7F6] flex items-center justify-center shrink-0 text-[#1CB5B2]">
                                        {comm.type === 'Hospital' ? <Building2 className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h4 className={`text-sm truncate pr-2 ${isSelected ? 'font-bold text-[#0A2342]' : 'font-medium text-[#0A2342]'}`}>{comm.name}</h4>
                                            {chat.unreadCount > 0 && (
                                                <span className="bg-[#1CB5B2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                                    {chat.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-[#64748B]">
                                            {comm.type} · {comm.memberCount} members
                                        </p>
                                        <p className="text-[10px] text-[#94A3B8] mt-1 flex items-center gap-1">
                                            From: {comm.name}
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            )}
         </div>
      </div>

      {/* --- RIGHT COLUMN: ACTIVE CHAT (68-70%) --- */}
      <div className="hidden md:flex flex-col flex-1 h-full bg-[#F8FAFC] relative">
         
         {activeChat ? (
             <>
                {/* 3.1 Chat Header */}
                <div className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex justify-between items-center shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        {activeChat.type === 'dm' && chatPartner ? (
                            <>
                                <div className="relative">
                                    <img src={chatPartner.avatar} className="w-10 h-10 rounded-full object-cover" />
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#1CB5B2] border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-[#0A2342] font-bold text-base leading-tight">{chatPartner.name}</h3>
                                    <p className="text-[#64748B] text-xs">{chatPartner.role} · {chatPartner.institutionId ? 'General Hospital' : 'Clinician'}</p>
                                </div>
                            </>
                        ) : chatCommunity ? (
                            <>
                                <div className="w-10 h-10 rounded-full bg-[#E0F7F6] flex items-center justify-center text-[#1CB5B2]">
                                    <img src={chatCommunity.image} className="w-full h-full object-cover rounded-full opacity-80" />
                                </div>
                                <div>
                                    <h3 className="text-[#0A2342] font-bold text-base leading-tight">{chatCommunity.name}</h3>
                                    <p className="text-[#64748B] text-xs cursor-pointer hover:text-[#1CB5B2] hover:underline">
                                        Community chat · {chatCommunity.name}
                                    </p>
                                </div>
                            </>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
                            <Info className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
                            <Bell className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* 3.2 Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
                    {messages[activeChat.id]?.map((msg, idx) => {
                        const isMe = msg.senderId === currentUser.id;
                        const sender = isMe ? currentUser : MOCK_USERS.find(u => u.id === msg.senderId);
                        
                        // Render timestamp if first message or significantly later than previous
                        const prevMsg = messages[activeChat.id][idx - 1];
                        const showTimestamp = !prevMsg || (new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime() > 3600000);

                        return (
                            <React.Fragment key={msg.id}>
                                {showTimestamp && (
                                    <div className="flex justify-center my-4">
                                        <span className="text-[10px] font-bold text-[#94A3B8] bg-[#F1F5F9] px-2 py-1 rounded-full uppercase tracking-wider">
                                            {new Date(msg.timestamp).toLocaleDateString([], {weekday: 'short', hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                )}
                                
                                <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} group`}>
                                    <div className={`flex max-w-[75%] gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                        
                                        {!isMe && (
                                            <img src={sender?.avatar} className="w-8 h-8 rounded-full self-end mb-1 border border-slate-100" title={sender?.name} />
                                        )}

                                        <div className={`relative px-4 py-3 shadow-sm text-sm leading-relaxed ${
                                            isMe 
                                            ? 'bg-[#1CB5B2] text-white rounded-2xl rounded-tr-sm' 
                                            : 'bg-white text-[#0A2342] border border-[#E2E8F0] rounded-2xl rounded-tl-sm'
                                        }`}>
                                            {/* Name for group chats if not me */}
                                            {activeChat.type === 'channel' && !isMe && (
                                                <span className="block text-[10px] font-bold text-[#1CB5B2] mb-1">{sender?.name}</span>
                                            )}
                                            
                                            {msg.text}
                                            
                                            {/* Timestamp on hover */}
                                            <div className={`text-[9px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-right ${isMe ? 'text-teal-100' : 'text-slate-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* 3.3 Chat Footer (Input) */}
                <div className="bg-white border-t border-[#E2E8F0] p-4 shrink-0 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)]">
                    <form onSubmit={handleSendMessage} className="flex items-end gap-3 max-w-4xl mx-auto w-full">
                        <div className="flex gap-1 pb-2">
                            <button type="button" className="p-2 text-[#94A3B8] hover:text-[#1CB5B2] hover:bg-[#F1F5F9] rounded-full transition-colors">
                                <Plus className="w-5 h-5" />
                            </button>
                            <button type="button" className="p-2 text-[#94A3B8] hover:text-[#1CB5B2] hover:bg-[#F1F5F9] rounded-full transition-colors">
                                <ImageIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="flex-1 relative">
                            <textarea 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                placeholder="Write a message..." 
                                className="w-full bg-[#F1F5F9] border-none rounded-2xl px-4 py-3 text-sm text-[#0A2342] placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#1CB5B2] resize-none max-h-32"
                                rows={1}
                                style={{ minHeight: '44px' }}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={!inputText.trim()}
                            className="p-3 bg-[#1CB5B2] text-white rounded-full hover:brightness-105 disabled:bg-[#E2E8F0] disabled:text-[#94A3B8] transition-all shadow-sm mb-1"
                        >
                            <Send className="w-5 h-5 ml-0.5" />
                        </button>
                    </form>
                </div>
             </>
         ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                 <div className="w-20 h-20 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-6">
                     <Users className="w-8 h-8 text-[#1CB5B2]" />
                 </div>
                 <h2 className="text-xl font-bold text-[#0A2342] mb-2">No conversations selected</h2>
                 <p className="text-[#64748B] max-w-sm">
                     Choose a chat from the left or start a new connection with your colleagues.
                 </p>
                 <button className="mt-6 px-6 py-3 bg-[#1CB5B2] text-white font-bold rounded-lg hover:brightness-105 shadow-sm transition-all">
                     Start new message
                 </button>
             </div>
         )}

      </div>
    </div>
  );
};

export default MessagesView;