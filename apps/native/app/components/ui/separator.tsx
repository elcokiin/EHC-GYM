import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

export type SeparatorOrientation = 'horizontal' | 'vertical';
export type SeparatorVariant = 'default' | 'dashed';

interface SeparatorProps extends ViewProps {
    orientation?: SeparatorOrientation;
    variant?: SeparatorVariant;
    decorative?: boolean;
}

const Separator = React.forwardRef<View, SeparatorProps>(
    ({ orientation = 'horizontal', variant = 'default', decorative = true, style, ...props }, ref) => {
        const separatorStyles = [
            styles.base,
            styles[orientation],
            styles[variant],
            style,
        ];

        return (
            <View
                ref={ref}
                style={separatorStyles}
                {...(decorative ? { 'aria-hidden': true } : {})}
                {...props}
            />
        );
    }
);

Separator.displayName = 'Separator';

const styles = StyleSheet.create({
    base: {
        backgroundColor: '#E5E5E5',
    },

    // Orientations
    horizontal: {
        height: 1,
        width: '100%',
    },
    vertical: {
        width: 1,
        height: '100%',
    },

    // Variants
    default: {
        backgroundColor: '#E5E5E5',
    },
    dashed: {
        backgroundColor: 'transparent',
        borderStyle: 'dashed',
        borderColor: '#E5E5E5',
        borderTopWidth: 1,
    },
});

export { Separator };
