import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    Dimensions,
    StatusBar,
    Platform,
    PixelRatio
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Button } from './components/ui';

// Función para obtener dimensiones dinámicas
const getScreenDimensions = () => {
    const { width, height } = Dimensions.get('window');
    const screenData = Dimensions.get('screen');
    return {
        width,
        height,
        screenWidth: screenData.width,
        screenHeight: screenData.height,
        isLandscape: width > height,
        isTablet: Math.min(width, height) >= 768,
        scale: PixelRatio.get()
    };
};

// Función para obtener tamaños responsivos
const getResponsiveSize = (size: number, screenDimensions: any) => {
    const { width, isTablet } = screenDimensions;
    const baseWidth = 375; // iPhone X como referencia
    let scale = width / baseWidth;

    // Limitamos el escalado para pantallas muy grandes
    if (isTablet) {
        scale = Math.min(scale, 1.5);
    }

    return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

export default function OnBoardingScreen() {
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const [screenDimensions, setScreenDimensions] = useState(getScreenDimensions());

    // Actualizar dimensiones cuando cambie la orientación
    useEffect(() => {
        const updateDimensions = () => {
            setScreenDimensions(getScreenDimensions());
        };

        const subscription = Dimensions.addEventListener('change', updateDimensions);

        return () => subscription?.remove();
    }, []);

    const onGetStarted = () => {
        if (isSignedIn) {
            router.replace('/(home)');
        } else {
            router.replace('/(auth)/sign-in');
        }
    };

    // Crear estilos dinámicos basados en las dimensiones actuales
    const dynamicStyles = createDynamicStyles(screenDimensions);

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={Platform.OS === 'android'}
            />

            {/* Imagen principal */}
            <View style={[styles.imageContainer, dynamicStyles.imageContainer]}>
                <Image
                    source={require('../assets/images/onBoarding.png')}
                    style={[styles.mainImage, dynamicStyles.mainImage]}
                    resizeMode="cover"
                />

                {/* Overlay gradient para mejor legibilidad del texto */}
                <LinearGradient
                    colors={['rgba(254, 254, 254, 0.01)', 'rgba(255, 255, 255, 1)']}
                    style={[styles.imageOverlay, dynamicStyles.imageOverlay]}
                />
            </View>

            {/* Contenido inferior */}
            <View style={[styles.contentContainer, dynamicStyles.contentContainer]}>
                <View style={[styles.textContainer, dynamicStyles.textContainer]}>
                    <Text style={[styles.title, dynamicStyles.title]}>
                        Donde Quiera Que Estes La{'\n'}
                        <Text style={[styles.highlightedText, dynamicStyles.highlightedText]}>Salud</Text>
                        <Text style={[styles.title, dynamicStyles.title]}> Es Lo Primero</Text>
                    </Text>

                    <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
                        No existe una forma instantánea{'\n'}
                        de tener una vida saludable.
                    </Text>
                </View>

                {/* Botón principal */}
                <Button
                    variant="default"
                    size="default"
                    style={dynamicStyles.button}
                    onPress={onGetStarted}
                    accessibilityLabel="Empezar ahora con el ejercicio"
                    accessibilityHint="Navega a la pantalla de inicio de sesión o página principal"
                    fullWidth
                >
                    EMPIEZA AHORA
                </Button>
            </View>
        </SafeAreaView>
    );
}

// Función para crear estilos dinámicos
const createDynamicStyles = (screenDimensions: any) => {
    const { width, height, isLandscape, isTablet } = screenDimensions;

    return StyleSheet.create({
        container: {
            // Ajustar para orientación landscape
            ...(isLandscape && {
                flexDirection: 'row',
            }),
        },
        imageContainer: {
            width: isLandscape ? width * 0.5 : width,
            height: isLandscape ? height : height * (isTablet ? 0.55 : 0.65),
            ...(isLandscape && {
                flex: 1,
            }),
        },
        mainImage: {
            width: '100%',
            height: '100%',
        },
        imageOverlay: {
            height: isTablet ? 120 : 100,
        },
        contentContainer: {
            flex: isLandscape ? 1 : 1,
            paddingHorizontal: getResponsiveSize(isTablet ? 40 : 30, screenDimensions),
            paddingVertical: getResponsiveSize(isTablet ? 20 : 15, screenDimensions),
            paddingBottom: getResponsiveSize(isTablet ? 30 : 25, screenDimensions),
            justifyContent: 'flex-end',
            minHeight: isLandscape ? height : undefined,
            ...(isLandscape && {
                paddingTop: getResponsiveSize(20, screenDimensions),
                justifyContent: 'space-between',
            }),
        },
        textContainer: {
            alignItems: 'center',
            marginBottom: getResponsiveSize(isTablet ? 40 : 30, screenDimensions),
            ...(isLandscape && {
                flex: 1,
                justifyContent: 'center',
                marginBottom: 0,
            }),
        },
        title: {
            fontSize: getResponsiveSize(isTablet ? 38 : 28, screenDimensions),
            lineHeight: getResponsiveSize(isTablet ? 48 : 34, screenDimensions),
            marginBottom: getResponsiveSize(isLandscape ? 20 : (isTablet ? 60 : 40), screenDimensions),
            marginTop: getResponsiveSize(isLandscape ? 0 : (isTablet ? 20 : 15), screenDimensions),
            ...(isLandscape && {
                fontSize: getResponsiveSize(24, screenDimensions),
                lineHeight: getResponsiveSize(30, screenDimensions),
            }),
        },
        highlightedText: {
            fontSize: getResponsiveSize(isTablet ? 38 : 28, screenDimensions),
            ...(isLandscape && {
                fontSize: getResponsiveSize(24, screenDimensions),
            }),
        },
        subtitle: {
            fontSize: getResponsiveSize(isTablet ? 16 : 12, screenDimensions),
            lineHeight: getResponsiveSize(isTablet ? 24 : 18, screenDimensions),
            marginBottom: isLandscape ? getResponsiveSize(20, screenDimensions) : 0,
        },
        button: {
            marginTop: getResponsiveSize(5, screenDimensions),
            marginBottom: getResponsiveSize(5, screenDimensions),
            // Solo mantener el espaciado, el Button component maneja el resto
        },
    });
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    contentContainer: {
        backgroundColor: '#ffffff',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontWeight: '900',
        textAlign: 'center',
        color: '#0b0b09',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    highlightedText: {
        color: '#FF9500',
        fontWeight: '800',
    },
    subtitle: {
        textAlign: 'center',
        color: '#27272A',
        fontWeight: '400',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
});
