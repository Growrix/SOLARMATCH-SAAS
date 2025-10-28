'use client'

import React, { useState, useEffect, useRef } from 'react'

// --- Icon Components ---
const Send = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const X = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const Minimize2 = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>;
const Maximize2 = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="15 3 21 3 21 9"/><polyline points="9 3 3 3 3 9"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="9" x2="10" y2="16"/></svg>;
const BotIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;
const WelcomeBotIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Array<{id: string, content: string, role: 'user' | 'assistant', timestamp: Date}>>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);


  const handleToggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user' as const,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: `Thanks for your question about "${inputMessage}". In a real application, this would connect to a solar AI assistant to help you with rebate calculations, system sizing, and installer recommendations. This is a frontend demo.`,
        role: 'assistant' as const,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={handleToggleChat}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/30 z-[9999] bg-primary animate-pulse-shadow"
          aria-label="Open Solar AI assistant"
        >
          <div className="relative z-10 flex items-center justify-center w-full h-full text-white">
            <BotIcon className="h-6 w-6" />
          </div>
        </button>
      )}
      
      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed z-[9999] transition-all duration-300 ease-in-out ${
          isMinimized 
            ? 'bottom-24 right-4 w-80 h-16' 
            : 'bottom-4 right-4 w-full max-w-[360px] h-[600px]'
        } max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]`}>
          
          <div className="floating-chat-window bg-white/70 dark:bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800/50 h-full flex flex-col">
            {/* Header */}
            <div className="floating-chat-header flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-br from-primary to-teal-700 text-white rounded-t-2xl flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <BotIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Solar AI Assistant</h3>
                  <p className="text-xs text-teal-100">Frontend Demo Mode</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 /> : <Minimize2 />}
                </button>
                
                <button
                  onClick={handleToggleChat}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close chat"
                >
                  <X />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="floating-chat-messages flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-900/50">
                  {messages.length === 0 ? (
                    <div className="text-center text-slate-500 dark:text-slate-400 mt-8 animate-message-fade-in">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <WelcomeBotIcon />
                      </div>
                      <h4 className="font-semibold mb-2 text-slate-800 dark:text-white">Welcome to Solar AI Assistant</h4>
                      <p className="text-sm">Ask me anything about solar energy, rebates, or get help with your quotes!</p>
                      <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-2">Frontend Demo Mode - No real AI responses</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={`flex items-end gap-2 animate-message-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mb-7">
                            <BotIcon className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className={`max-w-[80%] px-4 py-3 ${
                          msg.role === 'user' 
                            ? 'floating-chat-user-msg bg-primary text-white rounded-tr-2xl rounded-tl-2xl rounded-bl-2xl rounded-br-lg' 
                            : 'floating-chat-assistant-msg bg-gray-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-tl-lg rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
                        }`}>
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          <div className={`text-xs mt-1 text-right ${
                            msg.role === 'user' ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {isTyping && (
                    <div className="flex items-end gap-2 animate-message-fade-in">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mb-7">
                            <BotIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="floating-chat-assistant-msg bg-gray-200 dark:bg-slate-800 rounded-tl-lg rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-3 max-w-[80%]">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">AI is typing...</div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="floating-chat-input-area border-t border-gray-200/50 dark:border-slate-800/50 p-4 bg-white/50 dark:bg-black/30 rounded-b-2xl flex-shrink-0">
                  <div className="flex items-end space-x-2">
                    {/* Message Input */}
                    <div className="flex-1 relative">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="floating-chat-input w-full px-3 py-2 bg-gray-100 dark:bg-slate-800 border border-transparent rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none max-h-32"
                        rows={1}
                      />
                    </div>

                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex-shrink-0"
                      aria-label="Send message"
                    >
                      <Send />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default FloatingChat