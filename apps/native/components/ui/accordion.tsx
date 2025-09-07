import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
    measure,
    useAnimatedRef
} from 'react-native-reanimated';

export type AccordionVariant = 'default' | 'outline' | 'ghost';

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    disabled?: boolean;
    variant?: AccordionVariant;
    isOpen?: boolean;
    onToggle?: () => void;
}

interface AccordionProps {
    variant?: AccordionVariant;
    type?: 'single' | 'multiple';
    children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
    title,
    children,
    variant = 'default',
    isOpen = false,
    onToggle = () => { },
    disabled = false
}) => {
    const height = useSharedValue(0);
    const opacity = useSharedValue(0);
    const contentHeight = useSharedValue(0);
    const animatedRef = useAnimatedRef<View>();

    React.useEffect(() => {
        if (isOpen) {
            height.value = withTiming(contentHeight.value, { duration: 300 });
            opacity.value = withTiming(1, { duration: 300 });
        } else {
            height.value = withTiming(0, { duration: 300 });
            opacity.value = withTiming(0, { duration: 300 });
        }
    }, [isOpen, height, opacity, contentHeight]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: height.value,
            opacity: opacity.value,
            overflow: 'hidden',
        };
    });

    const chevronAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: withTiming(isOpen ? '180deg' : '0deg', { duration: 300 }) }]
    }));

    const handleToggle = () => {
        if (disabled) return;
        onToggle();
    };

    const handleContentLayout = (event: any) => {
        const { height: layoutHeight } = event.nativeEvent.layout;
        contentHeight.value = layoutHeight;
        if (isOpen && height.value === 0) {
            height.value = withTiming(layoutHeight, { duration: 300 });
        }
    };

    return (
        <View style={[styles.item, styles[`item_${variant}`]]}>
            <TouchableOpacity
                style={[styles.trigger, disabled && styles.triggerDisabled]}
                onPress={handleToggle}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <Text style={[styles.triggerText, disabled && styles.triggerTextDisabled]}>
                    {title}
                </Text>
                <Animated.Text style={[styles.chevron, chevronAnimatedStyle]}>
                    ▼
                </Animated.Text>
            </TouchableOpacity>

            <Animated.View style={animatedStyle} ref={animatedRef}>
                <View style={styles.content} onLayout={handleContentLayout}>
                    {children}
                </View>
            </Animated.View>
        </View>
    );
};

const Accordion: React.FC<AccordionProps> = ({
    variant = 'default',
    type = 'single',
    children
}) => {
    const [openItems, setOpenItems] = useState<Set<number>>(new Set());

    const handleItemToggle = (index: number) => {
        setOpenItems(prev => {
            const newSet = new Set(prev);

            if (type === 'single') {
                // Close all other items
                newSet.clear();
                if (!prev.has(index)) {
                    newSet.add(index);
                }
            } else {
                // Multiple items can be open
                if (newSet.has(index)) {
                    newSet.delete(index);
                } else {
                    newSet.add(index);
                }
            }

            return newSet;
        });
    };

    const validChildren = React.Children.toArray(children).filter(React.isValidElement);

    return (
        <View style={[styles.accordion, styles[`accordion_${variant}`]]}>
            {validChildren.map((child, index) => {
                if (React.isValidElement<AccordionItemProps>(child)) {
                    return React.cloneElement(child, {
                        key: child.key || index,
                        variant,
                        isOpen: openItems.has(index),
                        onToggle: () => handleItemToggle(index),
                    });
                }
                return child;
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    accordion: {
        borderRadius: 8,
        overflow: 'hidden',
    },

    // Accordion variants
    accordion_default: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    accordion_outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    accordion_ghost: {
        backgroundColor: 'transparent',
    },

    item: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },

    item_default: {
        backgroundColor: '#FFFFFF',
    },
    item_outline: {
        backgroundColor: 'transparent',
    },
    item_ghost: {
        backgroundColor: 'transparent',
    },

    trigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        minHeight: 48,
    },

    triggerDisabled: {
        opacity: 0.5,
    },

    triggerText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#0b0b09',
        flex: 1,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },

    triggerTextDisabled: {
        color: '#9CA3AF',
    },

    chevron: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 8,
    },

    content: {
        padding: 16,
        paddingTop: 0,
        backgroundColor: '#FAFAFA',
    },
});

export { Accordion, AccordionItem };
export default Accordion;
