import { useSignIn } from '@clerk/clerk-expo'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { View, Alert, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { ChevronLeft } from 'lucide-react-native'
import { Container } from '../components/ui/container'
import { Text } from '../components/ui/text'
import { Input } from '../components/ui/input'
import { PasswordInput } from '../components/ui/password-input'
import { Button } from '../components/ui/button'
import { CodeInput } from '../components/ui/code-input'

export default function ResetPasswordPage() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()
    const { email } = useLocalSearchParams<{ email: string }>()

    const [step, setStep] = React.useState<'verify' | 'success'>('verify')
    const [code, setCode] = React.useState('')
    const [newPassword, setNewPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    // Handle the submission of the reset password form
    const onResetPasswordPress = async () => {
        if (!isLoaded) return

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden')
            return
        }

        if (newPassword.length < 8) {
            Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres')
            return
        }

        setLoading(true)

        try {
            // Attempt to reset the password with the code and new password
            const signInAttempt = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password: newPassword,
            })

            // If reset is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                setStep('success')
                setTimeout(() => {
                    router.replace('/(home)')
                }, 2000)
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2))
                Alert.alert('Error', 'No se pudo completar el restablecimiento de contraseña')
            }
        } catch (err: any) {
            Alert.alert('Error', err.errors?.[0]?.message || 'An error occurred while resetting password')
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setLoading(false)
        }
    }

    const resendCode = async () => {
        if (!isLoaded) return

        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            })
            Alert.alert('Éxito', 'Se ha enviado un nuevo código a tu correo electrónico')
        } catch (err: any) {
            Alert.alert('Error', err.errors?.[0]?.message || 'Error al reenviar el código')
            console.error(JSON.stringify(err, null, 2))
        }
    }

    const renderVerifyCodeStep = () => (
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
                        Verifica tu correo electrónico
                    </Text>
                    <Text variant="p" color="secondary" style={styles.subtitle}>
                        Enviamos código a tu correo{' '}
                        <Text variant="p" weight="medium" color="primary">
                            {email}
                        </Text>
                        {'\n'}Ingresa los 5 dígitos que se mencionan en el correo.
                    </Text>
                </View>

                <View style={styles.form}>
                    <CodeInput
                        value={code}
                        onChangeText={setCode}
                        length={5}
                        autoFocus={true}
                    />

                    <PasswordInput
                        label="Nueva contraseña"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="••••••••"
                    />

                    <PasswordInput
                        label="Confirmar contraseña"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="••••••••"
                    />

                    <Button
                        onPress={onResetPasswordPress}
                        loading={loading}
                        disabled={code.length !== 5 || !newPassword || !confirmPassword}
                        fullWidth
                        style={styles.primaryButton}
                    >
                        Verificar Código
                    </Button>

                    <TouchableOpacity
                        onPress={resendCode}
                        style={styles.resendButton}
                        disabled={loading}
                    >
                        <Text variant="p" color="secondary">
                            ¿No recibiste el correo?{' '}
                        </Text>
                        <Text variant="p" color="accent" weight="medium">
                            Reenviar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Container>
    )

    const renderSuccessStep = () => (
        <Container size="md" centered>
            <View style={styles.content}>
                <View style={styles.titleContainer}>
                    <Text variant="h2" weight="bold" align="center">
                        Contraseña cambiada
                    </Text>
                    <Text variant="p" color="secondary" align="center" style={styles.subtitle}>
                        Tu contraseña fue cambiada exitosamente,{'\n'}presiona confirmar para ingresar en la aplicación
                    </Text>
                </View>

                <View style={styles.form}>
                    <Button
                        onPress={() => router.replace('/(home)')}
                        fullWidth
                        style={styles.primaryButton}
                    >
                        Confirmar
                    </Button>
                </View>
            </View>
        </Container>
    )

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {step === 'verify' && renderVerifyCodeStep()}
            {step === 'success' && renderSuccessStep()}
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
    resendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        paddingVertical: 12,
    },
})