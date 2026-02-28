import QuickLinkItem from '../common/QuickLinkItem';
import Icon from '../common/Icon';

const links = [
    { icon: <Icon name="credit-card" />, label: 'Credit Cards' },
    { icon: <Icon name="checking" />, label: 'Checking Accounts' },
    { icon: <Icon name="mortgage" />, label: 'Mortgage' },
    { icon: <Icon name="personal-loans" />, label: 'Personal Loans' },
    { icon: <Icon name="investing" />, label: 'Investing Options' },
    { icon: <Icon name="small-business" />, label: 'Small Business' },
];

export default function QuickLinks() {
    return (
        <section className="bg-white border-b border-gray-200 shadow-sm relative z-20">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-start md:justify-center gap-4 md:gap-6 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {links.map((link) => (
                        <QuickLinkItem key={link.label} icon={link.icon} label={link.label} />
                    ))}
                </div>
            </div>
        </section>
    );
}
