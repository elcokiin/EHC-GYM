import React, { useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Platform,
    TextInputProps,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
} from 'react-native';

interface CodeInputProps {
    value: string;
    onChangeText: (text: string) => void;
    length?: number;
    disabled?: boolean;
    autoFocus?: boolean;
}

const CodeInput = React.forwardRef<View, CodeInputProps>(
    ({ value, onChangeText, length = 5, disabled = false, autoFocus = false }, ref) => {
        const inputRefs = useRef<(TextInput | null)[]>([]);

        useEffect(() => {
            if (autoFocus && inputRefs.current[0]) {
                inputRefs.current[0].focus();
            }
        }, [autoFocus]);

        const handleChangeText = (text: string, index: number) => {
            const newValue = value.split('');
            newValue[index] = text;

            // Fill the array to the correct length
            while (newValue.length < length) {
                newValue.push('');
            }

            const finalValue = newValue.join('').slice(0, length);
            onChangeText(finalValue);

            // Auto-focus next input
            if (text && index < length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        };

        const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
            if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        };

        return (
            <View ref={ref} style={styles.container}>
                {Array.from({ length }, (_, index) => (
                    <TextInput
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        style={[
                            styles.input,
                            disabled && styles.disabled,
                            value[index] && styles.filled
                        ]}
                        value={value[index] || ''}
                        onChangeText={(text) => handleChangeText(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        maxLength={1}
                        keyboardType="number-pad"
                        textAlign="center"
                        editable={!disabled}
                        selectTextOnFocus={true}
                        blurOnSubmit={false}
                        autoComplete="sms-otp"
                        textContentType="oneTimeCode"
                    />
                ))}
            </View>
        );
    }
);

CodeInput.displayName = 'CodeInput';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    input: {
        flex: 1,
        height: 60,
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        fontSize: 24,
        fontWeight: '600',
        color: '#0b0b09',
        textAlign: 'center',
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
    filled: {
        borderColor: '#FFAF00',
        backgroundColor: '#FFF9E6',
    },
    disabled: {
        backgroundColor: '#F3F4F6',
        color: '#9CA3AF',
        opacity: 0.6,
    },
});

export { CodeInput };
export default CodeInput;
