// UI Components - shadcn-like structure for React Native
export { Button } from './button';
export type { ButtonVariant, ButtonSize } from './button';

export { Text } from './text';
export type { TextVariant, TextColor, TextAlign } from './text';

export { Input } from './input';
export type { InputSize, InputVariant } from './input';

export { PasswordInput } from './password-input';

export { CodeInput } from './code-input';

export { DateInput } from './date-input';

export { PhoneInput } from './phone-input';

export { Card, CardHeader, CardContent, CardFooter } from './card';
export type { CardVariant, CardSize } from './card';

export { Separator } from './separator';
export type { SeparatorOrientation, SeparatorVariant } from './separator';

export { SeparatorWithText } from './separator-with-text';

export { Separator as Divider } from './divider';

export { Container } from './container';
export type { ContainerSize } from './container';

export { Stack } from './stack';
export type { StackDirection, StackAlign, StackJustify } from './stack';

export { Accordion, AccordionItem } from './accordion';
export type { AccordionVariant } from './accordion';

// Import all components for default export
import { Button } from './button';
import { Text } from './text';
import { Input } from './input';
import { PasswordInput } from './password-input';
import { CodeInput } from './code-input';
import { DateInput } from './date-input';
import { PhoneInput } from './phone-input';
import { Card, CardHeader, CardContent, CardFooter } from './card';
import { Separator } from './separator';
import { SeparatorWithText } from './separator-with-text';
import { Container } from './container';
import { Stack } from './stack';
import { Accordion, AccordionItem } from './accordion';

// Default export for the main UI components library
export default {
    Button,
    Text,
    Input,
    PasswordInput,
    CodeInput,
    DateInput,
    PhoneInput,
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    Separator,
    SeparatorWithText,
    Container,
    Stack,
    Accordion,
    AccordionItem,
};
