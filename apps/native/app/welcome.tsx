import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import React from 'react';

export default function WelcomePage() {
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const onStartPress = () => {
        if (isSignedIn) {
            router.replace('/(home)');
        } else {
            router.replace('/(auth)/sign-in');
        }
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
            <View style={styles.container}>
                <View style={styles.content}>
                    {/* Logo o imagen principal */}
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>💪</Text>
                        <Text style={styles.appName}>EHC GYM</Text>
                    </View>

                    {/* Título y descripción */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            {isSignedIn ? '¡Bienvenido de vuelta!' : 'Bienvenido a tu gimnasio'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {isSignedIn
                                ? 'Continuemos donde lo dejaste. Tu próximo entrenamiento te está esperando.'
                                : 'Transforma tu cuerpo, mente y vida con nosotros. Comienza tu viaje hacia una versión más fuerte de ti mismo.'
                            }
                        </Text>
                    </View>

                    {/* Características destacadas */}
                    <View style={styles.featuresContainer}>
                        <FeatureItem
                            icon="🏋️"
                            text="Equipos de última generación"
                        />
                        <FeatureItem
                            icon="👨‍🏫"
                            text="Entrenadores certificados"
                        />
                        <FeatureItem
                            icon="📱"
                            text="Seguimiento personalizado"
                        />
                    </View>
                </View>

                {/* Botón principal */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={onStartPress}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.startButtonText}>
                            {isSignedIn ? 'Continuar' : 'Empieza ahora'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.footerText}>
                        {isSignedIn
                            ? "Continúa con tu entrenamiento"
                            : "Únete a miles de personas que ya transformaron su vida"
                        }
                    </Text>
                </View>
            </View>
        </>
    );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
    return (
        <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>{icon}</Text>
            <Text style={styles.featureText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 80,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    logoText: {
        fontSize: 80,
        marginBottom: 10,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 2,
    },
    textContainer: {
        marginBottom: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#cccccc',
        textAlign: 'center',
        lineHeight: 24,
    },
    featuresContainer: {
        gap: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    featureIcon: {
        fontSize: 24,
        marginRight: 15,
    },
    featureText: {
        fontSize: 16,
        color: '#ffffff',
        flex: 1,
    },
    buttonContainer: {
        paddingHorizontal: 30,
        paddingBottom: 50,
    },
    startButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 18,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#007AFF',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    startButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'center',
        lineHeight: 20,
    },
});
