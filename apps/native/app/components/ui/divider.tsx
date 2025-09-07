import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './text';

interface SeparatorProps {
    text?: string;
    orientation?: 'horizontal' | 'vertical';
}

export const Separator: React.FC<SeparatorProps> = ({
    text = 'O',
    orientation = 'horizontal'
}) => {
    if (orientation === 'vertical') {
        return <View style={styles.verticalLine} />;
    }

    if (text) {
        return (
            <View style={styles.container}>
                <View style={styles.line} />
                <Text variant="p" color="secondary" style={styles.text}>
                    {text}
                </Text>
                <View style={styles.line} />
            </View>
        );
    }

    return <View style={styles.line} />;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    verticalLine: {
        width: 1,
        backgroundColor: '#E0E0E0',
    },
    text: {
        marginHorizontal: 20,
        fontSize: 16,
        color: '#666',
    },
});
