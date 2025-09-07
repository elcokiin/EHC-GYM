import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './text';

interface SeparatorWithTextProps {
    text: string;
}

export const SeparatorWithText: React.FC<SeparatorWithTextProps> = ({ text }) => {
    return (
        <View style={styles.container}>
            <View style={styles.line} />
            <Text variant="p" color="secondary" style={styles.text}>
                {text}
            </Text>
            <View style={styles.line} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    text: {
        marginHorizontal: 20,
        fontSize: 16,
    },
});
