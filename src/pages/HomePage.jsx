import { useState } from 'react';
import Header from '../components/Header/Header';
import HeroSection from '../components/HeroSection/HeroSection';
import QuickLinks from '../components/QuickLinks/QuickLinks';
import ProductCard from '../components/ProductCard/ProductCard';
import Footer from '../components/Footer/Footer';
import ChatBotWidget from '../components/ChatBotWidget/ChatBotWidget';
import Icon from '../components/common/Icon';

const products = [
    {
        label: 'Nexus® Checking Accounts',
        title: 'Simplified Banking',
        description:
            'Nexus mobile banking allows you to manage your money and pay friends – all while on-the-go. Member FDIC.',
        imageSrc: '/images/checking.jpg',
        imageAlt: 'People enjoying a day out together - checking accounts',
    },
    {
        label: 'Nexus® Savings Accounts',
        title: 'Save More, Earn More',
        description:
            'At Nexus, start saving with ease and grow with confidence. Member FDIC.',
        imageSrc: '/images/savings.jpg',
        imageAlt: 'Friends jumping on a beach - savings accounts',
    },
    {
        label: 'Nexus® / Advantage® Credit Cards',
        title: 'Explore Nexus® / AAdvantage® cards',
        description:
            'Travel to over 1,000 destinations worldwide with Advantage® bonus miles. Plus, redeem miles for Business and First Class upgrades, car rentals, hotel stays and more.',
        imageSrc: '/images/credit-cards.jpg',
        imageAlt: 'Collection of Nexus credit cards - Advantage cards',
    },
];

export default function HomePage() {
    const [chatState, setChatState] = useState('idle');

    const handleOpenAccount = () => {
        setChatState('inline');
    };

    const handleMinimize = () => {
        setChatState('minimized');
    };

    const handleClose = () => {
        setChatState('minimized');
    };

    const handleBubbleClick = () => {
        setChatState('floating');
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Header onOpenAccount={handleOpenAccount} />
            <HeroSection
                chatState={chatState}
                onMinimize={handleMinimize}
                onClose={handleClose}
            />
            <QuickLinks />

            {/* Products Section */}
            <section className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.title} {...product} />
                    ))}
                </div>
            </section>

            <Footer />

            {/* Floating bubble when minimized */}
            {chatState === 'minimized' && (
                <button
                    onClick={handleBubbleClick}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-citi-blue text-white flex items-center justify-center shadow-lg hover:bg-citi-dark-blue transition-all cursor-pointer"
                    aria-label="Open chat assistant"
                    style={{ width: '3.5rem', height: '3.5rem', bottom: '1.5rem', right: '1.5rem' }}
                >
                    <Icon name="chat" className="w-6 h-6" />
                </button>
            )}

            {/* Floating chat panel - appears when clicking the bubble */}
            {chatState === 'floating' && (
                <ChatBotWidget
                    mode="floating"
                    onMinimize={handleMinimize}
                    onClose={handleClose}
                />
            )}
        </main>
    );
}
