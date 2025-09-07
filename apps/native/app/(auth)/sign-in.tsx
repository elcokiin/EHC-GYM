import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Alert,
    TouchableOpacity,
    StyleSheet,
    Image,
    View,
} from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Button, Input, PasswordInput, Text, Container, Divider } from '../components/ui';

export default function SignInPage() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!isLoaded) return;

        if (!emailAddress || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        try {
            setLoading(true);

            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/(home)');
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err: any) {
            Alert.alert('Error', err.errors?.[0]?.message || 'Ocurrió un error durante el inicio de sesión');
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        Alert.alert('Google Login', 'Funcionalidad de Google Login en desarrollo');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/images/Logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Form Container */}
                <Container style={styles.formContainer}>
                    <Text variant="h1" align="center" style={styles.title}>
                        Ingresar
                    </Text>

                    <View style={styles.registerLinkContainer}>
                        <Text variant="p" color="secondary" style={styles.registerText}>
                            ¿No tienes una cuenta?{' '}
                        </Text>
                        <Link href="./sign-up" asChild>
                            <TouchableOpacity>
                                <Text variant="p" style={styles.registerLink}>
                                    Regístrate
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {/* Email Input */}
                    <Input
                        label="Correo Electrónico"
                        value={emailAddress}
                        onChangeText={setEmailAddress}
                        placeholder="loisbecket@gmail.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    {/* Password Input */}
                    <PasswordInput
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••"
                    />

                    {/* Forgot Password */}
                    <View style={styles.forgotPasswordContainer}>
                        <Link href="./forgot-password" asChild>
                            <TouchableOpacity>
                                <Text variant="p" style={styles.forgotPasswordText}>
                                    ¿Olvidaste tu contraseña?
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {/* Sign In Button */}
                    <Button
                        onPress={handleSignIn}
                        disabled={loading}
                        loading={loading}
                        style={styles.signInButton}
                    >
                        Ingresar
                    </Button>

                    {/* Divider */}
                    <Divider text="O" />

                    {/* Google Button */}
                    <Button
                        variant="outline"
                        onPress={handleGoogleSignIn}
                        style={styles.googleButton}
                        leftIcon={
                            <Image
                                source={{
                                    uri: 'https://developers.google.com/identity/images/g-logo.png'
                                }}
                                style={styles.googleIcon}
                            />
                        }
                    >
                        Continua con Google
                    </Button>
                </Container>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 30,
    },
    logo: {
        width: 180,
        height: 180,
    },
    formContainer: {
        paddingTop: 10,
        paddingBottom: 20,
    },
    title: {
        fontSize: 50,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 15,
        lineHeight: 60,
    },
    registerLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
        flexWrap: 'wrap',
    },
    registerText: {
        fontSize: 18,
        color: '#666',
    },
    registerLink: {
        fontSize: 18,
        color: '#FFAF00',
        fontWeight: '600',
    },
    forgotPasswordContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 25,
    },
    forgotPasswordText: {
        fontSize: 18,
        color: '#FFAF00',
        fontWeight: '500',
    },
    signInButton: {
        marginTop: 15,
        marginBottom: 25,
    },
    googleButton: {
        borderRadius: 25,
        paddingVertical: 14,
        marginBottom: 20,
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
});