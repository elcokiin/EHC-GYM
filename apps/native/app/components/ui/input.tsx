import React from 'react';
import {
    TextInput as RNTextInput,
    View,
    Text,
    StyleSheet,
    Platform,
    TextInputProps as RNTextInputProps,
    ViewStyle,
    TextStyle,
} from 'react-native';

export type InputSize = 'default' | 'sm' | 'lg';
export type InputVariant = 'default' | 'destructive';

interface InputProps extends RNTextInputProps {
    label?: string;
    error?: string;
    helper?: string;
    size?: InputSize;
    variant?: InputVariant;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    disabled?: boolean;
    required?: boolean;
}

const Input = React.forwardRef<RNTextInput, InputProps>(
    (
        {
            label,
            error,
            helper,
            size = 'default',
            variant = 'default',
            leftIcon,
            rightIcon,
            disabled = false,
            required = false,
            style,
            ...props
        },
        ref
    ) => {
        const getInputStyle = (): TextStyle => {
            const baseStyle: any = { ...styles.base };

            // Add size styles
            if (size === 'sm') {
                Object.assign(baseStyle, styles.size_sm);
            } else if (size === 'lg') {
                Object.assign(baseStyle, styles.size_lg);
            } else {
                Object.assign(baseStyle, styles.size_default);
            }

            // Add variant styles
            if (variant === 'destructive') {
                Object.assign(baseStyle, styles.destructive);
            }

            // Add conditional styles
            if (leftIcon) {
                baseStyle.paddingLeft = 48;
            }
            if (rightIcon) {
                baseStyle.paddingRight = 48;
            }
            if (disabled) {
                Object.assign(baseStyle, styles.disabled);
            }
            if (error) {
                Object.assign(baseStyle, styles.error);
            }

            return baseStyle;
        };

        return (
            <View style={styles.container}>
                {label && (
                    <Text style={styles.label}>
                        {label}
                        {required && <Text style={styles.required}> *</Text>}
                    </Text>
                )}

                <View style={styles.inputContainer}>
                    {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

                    <RNTextInput
                        ref={ref}
                        style={[getInputStyle(), style]}
                        editable={!disabled}
                        placeholderTextColor="#9CA3AF"
                        {...props}
                    />

                    {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}
                {helper && !error && <Text style={styles.helperText}>{helper}</Text>}
            </View>
        );
    }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },

    inputContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },

    base: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#0b0b09',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },

    // Sizes
    size_default: {
        paddingVertical: 14,
        minHeight: 48,
    },
    size_sm: {
        paddingVertical: 8,
        minHeight: 36,
        fontSize: 14,
    },
    size_lg: {
        paddingVertical: 16,
        minHeight: 56,
        fontSize: 18,
    },

    // Variants
    default: {
        borderColor: '#E5E5E5',
    },
    destructive: {
        borderColor: '#EF4444',
    },

    // States
    disabled: {
        backgroundColor: '#F3F4F6',
        color: '#9CA3AF',
        opacity: 0.6,
    },

    error: {
        borderColor: '#EF4444',
    },

    // Icon spacing
    paddingLeft: {
        paddingLeft: 48,
    },
    paddingRight: {
        paddingRight: 48,
    },

    leftIcon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },

    rightIcon: {
        position: 'absolute',
        right: 12,
        zIndex: 1,
    },

    // Text styles
    label: {
        fontSize: 20,
        fontWeight: '500',
        color: '#666',
        marginBottom: 8,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },

    required: {
        color: '#EF4444',
    },

    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },

    helperText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
});

export { Input };
export default Input;
