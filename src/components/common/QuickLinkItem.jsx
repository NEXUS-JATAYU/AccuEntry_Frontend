export default function QuickLinkItem({ icon, label, href = '#' }) {
    return (
        <a
            href={href}
            className="flex flex-col items-center gap-2 px-3 sm:px-4 py-3 sm:py-4 hover:bg-gray-50 rounded-lg transition-colors group min-w-[80px] shrink-0"
        >
            <span className="text-citi-blue text-2xl group-hover:scale-110 transition-transform flex items-center justify-center">
                {icon}
            </span>
            <span className="text-xs sm:text-sm font-medium text-gray-700 text-center whitespace-nowrap">{label}</span>
        </a>
    );
}
