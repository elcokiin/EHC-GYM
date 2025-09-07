import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Input } from './input';

interface PasswordInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
}

const PasswordInput = React.forwardRef<any, PasswordInputProps>(
    ({ value, onChangeText, placeholder = "••••••••", label, error, disabled = false, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <Input
                ref={ref}
                label={label}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                error={error}
                disabled={disabled}
                rightIcon={
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                        disabled={disabled}
                    >
                        {showPassword ? (
                            <EyeOff
                                size={20}
                                color={disabled ? '#9CA3AF' : '#6B7280'}
                            />
                        ) : (
                            <Eye
                                size={20}
                                color={disabled ? '#9CA3AF' : '#6B7280'}
                            />
                        )}
                    </TouchableOpacity>
                }
                {...props}
            />
        );
    }
);

PasswordInput.displayName = 'PasswordInput';

const styles = StyleSheet.create({
    eyeButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export { PasswordInput };
export default PasswordInput;
