import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return
        setLoading(true)

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress,
                password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true)
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            Alert.alert('Error', err.errors?.[0]?.message || 'An error occurred during sign up')
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setLoading(false)
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return
        setLoading(true)

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/(home)')
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            Alert.alert('Error', err.errors?.[0]?.message || 'An error occurred during verification')
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setLoading(false)
        }
    }

    if (pendingVerification) {
        return (
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 24, marginBottom: 20 }}>Verify your email</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 10,
                        marginBottom: 20,
                        borderRadius: 5
                    }}
                    value={code}
                    placeholder="Enter your verification code"
                    onChangeText={(code) => setCode(code)}
                />
                <TouchableOpacity
                    style={{
                        backgroundColor: loading ? '#ccc' : '#007AFF',
                        padding: 15,
                        borderRadius: 5
                    }}
                    onPress={onVerifyPress}
                    disabled={loading}
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                        {loading ? 'Verifying...' : 'Verify'}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign up</Text>
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
                onChangeText={(email) => setEmailAddress(email)}
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
                    marginBottom: 20
                }}
                onPress={onSignUpPress}
                disabled={loading}
            >
                <Text style={{ color: 'white', textAlign: 'center' }}>
                    {loading ? 'Creating account...' : 'Continue'}
                </Text>
            </TouchableOpacity>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 5 }}>
                <Text>Already have an account?</Text>
                <Link href="./sign-in">
                    <Text style={{ color: '#007AFF' }}>Sign in</Text>
                </Link>
            </View>
        </View>
    )
}