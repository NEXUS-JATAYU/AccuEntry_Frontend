import { useState, useRef, useEffect } from 'react';

const MOCK_START_MESSAGE = {
    id: 'welcome',
    role: 'assistant',
    text: "Welcome to Citi! I'm here to help you open a new account. Whether you're interested in a Checking Account, Savings Account, or Credit Card, I'll guide you through the process step by step.\n\nWhat type of account would you like to open today?",
};

export default function ChatWindow() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([MOCK_START_MESSAGE]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

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
            let replyMessage = "I understand. Could you please provide your full legal name (first and last)?";

            if (text.toLowerCase().includes('name is') || text.toLowerCase().includes('my name')) {
                replyMessage = "Thank you. Now, what is your date of birth?";
            } else if (text.match(/\d{2}\/\d{2}\/\d{4}/)) {
                replyMessage = "Great! What is your best contact email address?";
            } else if (text.includes('@')) {
                replyMessage = "Thanks. Could you share your phone number as well?";
            } else if (text.match(/\d{3}/)) {
                replyMessage = "Awesome. We have almost everything we need to start. Please provide your mailing address.";
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    text: replyMessage,
                },
            ]);
            setIsLoading(false);
        }, 1200);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto bg-gray-50 shadow-inner">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 flex flex-col gap-6">
                {messages.map((message) => {
                    const isUser = message.role === 'user';

                    return (
                        <div
                            key={message.id}
                            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            {!isUser && (
                                <div className="w-10 h-10 rounded-full bg-citi-blue text-white flex items-center justify-center text-sm font-bold shrink-0 mr-3 mt-1 shadow-md">
                                    C
                                </div>
                            )}
                            <div
                                className={`max-w-[85%] sm:max-w-[75%] px-5 py-4 text-[15px] leading-relaxed whitespace-pre-wrap rounded-2xl shadow-sm ${isUser
                                        ? 'bg-citi-blue text-white rounded-br-sm'
                                        : 'bg-white border border-gray-100 text-gray-900 rounded-bl-sm'
                                    }`}
                            >
                                {!isUser && (
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-sm font-bold tracking-wide text-citi-blue">Citi Assistant</span>
                                    </div>
                                )}
                                {message.text}
                            </div>
                        </div>
                    );
                })}

                {messages.filter((m) => m.role === 'user').length === 0 && (
                    <div className="flex flex-wrap gap-3 pl-14">
                        <button
                            onClick={() => sendMessage('I want to open a Checking Account')}
                            className="px-5 py-2.5 text-sm font-semibold border-2 border-citi-blue text-citi-blue rounded-full hover:bg-citi-light-blue transition-colors shadow-sm bg-white"
                        >
                            Checking Account
                        </button>
                        <button
                            onClick={() => sendMessage('I want to open a Savings Account')}
                            className="px-5 py-2.5 text-sm font-semibold border-2 border-citi-blue text-citi-blue rounded-full hover:bg-citi-light-blue transition-colors shadow-sm bg-white"
                        >
                            Savings Account
                        </button>
                        <button
                            onClick={() => sendMessage('I want to apply for a Credit Card')}
                            className="px-5 py-2.5 text-sm font-semibold border-2 border-citi-blue text-citi-blue rounded-full hover:bg-citi-light-blue transition-colors shadow-sm bg-white"
                        >
                            Credit Card
                        </button>
                    </div>
                )}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="w-10 h-10 rounded-full bg-citi-blue text-white flex items-center justify-center text-sm font-bold shrink-0 mr-3 shadow-md">
                            C
                        </div>
                        <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 h-[56px]">
                            <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 px-4 sm:px-8 py-5 shrink-0 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
                <form onSubmit={handleSubmit} className="flex gap-4 w-full">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1 px-6 py-3.5 text-[15px] border-2 border-gray-200 rounded-full bg-gray-50 text-gray-900 focus:outline-none focus:border-citi-blue focus:ring-2 focus:ring-citi-blue/20 focus:bg-white transition-all disabled:opacity-50 shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-8 py-3.5 text-[15px] font-bold tracking-wide text-white bg-citi-blue rounded-full transition-colors hover:bg-citi-dark-blue disabled:opacity-50 shadow-md hover:shadow-lg active:scale-[0.98] shrink-0"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}
