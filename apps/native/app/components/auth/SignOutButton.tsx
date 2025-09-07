import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, Alert } from 'react-native'

const SignOutButton = () => {
    // Use `useClerk()` to access the `signOut()` function
    const { signOut } = useClerk()
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut()
            // Navigate to home after sign out
            router.replace('/(home)')
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            Alert.alert('Error', 'Failed to sign out')
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <TouchableOpacity
            style={{
                backgroundColor: '#FF3B30',
                padding: 15,
                borderRadius: 5,
                minWidth: 200
            }}
            onPress={handleSignOut}
        >
            <Text style={{ color: 'white', textAlign: 'center' }}>Sign out</Text>
        </TouchableOpacity>
    )
}

export default SignOutButton