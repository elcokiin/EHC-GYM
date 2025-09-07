import React from 'react';
import { View, StyleSheet, ViewProps, Dimensions } from 'react-native';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ContainerProps extends ViewProps {
    size?: ContainerSize;
    centered?: boolean;
    children: React.ReactNode;
}

const Container = React.forwardRef<View, ContainerProps>(
    ({ size = 'full', centered = false, children, style, ...props }, ref) => {
        const containerStyles = [
            styles.base,
            styles[`size_${size}`],
            centered && styles.centered,
            style,
        ];

        return (
            <View ref={ref} style={containerStyles} {...props}>
                {children}
            </View>
        );
    }
);

Container.displayName = 'Container';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
    base: {
        width: '100%',
        paddingHorizontal: 16,
    },

    centered: {
        alignSelf: 'center',
    },

    // Sizes
    size_sm: {
        maxWidth: Math.min(screenWidth * 0.8, 640),
    },
    size_md: {
        maxWidth: Math.min(screenWidth * 0.9, 768),
    },
    size_lg: {
        maxWidth: Math.min(screenWidth * 0.95, 1024),
    },
    size_xl: {
        maxWidth: Math.min(screenWidth, 1280),
    },
    size_full: {
        maxWidth: '100%',
    },
});

export { Container };
