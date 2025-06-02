import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 1.5,
    variant = "default",
    ...props
}) {
    const IconComponent = LucideIcons[name];
    const baseStyles = "transition-all duration-200";
    
    // Variant styles
    const variantStyles = {
        default: "",
        solid: "p-2 rounded-lg bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--primary-hover)]",
        outline: "p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface)]",
        ghost: "p-2 rounded-lg hover:bg-[var(--surface)]"
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

    if (!IconComponent) {
        return (
            <HelpCircle
                size={size}
                color="var(--text-secondary)"
                strokeWidth={strokeWidth}
                className={combinedClassName}
                {...props}
            />
        );
    }

    return (
        <IconComponent
            size={size}
            color={color}
            strokeWidth={strokeWidth}
            className={combinedClassName}
            {...props}
        />
    );
}

export default Icon;