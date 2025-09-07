import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayoutNav() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Slot />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}