import { useSignIn } from '@clerk/clerk-expo'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React from 'react'

export default function ResetPasswordPage() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()
    const { email } = useLocalSearchParams<{ email: string }>()

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
                router.replace('/(home)')
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

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 10 }}>Restablecer contraseña</Text>
            <Text style={{
                fontSize: 16,
                color: '#666',
                marginBottom: 20,
                lineHeight: 22
            }}>
                Hemos enviado un código de verificación a {email}. Ingresa el código y tu nueva contraseña.
            </Text>

            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 15,
                    borderRadius: 5
                }}
                value={code}
                placeholder="Código de verificación"
                onChangeText={(code) => setCode(code)}
                keyboardType="number-pad"
                maxLength={6}
            />

            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 15,
                    borderRadius: 5
                }}
                value={newPassword}
                placeholder="Nueva contraseña"
                secureTextEntry={true}
                onChangeText={(password) => setNewPassword(password)}
            />

            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 5
                }}
                value={confirmPassword}
                placeholder="Confirmar nueva contraseña"
                secureTextEntry={true}
                onChangeText={(password) => setConfirmPassword(password)}
            />

            <TouchableOpacity
                style={{
                    backgroundColor: loading ? '#ccc' : '#007AFF',
                    padding: 15,
                    borderRadius: 5,
                    marginBottom: 15
                }}
                onPress={onResetPasswordPress}
                disabled={loading || !code || !newPassword || !confirmPassword}
            >
                <Text style={{ color: 'white', textAlign: 'center' }}>
                    {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    padding: 10,
                    marginBottom: 20
                }}
                onPress={resendCode}
            >
                <Text style={{ color: '#007AFF', textAlign: 'center' }}>
                    ¿No recibiste el código? Reenviar
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.back()}
            >
                <Text style={{ color: '#666', textAlign: 'center' }}>
                    Volver atrás
                </Text>
            </TouchableOpacity>
        </View>
    )
}