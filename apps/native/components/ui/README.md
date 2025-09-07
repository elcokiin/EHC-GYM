# UI Components Library

Una biblioteca de componentes UI inspirada en shadcn/ui pero adaptada para React Native. Estos componentes están diseñados para ser reutilizables, accesibles y fáciles de personalizar.

## Componentes Disponibles

### Button

Un componente de botón versátil con múltiples variantes y tamaños.

```tsx
import { Button } from './components/ui';

// Botón básico
<Button onPress={() => console.log('Presionado')}>
  Presionar
</Button>

// Botón con variante destructiva
<Button variant="destructive" onPress={handleDelete}>
  Eliminar
</Button>

// Botón con gradiente
<Button 
  variant="gradient" 
  gradientColors={['#FFAF00', '#FF9500']}
  size="lg"
>
  Botón con Gradiente
</Button>

// Botón con iconos
<Button 
  leftIcon={<Icon name="plus" />}
  rightIcon={<Icon name="arrow-right" />}
>
  Con Iconos
</Button>
```

**Props:**
- `variant`: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `gradientColors`: string[] (para variant="gradient")
- `leftIcon`, `rightIcon`: React.ReactNode

### Text

Componente de texto con tipografía predefinida siguiendo un sistema de diseño consistente.

```tsx
import { Text } from './components/ui';

// Encabezados
<Text variant="h1">Título Principal</Text>
<Text variant="h2" color="accent">Subtítulo</Text>

// Texto del cuerpo
<Text variant="p">Párrafo normal</Text>
<Text variant="muted">Texto secundario</Text>

// Texto con peso personalizado
<Text weight="bold" align="center">
  Texto centrado y en negrita
</Text>
```

**Props:**
- `variant`: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'blockquote' | 'lead' | 'large' | 'small' | 'muted' | 'caption'
- `color`: 'primary' | 'secondary' | 'muted' | 'accent' | 'destructive' | 'warning' | 'success' | 'white' | 'black'
- `align`: 'left' | 'center' | 'right' | 'justify'
- `weight`: 'normal' | 'medium' | 'semibold' | 'bold' | 'black'

### Input

Campo de entrada con etiquetas, mensajes de error y iconos opcionales.

```tsx
import { Input } from './components/ui';

// Input básico
<Input 
  placeholder="Escribe aquí..."
  value={value}
  onChangeText={setValue}
/>

// Input con etiqueta y validación
<Input 
  label="Correo electrónico"
  placeholder="tu@email.com"
  error={errors.email}
  required
  keyboardType="email-address"
/>

// Input con iconos
<Input 
  label="Contraseña"
  placeholder="********"
  secureTextEntry
  leftIcon={<Icon name="lock" />}
  rightIcon={<Icon name="eye" />}
/>
```

**Props:**
- `label`: string
- `error`: string
- `helper`: string
- `size`: 'default' | 'sm' | 'lg'
- `variant`: 'default' | 'destructive'
- `leftIcon`, `rightIcon`: React.ReactNode
- `required`: boolean

### Card

Contenedor con sombra y bordes redondeados para agrupar contenido relacionado.

```tsx
import { Card, CardHeader, CardContent, CardFooter } from './components/ui';

<Card variant="default">
  <CardHeader>
    <Text variant="h3">Título de la Tarjeta</Text>
  </CardHeader>
  <CardContent>
    <Text>Contenido de la tarjeta aquí...</Text>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Cancelar</Button>
    <Button>Confirmar</Button>
  </CardFooter>
</Card>
```

**Props:**
- `variant`: 'default' | 'outline' | 'ghost'
- `size`: 'default' | 'sm' | 'lg'

### Stack

Componente de layout para organizar elementos con espaciado consistente.

```tsx
import { Stack } from './components/ui';

// Stack vertical con espaciado
<Stack direction="vertical" spacing={16}>
  <Text>Elemento 1</Text>
  <Text>Elemento 2</Text>
  <Text>Elemento 3</Text>
</Stack>

// Stack horizontal centrado
<Stack 
  direction="horizontal" 
  spacing={12} 
  align="center"
  justify="between"
>
  <Button variant="outline">Cancelar</Button>
  <Button>Confirmar</Button>
</Stack>
```

**Props:**
- `direction`: 'vertical' | 'horizontal'
- `spacing`: number
- `align`: 'start' | 'center' | 'end' | 'stretch'
- `justify`: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
- `wrap`: boolean

### Container

Wrapper responsive que limita el ancho del contenido.

```tsx
import { Container } from './components/ui';

<Container size="md" centered>
  <Text>Contenido centrado con ancho máximo</Text>
</Container>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `centered`: boolean

### Separator

Línea divisoria horizontal o vertical.

```tsx
import { Separator } from './components/ui';

<Separator />
<Separator orientation="vertical" />
<Separator variant="dashed" />
```

**Props:**
- `orientation`: 'horizontal' | 'vertical'
- `variant`: 'default' | 'dashed'

### Accordion

Componente colapsible para organizar contenido en secciones expandibles.

```tsx
import { Accordion, AccordionItem } from './components/ui';

<Accordion type="single" variant="default">
  <AccordionItem title="Sección 1">
    <Text>Contenido de la primera sección</Text>
  </AccordionItem>
  <AccordionItem title="Sección 2">
    <Text>Contenido de la segunda sección</Text>
  </AccordionItem>
</Accordion>
```

**Props del Accordion:**
- `variant`: 'default' | 'outline' | 'ghost'
- `type`: 'single' | 'multiple'

**Props del AccordionItem:**
- `title`: string
- `defaultOpen`: boolean
- `disabled`: boolean

## Tema y Personalización

Los componentes utilizan un sistema de colores consistente:

- **Primary**: `#0b0b09` (texto principal)
- **Secondary**: `#6B7280` (texto secundario)
- **Accent**: `#FF9500` (color de acento/marca)
- **Muted**: `#9CA3AF` (texto deshabilitado)
- **Destructive**: `#EF4444` (errores/eliminar)
- **Success**: `#10B981` (éxito)
- **Warning**: `#F59E0B` (advertencias)

### Personalizando Estilos

Todos los componentes aceptan la prop `style` para personalizaciones adicionales:

```tsx
<Button 
  style={{ 
    backgroundColor: 'purple', 
    borderRadius: 20 
  }}
>
  Botón Personalizado
</Button>
```

## Buenas Prácticas

1. **Consistencia**: Usa los componentes predefinidos en lugar de crear elementos básicos
2. **Accesibilidad**: Los componentes incluyen props de accesibilidad automáticamente
3. **Responsive**: Los componentes se adaptan a diferentes tamaños de pantalla
4. **Tipografía**: Usa las variantes de Text para mantener jerarquía visual consistente
5. **Espaciado**: Utiliza Stack para espaciado consistente entre elementos

## Ejemplo de Uso Completo

```tsx
import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  Text, 
  Input, 
  Button, 
  Stack,
  Separator 
} from './components/ui';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Container size="md" centered>
      <Card>
        <CardHeader>
          <Text variant="h2" align="center">
            Iniciar Sesión
          </Text>
          <Text variant="muted" align="center">
            Ingresa tus credenciales para continuar
          </Text>
        </CardHeader>
        
        <CardContent>
          <Stack spacing={16}>
            <Input
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              required
            />
            
            <Input
              label="Contraseña"
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              required
            />
          </Stack>
        </CardContent>
        
        <Separator />
        
        <CardFooter>
          <Stack direction="horizontal" spacing={12} style={{ width: '100%' }}>
            <Button variant="outline" style={{ flex: 1 }}>
              Cancelar
            </Button>
            <Button style={{ flex: 1 }}>
              Iniciar Sesión
            </Button>
          </Stack>
        </CardFooter>
      </Card>
    </Container>
  );
}
```

Este sistema de componentes proporciona una base sólida para construir interfaces consistentes y atractivas en tu aplicación React Native.
