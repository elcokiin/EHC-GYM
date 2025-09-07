import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

export type StackDirection = 'vertical' | 'horizontal';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

interface StackProps extends ViewProps {
    direction?: StackDirection;
    spacing?: number;
    align?: StackAlign;
    justify?: StackJustify;
    wrap?: boolean;
    children: React.ReactNode;
}

const Stack = React.forwardRef<View, StackProps>(
    (
        {
            direction = 'vertical',
            spacing = 0,
            align = 'stretch',
            justify = 'start',
            wrap = false,
            children,
            style,
            ...props
        },
        ref
    ) => {
        const stackStyles = [
            styles.base,
            styles[`direction_${direction}`],
            styles[`align_${align}`],
            styles[`justify_${justify}`],
            wrap && styles.wrap,
            style,
        ];

        const childrenArray = React.Children.toArray(children);

        return (
            <View ref={ref} style={stackStyles} {...props}>
                {childrenArray.map((child, index) => {
                    const isLast = index === childrenArray.length - 1;
                    const spacingStyle = spacing > 0 && !isLast
                        ? direction === 'vertical'
                            ? { marginBottom: spacing }
                            : { marginRight: spacing }
                        : {};

                    return (
                        <View key={index} style={spacingStyle}>
                            {child}
                        </View>
                    );
                })}
            </View>
        );
    }
);

Stack.displayName = 'Stack';

const styles = StyleSheet.create({
    base: {
        flex: 0,
    },

    // Directions
    direction_vertical: {
        flexDirection: 'column',
    },
    direction_horizontal: {
        flexDirection: 'row',
    },

    // Alignment
    align_start: {
        alignItems: 'flex-start',
    },
    align_center: {
        alignItems: 'center',
    },
    align_end: {
        alignItems: 'flex-end',
    },
    align_stretch: {
        alignItems: 'stretch',
    },

    // Justify
    justify_start: {
        justifyContent: 'flex-start',
    },
    justify_center: {
        justifyContent: 'center',
    },
    justify_end: {
        justifyContent: 'flex-end',
    },
    justify_between: {
        justifyContent: 'space-between',
    },
    justify_around: {
        justifyContent: 'space-around',
    },
    justify_evenly: {
        justifyContent: 'space-evenly',
    },

    wrap: {
        flexWrap: 'wrap',
    },
});

export { Stack };
export default Stack;
