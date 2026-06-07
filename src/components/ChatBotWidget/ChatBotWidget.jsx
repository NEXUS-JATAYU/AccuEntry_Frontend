import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';
import { getBackendApiBaseUrl } from '../../config/apiBase';

const MOCK_START_MESSAGE = {
    id: 'welcome',
    role: 'assistant',
    text: "Welcome to our account opening and onboarding process! I'm here to help you open a new account.\n\nHow would you like to proceed?",
};

export default function ChatBotWidget({ mode, onMinimize, onClose }) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([MOCK_START_MESSAGE]);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
    const [sessionEnded, setSessionEnded] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const BACKEND_URL = getBackendApiBaseUrl();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const sendMessage = async (text) => {
        if (!text.trim() || isLoading || sessionEnded) return;

        const newMessages = [...messages, { id: Date.now().toString(), role: 'user', text }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id: sessionId, user_input: text })
            });

            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    text: data.message,
                },
            ]);

            if (data.progress !== undefined) setProgress(data.progress);
            if (data.session_ended) setSessionEnded(true);

        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                { id: (Date.now() + 1).toString(), role: 'assistant', text: "Sorry, I am having trouble connecting to the server. Please check your connection." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleMaximize = () => navigate('/open-account');
    const restartChat = () => {
        setSessionId(crypto.randomUUID());
        setInput('');
        setMessages([MOCK_START_MESSAGE]);
        setIsLoading(false);
        setProgress(0);
        setSessionEnded(false);
    };

    const userMsgCount = messages.filter((m) => m.role === 'user').length;

    if (mode === 'inline') {
        return (
            <div className="animate-in bg-white border border-gray-200 rounded-xl w-full flex flex-col shadow-2xl overflow-hidden h-[420px] lg:max-w-xs relative z-30">
                {/* Header */}
                <div className="bg-nexus-navy text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                            <Icon name="chat" className="w-4 h-4 text-nexus-gold" />
                        </div>
                        <div>
                            <p className="text-sm font-bold font-display tracking-wide">AccuEntry Assistant</p>
                            <p className="text-[10px] text-nexus-gold font-sans font-medium uppercase tracking-wider">Account Opening</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={handleMaximize} className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white" title="Open full page">
                            <Icon name="maximize" className="w-4 h-4" />
                        </button>
                        <button onClick={onMinimize} className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white" title="Minimize">
                            <Icon name="minimize" className="w-4 h-4" />
                        </button>
                        <button onClick={onClose} className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white" title="Close">
                            <Icon name="close" className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Progress Bar Area */}
                <div className="bg-white border-b border-gray-200 px-4 py-2 flex flex-col gap-1.5 shrink-0">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-nexus-navy font-display">
                        <span>{progress < 100 ? 'Detail Capture' : 'Identity Verification'}</span>
                        <span className="font-sans text-gray-500">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-nexus-navy h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 flex flex-col">
                    <AnimatePresence initial={false}>
                        {messages.map((message) => {
                            const isUser = message.role === 'user';
                            return (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
                                >
                                    <div
                                        className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap rounded-2xl shadow-sm font-sans ${isUser ? 'bg-nexus-navy text-white rounded-br-sm' : 'bg-white border border-gray-100 text-nexus-navy rounded-bl-sm'}`}
                                        style={isUser ? { color: '#ffffff' } : undefined}
                                    >
                                        {message.text}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {isLoading && (
                        <div className="flex justify-start mb-3">
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-3 shadow-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {userMsgCount === 0 && (
                    <div className="px-4 pb-3 bg-gray-50 flex flex-wrap gap-2">
                        {['Checking Account', 'Savings Account', 'Credit Card'].map((label) => (
                            <button
                                key={label}
                                onClick={() => sendMessage(`I want to open a ${label}`)}
                                className="py-1.5 px-3 text-[11px] font-semibold font-sans border border-nexus-navy/20 text-nexus-navy bg-white rounded-full hover:border-nexus-gold hover:text-nexus-gold transition-colors shadow-sm"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="bg-white border-t border-gray-200 px-3 py-3 shrink-0">
                    {sessionEnded && (
                        <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-900">
                            <span>Your session ended because of inactivity.</span>
                            <button type="button" onClick={restartChat} className="font-semibold text-nexus-navy hover:text-nexus-gold">
                                Start new chat
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isLoading || sessionEnded}
                            className="flex-1 px-4 py-2 text-sm font-sans border border-gray-200 rounded-full bg-white text-nexus-navy focus:outline-none focus:border-nexus-navy focus:ring-2 focus:ring-nexus-gold/20 transition-all disabled:opacity-50 shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || sessionEnded || !input.trim()}
                            className="w-9 h-9 bg-nexus-navy text-white rounded-full flex items-center justify-center transition-colors hover:bg-nexus-gold disabled:opacity-50 shadow-md shrink-0"
                            aria-label="Send message"
                        >
                            <Icon name="send" className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Floating mode
    return (
        <div className="fixed bottom-20 right-4 sm:right-6 animate-in bg-white shadow-2xl border border-gray-200 rounded-xl flex flex-col overflow-hidden w-[340px] sm:w-[370px] max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100vh-120px)] z-50">
            {/* Header */}
            <div className="bg-nexus-navy text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                        <Icon name="chat" className="w-4.5 h-4.5 text-nexus-gold" />
                    </div>
                    <div>
                        <p className="text-[15px] font-bold font-display tracking-wide">AccuEntry Assistant</p>
                        <p className="text-[11px] text-nexus-gold font-sans font-medium uppercase tracking-wider mt-0.5">Account Opening</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={handleMaximize} className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white" title="Open full page">
                        <Icon name="maximize" className="w-4 h-4" />
                    </button>
                    <button onClick={onMinimize} className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white" title="Minimize">
                        <Icon name="minimize" className="w-4 h-4" />
                    </button>
                    <button onClick={onClose} className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white" title="Close">
                        <Icon name="close" className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Progress Bar Area */}
            <div className="bg-white border-b border-gray-200 px-5 py-3 flex flex-col gap-1.5 shrink-0">
                <div className="flex justify-between items-center text-xs font-semibold text-nexus-navy font-display tracking-wide">
                    <span>{progress < 100 ? 'Detail Capture' : 'Identity Verification'}</span>
                    <span className="font-sans text-gray-500">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-nexus-navy h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50 flex flex-col">
                <AnimatePresence initial={false}>
                    {messages.map((message) => {
                        const isUser = message.role === 'user';
                        return (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap rounded-2xl shadow-sm font-sans ${isUser ? 'bg-nexus-navy text-white rounded-br-sm' : 'bg-white border border-gray-100 text-nexus-navy rounded-bl-sm'}`}
                                    style={isUser ? { color: '#ffffff' } : undefined}
                                >
                                    {message.text}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3.5 shadow-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {userMsgCount === 0 && (
                <div className="px-5 pb-4 bg-gray-50 flex flex-wrap gap-2.5">
                    {['Checking Account', 'Savings Account', 'Credit Card'].map((label) => (
                        <button
                            key={label}
                            onClick={() => sendMessage(`I want to open a ${label}`)}
                            className="py-1.5 px-3.5 text-xs font-semibold font-sans border border-nexus-navy/20 text-nexus-navy bg-white rounded-full hover:border-nexus-gold hover:text-nexus-gold transition-colors shadow-sm"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="bg-white border-t border-gray-200 px-4 py-3.5 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {sessionEnded && (
                    <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-900">
                        <span>Your session ended because of inactivity.</span>
                        <button type="button" onClick={restartChat} className="font-semibold text-nexus-navy hover:text-nexus-gold">
                            Start new chat
                        </button>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex gap-2.5">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading || sessionEnded}
                        className="flex-1 px-4 py-2.5 text-sm font-sans border border-gray-200 rounded-full bg-white text-nexus-navy focus:outline-none focus:border-nexus-navy focus:ring-2 focus:ring-nexus-gold/20 transition-all disabled:opacity-50 shadow-sm"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || sessionEnded || !input.trim()}
                        className="w-10 h-10 bg-nexus-navy text-white rounded-full flex items-center justify-center transition-colors hover:bg-nexus-gold disabled:opacity-50 shadow-md shrink-0"
                        aria-label="Send message"
                    >
                        <Icon name="send" className="w-4.5 h-4.5 ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
