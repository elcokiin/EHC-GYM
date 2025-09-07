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
        const getDashedStyle = () => {
            if (variant !== 'dashed') return {};

            if (orientation === 'horizontal') {
                return {
                    backgroundColor: 'transparent',
                    borderStyle: 'dashed' as const,
                    borderColor: '#E5E5E5',
                    borderBottomWidth: 1,
                };
            } else {
                return {
                    backgroundColor: 'transparent',
                    borderStyle: 'dashed' as const,
                    borderColor: '#E5E5E5',
                    borderLeftWidth: 1,
                };
            }
        };

        const separatorStyles = [
            styles.base,
            styles[orientation],
            variant === 'default' ? styles.default : getDashedStyle(),
            style,
        ];

        return (
            <View
                ref={ref}
                style={separatorStyles}
                accessibilityElementsHidden={decorative}
                importantForAccessibility={decorative ? 'no-hide-descendants' : 'auto'}
                accessible={!decorative}
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
});

export { Separator };
export default Separator;
