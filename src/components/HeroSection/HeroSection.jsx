import LoginForm from '../LoginForm/LoginForm';
import Button from '../common/Button';
import ChatBotWidget from '../ChatBotWidget/ChatBotWidget';

export default function HeroSection({ chatState, onMinimize, onClose }) {
    return (
        <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden shadow-inner">
            {/* Decorative wave at bottom */}
            <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
                    <path d="M0,30 Q360,60 720,30 Q1080,0 1440,30 L1440,60 L0,60 Z" fill="white" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 relative z-10">
                <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-12">
                    {/* Left: Text + Cards */}
                    <div className="flex-1 flex flex-col sm:flex-row gap-6 lg:gap-10 items-start w-full">
                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3 drop-shadow-sm">
                                Citi® Credit Cards
                            </p>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5 drop-shadow-sm text-balance">
                                Choose the right Citi® credit card for you
                            </h1>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                                Whether you want Cash Back, a Low Intro Rate, Rewards for Costco Members, or Great Airline Miles, the choice is all yours.
                            </p>
                            <Button href="#" size="lg" className="shadow-md hover:shadow-lg rounded-full px-8 py-3.5">
                                Learn More
                            </Button>
                        </div>

                        {/* Card Images */}
                        <div className="grid grid-cols-2 gap-3 w-full max-w-[260px] sm:max-w-[240px] shrink-0">
                            <div className="bg-gradient-to-br from-citi-blue to-blue-700 rounded-xl h-24 sm:h-28 flex items-center justify-center text-white text-xs font-semibold shadow-lg transition-transform hover:-translate-y-1 cursor-pointer">
                                <div className="text-center drop-shadow-md">
                                    <div className="text-lg sm:text-xl font-bold">citi</div>
                                    <div className="text-[10px] opacity-90 tracking-wider">Double Cash</div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl h-24 sm:h-28 flex items-center justify-center text-white text-xs font-semibold shadow-lg transition-transform hover:-translate-y-1 cursor-pointer">
                                <div className="text-center drop-shadow-md">
                                    <div className="text-lg sm:text-xl font-bold">citi</div>
                                    <div className="text-[10px] opacity-90 tracking-wider">Premier</div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-citi-dark-blue to-blue-900 rounded-xl h-24 sm:h-28 flex items-center justify-center text-white text-xs font-semibold shadow-lg transition-transform hover:-translate-y-1 cursor-pointer">
                                <div className="text-center drop-shadow-md">
                                    <div className="text-lg sm:text-xl font-bold">citi</div>
                                    <div className="text-[10px] opacity-90 tracking-wider">Custom Cash</div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl h-24 sm:h-28 flex items-center justify-center text-white text-xs font-semibold shadow-lg transition-transform hover:-translate-y-1 cursor-pointer">
                                <div className="text-center drop-shadow-md">
                                    <div className="text-lg sm:text-xl font-bold">citi</div>
                                    <div className="text-[10px] opacity-90 tracking-wider">AAdvantage</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Login Form or Inline Chatbot */}
                    <div className="w-full lg:w-auto shrink-0 z-20">
                        {chatState === 'inline' ? (
                            <ChatBotWidget
                                mode="inline"
                                onMinimize={onMinimize}
                                onClose={onClose}
                            />
                        ) : (
                            <LoginForm />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
