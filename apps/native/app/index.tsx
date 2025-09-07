import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { AuthLoading } from "convex/react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";

// Complete the AuthSession setup for Clerk
WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading while auth state is being determined
  if (!isLoaded) {
    return (
      <AuthLoading>
        <LoadingComponent />
      </AuthLoading>
    );
  }

  // Always redirect to onBoarding screen first
  return <Redirect href="/onBoarding" />;
}

function LoadingComponent() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});
