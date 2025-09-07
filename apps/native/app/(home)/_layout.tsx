import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function HomeLayout() {
    const { isSignedIn, isLoaded } = useAuth()

    // Wait for auth to load
    if (!isLoaded) {
        return null
    }

    // Redirect to auth if not signed in
    if (!isSignedIn) {
        return <Redirect href="/(auth)/sign-in" />
    }

    return <Stack screenOptions={{ headerShown: false }} />
}