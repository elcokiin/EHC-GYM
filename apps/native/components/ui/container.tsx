import React from 'react';
import { View, StyleSheet, ViewProps, useWindowDimensions } from 'react-native';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ContainerProps extends ViewProps {
    size?: ContainerSize;
    centered?: boolean;
    children: React.ReactNode;
}

const Container = React.forwardRef<View, ContainerProps>(
    ({ size = 'full', centered = false, children, style, ...props }, ref) => {
        const { width: screenWidth } = useWindowDimensions();

        const getSizeStyle = (size: ContainerSize) => {
            switch (size) {
                case 'sm':
                    return { maxWidth: Math.min(screenWidth * 0.8, 640) };
                case 'md':
                    return { maxWidth: Math.min(screenWidth * 0.9, 768) };
                case 'lg':
                    return { maxWidth: Math.min(screenWidth * 0.95, 1024) };
                case 'xl':
                    return { maxWidth: Math.min(screenWidth, 1280) };
                case 'full':
                default:
                    return { maxWidth: screenWidth };
            }
        };

        const containerStyles = [
            styles.base,
            getSizeStyle(size),
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

const styles = StyleSheet.create({
    base: {
        width: '100%',
        paddingHorizontal: 16,
    },

    centered: {
        alignSelf: 'center',
    },
});

export { Container };
export default Container;
