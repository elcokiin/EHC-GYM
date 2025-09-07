import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    LayoutAnimation,
    UIManager,
} from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
    children: React.ReactElement<AccordionItemProps>[];
}

const AccordionItem: React.FC<AccordionItemProps> = ({
    title,
    children,
    variant = 'default',
    isOpen = false,
    onToggle = () => { },
    disabled = false
}) => {
    const handleToggle = () => {
        if (disabled) return;

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        onToggle();
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
                <Text style={[styles.chevron, isOpen && styles.chevronOpen]}>
                    ▼
                </Text>
            </TouchableOpacity>

            {isOpen && (
                <View style={styles.content}>
                    {children}
                </View>
            )}
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

    return (
        <View style={[styles.accordion, styles[`accordion_${variant}`]]}>
            {React.Children.map(children, (child, index) =>
                React.cloneElement(child, {
                    variant,
                    isOpen: openItems.has(index),
                    onToggle: () => handleItemToggle(index),
                })
            )}
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
        transform: [{ rotate: '0deg' }],
    },

    chevronOpen: {
        transform: [{ rotate: '180deg' }],
    },

    content: {
        padding: 16,
        paddingTop: 0,
        backgroundColor: '#FAFAFA',
    },
});

export { Accordion, AccordionItem };
