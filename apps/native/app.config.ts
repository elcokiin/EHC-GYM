import { ExpoConfig, ConfigContext } from 'expo/config';


export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: process.env.EXPO_PUBLIC_APP_NAME || 'EHC Gym',
    slug: 'ehc-gym',
    version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/Logoi.png',
    scheme: 'native',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
        supportsTablet: true,
        bundleIdentifier: process.env.EXPO_PUBLIC_IOS_BUNDLE_ID || 'com.construyebit.ehcgym',
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
        edgeToEdgeEnabled: true,
        package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE || 'com.construyebit.ehcgym',
    },
    web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.png',
    },
    plugins: [
        'expo-router',
        [
            'expo-splash-screen',
            {
                image: './assets/images/splash-icon.png',
                imageWidth: 200,
                resizeMode: 'contain',
                backgroundColor: '#ffffff',
            },
        ],
        'expo-secure-store',
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
        CONVEX_URL: process.env.EXPO_PUBLIC_CONVEX_URL,
        environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
        router: {},
        eas: {
            projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || '00000000-0000-0000-0000-000000000000',
        },
    },
    owner: process.env.EXPO_PUBLIC_OWNER || 'construye-bit',
});
