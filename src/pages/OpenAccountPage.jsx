import { Link } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow/ChatWindow';
import Icon from '../components/common/Icon';

export default function OpenAccountPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Chat Header */}
            <header className="bg-citi-dark-blue text-white">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between" style={{ height: '3.5rem' }}>
                    <div className="flex items-center gap-3 sm:gap-4 h-full">
                        <Link to="/" className="text-2xl font-bold tracking-tight hover-opacity transition-opacity">
                            citi
                        </Link>
                        <div className="hidden sm:block" style={{ height: '1.5rem', width: '1px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
                        <div className="hidden sm:block">
                            <h1 className="text-sm font-semibold m-0 leading-tight">Open an Account</h1>
                            <p className="text-xs m-0" style={{ color: 'rgba(255,255,255,0.7)' }}>AI-powered account assistant</p>
                        </div>
                    </div>
                    <Link
                        to="/"
                        className="text-sm flex items-center gap-1 transition-colors"
                        style={{ color: 'rgba(255,255,255,0.8)' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                    >
                        <Icon name="chevron-left" className="w-4 h-4" />
                        <span className="hidden sm:inline">Back to Home</span>
                    </Link>
                </div>
            </header>

            {/* Progress Indicator */}
            <div className="bg-citi-light-blue border-b border-gray-200 px-4 py-3">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <div className="bg-citi-blue text-white flex items-center justify-center text-sm font-semibold shrink-0" style={{ width: '2rem', height: '2rem', borderRadius: '9999px' }}>
                        <Icon name="chat" className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-citi-dark-blue m-0 leading-tight">
                            Chat with our assistant to get started
                        </p>
                        <p className="text-xs text-gray-500 m-0">
                            Your information is secure and encrypted
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1">
                <ChatWindow />
            </div>
        </div>
    );
}
