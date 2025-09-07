import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, Alert, StyleSheet } from 'react-native'

const SignOutButton = () => {
    // Use `useClerk()` to access the `signOut()` function
    const { signOut } = useClerk()
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut()
            // Navigate to home after sign out
            router.replace('/(home)')
        } catch (err: unknown) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            Alert.alert('Error', 'Failed to sign out')
            if (err instanceof Error) {
                console.error(JSON.stringify(err.message, null, 2))
            } else {
                console.error(String(err))
            }
        }
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handleSignOut}
        >
            <Text style={styles.text}>Sign out</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FF3B30',
        padding: 15,
        borderRadius: 5,
        minWidth: 200
    },
    text: {
        color: 'white',
        textAlign: 'center'
    }
})

export default SignOutButton