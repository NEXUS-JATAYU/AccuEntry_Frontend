export default function ProductCard({
    title,
    label,
    description,
    imageSrc,
    imageAlt,
    ctaText = 'Learn More',
    ctaHref = '#',
}) {
    return (
        <div className="flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl shadow-md transition-shadow">
            <div className="px-6 pt-6">
                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-3 drop-shadow-sm">
                    {label}
                </p>
                <div className="w-full h-48 bg-gray-100 rounded-md overflow-hidden ring-1 ring-border/10 shadow-inner">
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        className="w-full h-full object-cover block"
                    />
                </div>
            </div>
            <div className="flex flex-col flex-1 px-6 py-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed flex-1">{description}</p>
                <div className="mt-5">
                    <a
                        href={ctaHref}
                        className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-citi-blue rounded-md transition-colors hover:bg-citi-dark-blue shadow-sm hover:shadow-md"
                    >
                        {ctaText}
                    </a>
                </div>
            </div>
        </div>
    );
}
