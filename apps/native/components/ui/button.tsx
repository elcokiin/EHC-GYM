import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
    Platform,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps,
    View,
    Animated,
} from 'react-native';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'warning';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'xs';

interface ButtonProps extends TouchableOpacityProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    rounded?: boolean;
    shadow?: boolean;
}

const Button = React.forwardRef<View, ButtonProps>(
    (
        {
            variant = 'default',
            size = 'default',
            children,
            loading = false,
            disabled = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            rounded = true,
            shadow = false,
            style,
            ...props
        },
        ref
    ) => {
        const scaleAnim = React.useRef(new Animated.Value(1)).current;

        const handlePressIn = () => {
            Animated.spring(scaleAnim, {
                toValue: 0.96,
                useNativeDriver: true,
                speed: 50,
                bounciness: 4,
            }).start();
        };

        const handlePressOut = () => {
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                speed: 50,
                bounciness: 4,
            }).start();
        };

        const getButtonStyle = (): ViewStyle => {
            const base = { ...styles.base } as ViewStyle;
            const variantStyle = styles[variant] as ViewStyle;
            const sizeStyle = styles[`size_${size}` as keyof typeof styles] as ViewStyle;

            return {
                ...base,
                ...(variantStyle || {}),
                ...(variant === 'default' ? { backgroundColor: '#FFAF00' } : {}),
                ...(sizeStyle || {}),
                ...(fullWidth ? styles.fullWidth : {}),
                ...(rounded ? styles.rounded : {}),
                ...(!shadow ? { shadowOpacity: 0, elevation: 0 } : {}),
                ...(disabled ? styles.disabled : {}),
            };
        };

        const getTextStyle = (): TextStyle => {
            const base = { ...styles.text };
            const variantTextStyle = styles[`text_${variant}` as keyof typeof styles] as TextStyle;
            const sizeTextStyle = styles[`textSize_${size}` as keyof typeof styles] as TextStyle;

            return {
                ...base,
                ...(variantTextStyle || {}),
                ...(sizeTextStyle || {}),
                ...(disabled ? styles.textDisabled : {}),
            };
        };

        const getIconSpacing = () => {
            const spacing = size === 'xs' ? 6 : size === 'sm' ? 8 : size === 'lg' ? 12 : 10;
            return spacing;
        };

        const renderContent = () => (
            <>
                {leftIcon && !loading && (
                    <View style={{ marginRight: getIconSpacing() }}>
                        {leftIcon}
                    </View>
                )}
                {loading ? (
                    <ActivityIndicator
                        size={size === 'xs' || size === 'sm' ? 'small' : 'small'}
                        color={
                            variant === 'default' ||
                                variant === 'destructive' ||
                                variant === 'success' ||
                                variant === 'warning'
                                ? '#ffffff'
                                : variant === 'outline' || variant === 'ghost'
                                    ? '#374151'
                                    : '#6B7280'
                        }
                    />
                ) : (
                    <Text style={getTextStyle()} numberOfLines={1}>
                        {children}
                    </Text>
                )}
                {rightIcon && !loading && (
                    <View style={{ marginLeft: getIconSpacing() }}>
                        {rightIcon}
                    </View>
                )}
            </>
        );

        return (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                    ref={ref}
                    disabled={disabled || loading}
                    style={[getButtonStyle(), style]}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    {...props}
                >
                    {renderContent()}
                </TouchableOpacity>
            </Animated.View>
        );
    }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },

    // Variants
    default: {
        backgroundColor: '#FFAF00',
    },
    destructive: {
        backgroundColor: '#EF4444',
    },
    success: {
        backgroundColor: '#10B981',
    },
    warning: {
        backgroundColor: '#F59E0B',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    secondary: {
        backgroundColor: '#F3F4F6',
    },
    ghost: {
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
    },
    link: {
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
    },

    // Sizes
    size_xs: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        minHeight: 28,
    },
    size_sm: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 36,
    },
    size_default: {
        paddingHorizontal: 40,
        paddingVertical: 16,
        minHeight: 60,
        borderRadius: 10,
    },
    size_lg: {
        paddingHorizontal: 40,
        paddingVertical: 20,
        minHeight: 64,
        borderRadius: 10,
    },
    size_icon: {
        width: 48,
        height: 48,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },

    // States
    disabled: {
        opacity: 0.6,
    },

    fullWidth: {
        width: '100%',
    },

    rounded: {
        borderRadius: 24,
    },

    // Text styles
    text: {
        fontWeight: '600' as TextStyle['fontWeight'],
        textAlign: 'center' as const,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        letterSpacing: 0.3,
    },

    // Text variants
    text_default: {
        color: '#ffffff',
    },
    text_destructive: {
        color: '#ffffff',
    },
    text_success: {
        color: '#ffffff',
    },
    text_warning: {
        color: '#ffffff',
    },
    text_outline: {
        color: '#27272A',
        fontSize: 20,
        fontWeight: '500' as TextStyle['fontWeight'],
    },
    text_secondary: {
        color: '#6B7280',
    },
    text_ghost: {
        color: '#374151',
    },
    text_link: {
        color: '#3B82F6',
        textDecorationLine: 'underline' as const,
    },

    // Text sizes
    textSize_xs: {
        fontSize: 12,
        fontWeight: '500' as TextStyle['fontWeight'],
    },
    textSize_sm: {
        fontSize: 14,
        fontWeight: '500' as TextStyle['fontWeight'],
    },
    textSize_default: {
        fontSize: 20,
        fontWeight: '700' as TextStyle['fontWeight'],
    },
    textSize_lg: {
        fontSize: 24,
        fontWeight: '700' as TextStyle['fontWeight'],
    },
    textSize_icon: {
        fontSize: 16,
    },

    textDisabled: {
        opacity: 0.7,
    },
});

export { Button };
export default Button;