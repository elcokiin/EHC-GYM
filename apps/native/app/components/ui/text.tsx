import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, Platform } from 'react-native';

// Typography variants following shadcn-like structure
export type TextVariant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'p'
    | 'blockquote'
    | 'table'
    | 'list'
    | 'lead'
    | 'large'
    | 'small'
    | 'muted'
    | 'caption';

export type TextColor =
    | 'primary'
    | 'secondary'
    | 'muted'
    | 'accent'
    | 'destructive'
    | 'warning'
    | 'success'
    | 'white'
    | 'black';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

interface TextProps extends RNTextProps {
    variant?: TextVariant;
    color?: TextColor;
    align?: TextAlign;
    weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
    children: React.ReactNode;
}

const Text = React.forwardRef<RNText, TextProps>(
    ({ variant = 'p', color = 'primary', align = 'left', weight, style, children, ...props }, ref) => {
        const textStyles = [
            styles.base,
            styles[variant],
            styles[`color_${color}`],
            styles[`align_${align}`],
            weight && styles[`weight_${weight}`],
            style,
        ];

        return (
            <RNText ref={ref} style={textStyles} {...props}>
                {children}
            </RNText>
        );
    }
);

Text.displayName = 'Text';

const styles = StyleSheet.create({
    base: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        color: '#0b0b09',
    },

    // Variants
    h1: {
        fontSize: 32,
        lineHeight: 40,
        fontWeight: '800',
        letterSpacing: -1,
    },
    h2: {
        fontSize: 28,
        lineHeight: 36,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    h3: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '600',
    },
    h4: {
        fontSize: 20,
        lineHeight: 28,
        fontWeight: '600',
    },
    p: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
    },
    blockquote: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
        fontStyle: 'italic',
        borderLeftWidth: 4,
        borderLeftColor: '#E5E5E5',
        paddingLeft: 16,
    },
    table: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
    },
    list: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
    },
    lead: {
        fontSize: 20,
        lineHeight: 28,
        fontWeight: '400',
        color: '#6B7280',
    },
    large: {
        fontSize: 18,
        lineHeight: 28,
        fontWeight: '600',
    },
    small: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
    },
    muted: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
        color: '#6B7280',
    },
    caption: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400',
        color: '#9CA3AF',
    },

    // Colors
    color_primary: {
        color: '#0b0b09',
    },
    color_secondary: {
        color: '#6B7280',
    },
    color_muted: {
        color: '#9CA3AF',
    },
    color_accent: {
        color: '#FF9500',
    },
    color_destructive: {
        color: '#EF4444',
    },
    color_warning: {
        color: '#F59E0B',
    },
    color_success: {
        color: '#10B981',
    },
    color_white: {
        color: '#FFFFFF',
    },
    color_black: {
        color: '#000000',
    },

    // Alignment
    align_left: {
        textAlign: 'left',
    },
    align_center: {
        textAlign: 'center',
    },
    align_right: {
        textAlign: 'right',
    },
    align_justify: {
        textAlign: 'justify',
    },

    // Weights
    weight_normal: {
        fontWeight: '400',
    },
    weight_medium: {
        fontWeight: '500',
    },
    weight_semibold: {
        fontWeight: '600',
    },
    weight_bold: {
        fontWeight: '700',
    },
    weight_black: {
        fontWeight: '900',
    },
});

export { Text };
