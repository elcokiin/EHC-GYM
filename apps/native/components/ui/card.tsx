import React from 'react';
import { View, StyleSheet, ViewProps, StyleProp, ViewStyle } from 'react-native';

export type CardVariant = 'default' | 'outline' | 'ghost';
export type CardSize = 'default' | 'sm' | 'lg';

interface CardProps extends ViewProps {
    variant?: CardVariant;
    size?: CardSize;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

const Card = React.forwardRef<View, CardProps>(
    ({ variant = 'default', size = 'default', children, style, ...props }, ref) => {
        const cardStyle: StyleProp<ViewStyle> = [
            styles.base,
            styles[variant],
            styles[`size_${size}`],
            style
        ];

        return (
            <View ref={ref} style={cardStyle} {...props}>
                {children}
            </View>
        );
    }
);

Card.displayName = 'Card';

interface CardHeaderProps extends ViewProps {
    children: React.ReactNode;
}

const CardHeader = React.forwardRef<View, CardHeaderProps>(
    ({ children, style, ...props }, ref) => {
        return (
            <View ref={ref} style={[styles.header, style]} {...props}>
                {children}
            </View>
        );
    }
);

CardHeader.displayName = 'CardHeader';

interface CardContentProps extends ViewProps {
    children: React.ReactNode;
}

const CardContent = React.forwardRef<View, CardContentProps>(
    ({ children, style, ...props }, ref) => {
        return (
            <View ref={ref} style={[styles.content, style]} {...props}>
                {children}
            </View>
        );
    }
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends ViewProps {
    children: React.ReactNode;
}

const CardFooter = React.forwardRef<View, CardFooterProps>(
    ({ children, style, ...props }, ref) => {
        return (
            <View ref={ref} style={[styles.footer, style]} {...props}>
                {children}
            </View>
        );
    }
);

CardFooter.displayName = 'CardFooter';

const styles = StyleSheet.create({
    base: {
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },

    // Variants
    default: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        shadowOpacity: 0,
        elevation: 0,
    },
    ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
    },

    // Sizes
    size_default: {
        padding: 16,
    },
    size_sm: {
        padding: 12,
    },
    size_lg: {
        padding: 24,
    },

    // Components
    header: {
        paddingBottom: 16,
    },
    content: {
        paddingVertical: 4,
    },
    footer: {
        paddingTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

export { Card, CardHeader, CardContent, CardFooter };
export default Card;
