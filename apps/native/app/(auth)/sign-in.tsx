import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React from 'react'

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
        if (!isLoaded) return
        setLoading(true)

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/(home)')
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            Alert.alert('Error', err.errors?.[0]?.message || 'An error occurred during sign in')
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign in</Text>
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
                placeholder="Enter email"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 5
                }}
                value={password}
                placeholder="Enter password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
            />
            <TouchableOpacity
                style={{
                    backgroundColor: loading ? '#ccc' : '#007AFF',
                    padding: 15,
                    borderRadius: 5,
                    marginBottom: 15
                }}
                onPress={onSignInPress}
                disabled={loading}
            >
                <Text style={{ color: 'white', textAlign: 'center' }}>
                    {loading ? 'Signing in...' : 'Continue'}
                </Text>
            </TouchableOpacity>

            <View style={{ marginBottom: 20, alignItems: 'center' }}>
                <Link href="./forgot-password">
                    <Text style={{ color: '#007AFF' }}>¿Se te olvidó la contraseña?</Text>
                </Link>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 5 }}>
                <Text>Don't have an account?</Text>
                <Link href="./sign-up">
                    <Text style={{ color: '#007AFF' }}>Sign up</Text>
                </Link>
            </View>
        </View>
    )
}