import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { View, Alert, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { ChevronLeft } from 'lucide-react-native'
import { Container } from '../components/ui/container'
import { Text } from '../components/ui/text'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

export default function ForgotPasswordPage() {
    const { signIn, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    // Handle the submission of the forgot password form
    const onForgotPasswordPress = async () => {
        if (!isLoaded) return

        if (!emailAddress) {
            Alert.alert('Error', 'Por favor ingresa tu correo electrónico')
            return
        }

        setLoading(true)

        try {
            // Create a password reset request
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: emailAddress,
            })

            // Navigate to the reset password screen
            router.push({
                pathname: '/(auth)/reset-password',
                params: { email: emailAddress }
            })
        } catch (err: any) {
            Alert.alert('Error', err.errors?.[0]?.message || 'Error al enviar el código')
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Container size="md" centered>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <ChevronLeft size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.titleContainer}>
                        <Text variant="h2" weight="bold" align="left">
                            Olvidaste tu contraseña
                        </Text>
                        <Text variant="p" color="secondary" style={styles.subtitle}>
                            Por favor ingresa tu correo electrónico para cambiar tu contraseña
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Correo electrónico"
                            value={emailAddress}
                            onChangeText={setEmailAddress}
                            placeholder="contact@discodetech.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />

                        <Button
                            onPress={onForgotPasswordPress}
                            loading={loading}
                            disabled={!emailAddress}
                            fullWidth
                            style={styles.primaryButton}
                        >
                            Cambiar Contraseña
                        </Button>

                        <View style={styles.linkContainer}>
                            <Text variant="p" color="secondary">
                                ¿Recordaste tu contraseña?{' '}
                            </Text>
                            <Link href="./sign-in" asChild>
                                <TouchableOpacity>
                                    <Text variant="p" color="accent" weight="medium">
                                        Iniciar sesión
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </Container>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
        minHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        height: 40,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        marginBottom: 40,
    },
    subtitle: {
        marginTop: 12,
        lineHeight: 22,
    },
    form: {
        gap: 20,
    },
    primaryButton: {
        marginTop: 20,
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        paddingVertical: 12,
    },
})
