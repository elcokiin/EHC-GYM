import React from 'react';
import { TouchableOpacity, TextInput } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { Input } from './input';

interface DateInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
}

const DateInput = React.forwardRef<TextInput, DateInputProps>(
    ({ value, onChangeText, placeholder = "DD/MM/YYYY", label, error, disabled = false, ...props }, ref) => {
        return (
            <Input
                ref={ref}
                label={label}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                error={error}
                disabled={disabled}
                rightIcon={
                    <TouchableOpacity disabled={disabled}>
                        <Calendar
                            size={20}
                            color={disabled ? '#9CA3AF' : '#6B7280'}
                        />
                    </TouchableOpacity>
                }
                {...props}
            />
        );
    }
);

DateInput.displayName = 'DateInput';

export { DateInput };
export default DateInput;
