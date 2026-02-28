export default function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    href,
    children,
    ...rest
}) {
    const variantStyles = {
        primary:
            'bg-citi-blue text-white hover:bg-citi-dark-blue',
        outline:
            'border-2 border-citi-blue text-citi-blue hover:bg-citi-light-blue',
        text: 'text-citi-blue hover:underline',
    };

    const sizeStyles = {
        sm: 'px-4 py-1.5 text-sm',
        md: 'px-6 py-2.5 text-sm',
        lg: 'px-8 py-3 text-base',
    };

    const baseClass =
        'inline-flex items-center justify-center font-semibold rounded-md transition-colors cursor-pointer';
    const classes = `${baseClass} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    if (href) {
        return (
            <a href={href} className={classes} {...rest}>
                {children}
            </a>
        );
    }

    return (
        <button className={classes} {...rest}>
            {children}
        </button>
    );
}
