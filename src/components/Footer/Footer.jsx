export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-12 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-wrap">
                        <span className="text-xl font-bold text-citi-blue shrink-0">citi</span>
                        <span className="text-xs text-gray-500 leading-relaxed max-w-2xl">
                            {'© 2026 Citigroup Inc. Citi, Citi and Arc Design and other marks used herein are service marks of Citigroup Inc. or its affiliates, used and registered throughout the world.'}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 shrink-0">
                        <a href="#" className="hover:text-citi-blue transition-colors">Privacy</a>
                        <a href="#" className="hover:text-citi-blue transition-colors">Terms of Use</a>
                        <a href="#" className="hover:text-citi-blue transition-colors">AdChoices</a>
                        <a href="#" className="hover:text-citi-blue transition-colors">Security</a>
                    </div>
                </div>
                <div className="mt-4 text-xs text-gray-500 text-center sm:text-left leading-relaxed">
                    Banking products and services are offered by Citibank, N.A. Member FDIC. Equal Housing Lender. NMLS# 412915.
                </div>
            </div>
        </footer>
    );
}
