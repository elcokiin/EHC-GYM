import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text } from './text';

interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
}

export const PhoneInput = React.forwardRef<any, PhoneInputProps>(
    ({
        value,
        onChangeText,
        placeholder = "3197293579",
        label,
        error,
        disabled = false,
        ...props
    }, ref) => {
        return (
            <View style={styles.container}>
                {label && (
                    <Text variant="small" color="secondary" style={styles.label}>
                        {label}
                    </Text>
                )}

                <View style={styles.phoneContainer}>
                    <View style={styles.countryCode}>
                        <Text style={styles.flag}>🇨🇴</Text>
                    </View>

                    <TextInput
                        ref={ref}
                        style={styles.phoneInput}
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                        editable={!disabled}
                        {...props}
                    />
                </View>

                {error && <Text variant="caption" color="destructive" style={styles.errorText}>{error}</Text>}
            </View>
        );
    }
);

PhoneInput.displayName = 'PhoneInput';

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        backgroundColor: '#FAFAFA',
        minHeight: 48,
        width: 60,
    },
    flag: {
        fontSize: 18,
    },
    phoneInput: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#0b0b09',
        minHeight: 48,
    },
    errorText: {
        marginTop: 4,
    },
});
