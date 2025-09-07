import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React from 'react'

export default function ForgotPasswordPage() {
    const { signIn, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    // Handle the submission of the forgot password form
    const onForgotPasswordPress = async () => {
        if (!isLoaded) return
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
            Alert.alert('Error', err.errors?.[0]?.message || 'An error occurred while sending reset code')
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 10 }}>¿Olvidaste tu contraseña?</Text>
            <Text style={{
                fontSize: 16,
                color: '#666',
                marginBottom: 30,
                lineHeight: 22
            }}>
                Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
            </Text>

            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 5
                }}
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Ingresa tu correo electrónico"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                keyboardType="email-address"
            />

            <TouchableOpacity
                style={{
                    backgroundColor: loading ? '#ccc' : '#007AFF',
                    padding: 15,
                    borderRadius: 5,
                    marginBottom: 20
                }}
                onPress={onForgotPasswordPress}
                disabled={loading || !emailAddress}
            >
                <Text style={{ color: 'white', textAlign: 'center' }}>
                    {loading ? 'Enviando...' : 'Enviar código'}
                </Text>
            </TouchableOpacity>

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 5 }}>
                <Text>¿Recordaste tu contraseña?</Text>
                <Link href="./sign-in">
                    <Text style={{ color: '#007AFF' }}>Iniciar sesión</Text>
                </Link>
            </View>
        </View>
    )
}
