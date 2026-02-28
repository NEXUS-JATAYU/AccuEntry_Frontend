import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';

const MOCK_START_MESSAGE = {
    id: 'welcome',
    role: 'assistant',
    text: "Welcome to our account opening and onboarding process! I'm here to help you open a new Citi account.\n\nHow would you like to proceed?",
};

export default function ChatBotWidget({ mode, onMinimize, onClose }) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([MOCK_START_MESSAGE]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const sendMessage = (text) => {
        if (!text.trim() || isLoading) return;

        const newMessages = [...messages, { id: Date.now().toString(), role: 'user', text }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    text: `Got it! You said: "${text}". Please visit the full open account page to complete this process.`,
                },
            ]);
            setIsLoading(false);
        }, 1500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleMaximize = () => navigate('/open-account');

    const userMsgCount = messages.filter((m) => m.role === 'user').length;

    if (mode === 'inline') {
        return (
            <div className="animate-in bg-white border border-gray-200 rounded-xl w-full flex flex-col shadow-2xl overflow-hidden h-[420px] lg:max-w-xs relative z-30">
                {/* Header */}
                <div className="bg-citi-dark-blue text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <Icon name="chat" className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-tight tracking-wide">Citi Assistant</p>
                            <p className="text-[10px] text-white/70 font-medium">Account Opening</p>
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

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 flex flex-col">
                    {messages.map((message) => {
                        const isUser = message.role === 'user';
                        return (
                            <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
                                <div className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap rounded-2xl shadow-sm ${isUser ? 'bg-citi-blue text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-900 rounded-bl-sm'}`}>
                                    {message.text}
                                </div>
                            </div>
                        );
                    })}

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
                                className="py-1.5 px-3 text-[11px] font-semibold border border-citi-blue text-citi-blue rounded-full hover:bg-citi-light-blue transition-colors shadow-sm"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="bg-white border-t border-gray-200 px-3 py-3 shrink-0">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 text-sm border-2 border-gray-200 rounded-full bg-white text-gray-900 focus:outline-none focus:border-citi-blue focus:ring-2 focus:ring-citi-blue/20 transition-all disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="w-9 h-9 bg-citi-blue text-white rounded-full flex items-center justify-center transition-colors hover:bg-citi-dark-blue disabled:opacity-50 shadow-md shrink-0"
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
            <div className="bg-citi-dark-blue text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                        <Icon name="chat" className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <p className="text-[15px] font-bold leading-tight tracking-wide">AccuEntry Assistant</p>
                        <p className="text-[11px] text-white/70 font-medium mt-0.5">Account Opening</p>
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50 flex flex-col">
                {messages.map((message) => {
                    const isUser = message.role === 'user';
                    return (
                        <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                            <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap rounded-2xl shadow-sm ${isUser ? 'bg-citi-blue text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-900 rounded-bl-sm'}`}>
                                {message.text}
                            </div>
                        </div>
                    );
                })}

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
                            className="py-1.5 px-3.5 text-xs font-semibold border border-citi-blue text-citi-blue rounded-full hover:bg-citi-light-blue transition-colors shadow-sm"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="bg-white border-t border-gray-200 px-4 py-3.5 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <form onSubmit={handleSubmit} className="flex gap-2.5">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 text-sm border-2 border-gray-200 rounded-full bg-gray-50 text-gray-900 focus:outline-none focus:border-citi-blue focus:ring-2 focus:ring-citi-blue/20 focus:bg-white transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="w-10 h-10 bg-citi-blue text-white rounded-full flex items-center justify-center transition-colors hover:bg-citi-dark-blue disabled:opacity-50 shadow-md shrink-0"
                        aria-label="Send message"
                    >
                        <Icon name="send" className="w-4.5 h-4.5 ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
