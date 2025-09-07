import React, { useState } from 'react'
import {
    View,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Alert,
    Image,
} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useMutation } from "convex/react"
import { api } from "@ehc-gym/backend/convex/api"
import {
    Text,
    Input,
    PasswordInput,
    DateInput,
    PhoneInput,
    Button,
    SeparatorWithText
} from '../components/ui'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()
    const createUser = useMutation(api.user.mutation.createUser)

    // Form state
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        fechaNacimiento: '',
        telefono: '',
        contrasena: '',
        nombreContactoEmergencia: '',
        telefonoContactoEmergencia: '',
        codigoPais: '+57', // Colombia por defecto
    })

    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return

        // Validaciones básicas
        if (!formData.nombres || !formData.apellidos || !formData.email || !formData.contrasena) {
            Alert.alert('Error', 'Por favor completa todos los campos obligatorios')
            return
        }

        if (!formData.fechaNacimiento) {
            Alert.alert('Error', 'Por favor ingresa tu fecha de nacimiento')
            return
        }

        if (!formData.telefono) {
            Alert.alert('Error', 'Por favor ingresa tu número de teléfono')
            return
        }

        setLoading(true)

        try {
            await signUp.create({
                emailAddress: formData.email,
                password: formData.contrasena,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setPendingVerification(true)
        } catch (err: any) {
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
            const signUpAttempt = await signUp.attemptEmailAddressVerification({ code })

            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })

                // Guardar información del usuario en Convex
                try {
                    await createUser({
                        name: formData.nombres,
                        last_name: formData.apellidos,
                        email: formData.email,
                        birthday: formData.fechaNacimiento,
                        phone: formData.telefono,
                        country_code: formData.codigoPais,
                        contact_emergency_name: formData.nombreContactoEmergencia,
                        contact_emergency_phone: formData.telefonoContactoEmergencia,
                    })

                    console.log('Usuario guardado exitosamente en Convex')
                } catch (convexError) {
                    console.error('Error al guardar usuario en Convex:', convexError)
                    // No mostramos error al usuario porque ya está autenticado
                    // pero podríamos implementar un retry o mostrar una notificación
                }

                router.replace('/(home)')
            } else {
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err: any) {
            Alert.alert('Error', err.errors?.[0]?.message || 'An error occurred during verification')
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignUp = () => {
        Alert.alert('Google Sign Up', 'Funcionalidad de Google Sign Up en desarrollo')
    }

    const handleGoBack = () => {
        router.back()
    }

    // Verification screen
    if (pendingVerification) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#663d00" barStyle="light-content" />

                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>

                    <Text variant="h2" color="white" style={styles.headerTitle}>
                        Verificar Email
                    </Text>

                    <Text color="white" style={styles.subHeader}>
                        Ingresa el código que enviamos a tu email
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Input
                        value={code}
                        onChangeText={setCode}
                        placeholder="Código de verificación"
                        label="Código de verificación"
                        keyboardType="number-pad"
                    />

                    <Button
                        onPress={onVerifyPress}
                        loading={loading}
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? 'Verificando...' : 'Verificar'}
                    </Button>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#663d00" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <ArrowLeft size={24} color="white" />
                </TouchableOpacity>

                <Text variant="h2" color="white" style={styles.headerTitle}>
                    Regístrate
                </Text>

                <View style={styles.loginLink}>
                    <Text color="white" style={styles.loginText}>
                        ¿Ya tienes una cuenta?
                    </Text>
                    <Link href="./sign-in" asChild>
                        <TouchableOpacity>
                            <Text color="white" style={styles.loginButton}> Ingresar</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>

            {/* Form */}
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                {/* Nombres y Apellidos */}
                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Input
                            label="Nombres"
                            placeholder="Lois"
                            value={formData.nombres}
                            onChangeText={(text) => handleInputChange('nombres', text)}
                        />
                    </View>

                    <View style={styles.halfInput}>
                        <Input
                            label="Apellidos"
                            placeholder="Becket"
                            value={formData.apellidos}
                            onChangeText={(text) => handleInputChange('apellidos', text)}
                        />
                    </View>
                </View>

                {/* Email */}
                <Input
                    label="Email"
                    placeholder="Loisbecket@gmail.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                />

                {/* Fecha de cumpleaños */}
                <DateInput
                    label="Fecha de cumpleaños"
                    placeholder="18/03/2024"
                    value={formData.fechaNacimiento}
                    onChangeText={(text) => handleInputChange('fechaNacimiento', text)}
                />

                {/* Número de celular */}
                <PhoneInput
                    label="Número de celular"
                    placeholder="3197293579"
                    value={formData.telefono}
                    onChangeText={(text) => handleInputChange('telefono', text)}
                />

                {/* Contraseña */}
                <PasswordInput
                    label="Contraseña"
                    value={formData.contrasena}
                    onChangeText={(text) => handleInputChange('contrasena', text)}
                />

                {/* Datos de contacto de emergencia */}
                <Text variant="h3" style={styles.sectionTitle}>
                    Datos de contacto de emergencia
                </Text>

                <Input
                    label="Nombre del contacto"
                    placeholder="María Becket"
                    value={formData.nombreContactoEmergencia}
                    onChangeText={(text) => handleInputChange('nombreContactoEmergencia', text)}
                />

                <PhoneInput
                    label="Teléfono del contacto"
                    placeholder="3197293580"
                    value={formData.telefonoContactoEmergencia}
                    onChangeText={(text) => handleInputChange('telefonoContactoEmergencia', text)}
                />

                {/* Botón de registro */}
                <Button
                    onPress={onSignUpPress}
                    loading={loading}
                    disabled={loading}
                    fullWidth
                    style={styles.registerButton}
                >
                    Regístrate
                </Button>

                {/* Separador OR */}
                <SeparatorWithText text="O" />

                {/* Botón Google */}
                <Button
                    variant="outline"
                    onPress={handleGoogleSignUp}
                    fullWidth
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
                    Regístrate con Google
                </Button>

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#663d00',
    },
    header: {
        backgroundColor: '#663d00',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 30,
    },
    backButton: {
        marginBottom: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        marginBottom: 8,
    },
    subHeader: {
        opacity: 0.8,
        fontSize: 20,
    },
    loginLink: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    loginText: {
        opacity: 0.8,
        fontSize: 16,
    },
    loginButton: {
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
        marginLeft: 5,
    },
    formContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    sectionTitle: {
        marginTop: 20,
        marginBottom: 16,
        color: '#333',
    },
    registerButton: {
        marginTop: 10,
        marginBottom: 30,
    },
    googleButton: {
        marginBottom: 20,
    },
    googleIcon: {
        width: 20,
        height: 20,
    },
    bottomSpacing: {
        height: 40,
    },
})