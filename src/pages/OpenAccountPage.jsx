import { Link } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow/ChatWindow';
import Icon from '../components/common/Icon';

export default function OpenAccountPage() {
    return (
        <div className="h-screen bg-[#F8F9FA] flex flex-col font-sans overflow-hidden">
            {/* Premium Header */}
            <header className="bg-nexus-navy text-white shadow-md relative z-20 shrink-0">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
                    <div className="flex items-center gap-4 h-full">
                        <Link to="/" className="text-2xl font-serif font-bold text-nexus-gold tracking-wide hover:opacity-80 transition-opacity">
                            AccuEntry
                        </Link>
                        <div className="hidden sm:block h-6 w-px bg-white/20" />
                        <div className="hidden sm:block">
                            <h1 className="text-sm font-semibold m-0 text-white tracking-wide">Precision Onboarding</h1>
                            <p className="text-xs m-0 text-white/60">Secure AI Verification</p>
                        </div>
                    </div>
                    <Link
                        to="/"
                        className="text-sm flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                    >
                        <Icon name="chevron-left" className="w-4 h-4" />
                        <span className="hidden sm:inline font-medium tracking-wide">Exit Session</span>
                    </Link>
                </div>
            </header>

            {/* Chat Area Container */}
            <div className="flex-1 w-full max-w-5xl mx-auto bg-white shadow-2xl flex flex-col overflow-hidden relative z-10 border-x border-gray-200">
                <ChatWindow />
            </div>
        </div>
    );
}
