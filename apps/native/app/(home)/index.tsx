import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useQuery } from "convex/react"
import { api } from "@ehc-gym/backend/convex/api"
import SignOutButton from '../components/auth/SignOutButton'

export default function HomePage() {
    const { user } = useUser()
    const tasks = useQuery(api.tasks.get)

    return (
        <ScrollView style={styles.container}>
            <SignedIn>
                <View style={styles.content}>
                    <Text style={styles.title}>
                        Welcome to EHC Gym!
                    </Text>
                    <Text style={styles.subtitle}>
                        Hello {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'User'}
                    </Text>

                    {/* Tasks Section */}
                    <View style={styles.tasksSection}>
                        <Text style={styles.sectionTitle}>Your Tasks</Text>
                        <Text style={styles.tasksCount}>
                            Tasks: {tasks?.length ?? "Loading..."}
                        </Text>

                        {tasks && tasks.length > 0 ? (
                            <View style={styles.tasksList}>
                                {tasks.map((task, index) => (
                                    <View key={task._id} style={styles.taskItem}>
                                        <Text style={styles.taskText}>
                                            {index + 1}. {task.text}
                                        </Text>
                                        <Text style={styles.taskStatus}>
                                            {task.completed ? "✅" : "⏳"}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ) : tasks && tasks.length === 0 ? (
                            <Text style={styles.noTasks}>No tasks yet. Start your fitness journey!</Text>
                        ) : null}
                    </View>

                    <View style={styles.signOutContainer}>
                        <SignOutButton />
                    </View>
                </View>
            </SignedIn>

            <SignedOut>
                <View style={styles.content}>
                    <Text style={styles.title}>
                        Welcome to EHC Gym
                    </Text>
                    <Text style={styles.subtitle}>
                        Your fitness journey starts here
                    </Text>
                    <View style={styles.authButtons}>
                        <Link href="../(auth)/sign-in" asChild>
                            <TouchableOpacity style={styles.signInButton}>
                                <Text style={styles.buttonText}>
                                    Sign in
                                </Text>
                            </TouchableOpacity>
                        </Link>
                        <Link href="../(auth)/sign-up" asChild>
                            <TouchableOpacity style={styles.signUpButton}>
                                <Text style={styles.buttonText}>
                                    Sign up
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </SignedOut>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
        color: '#666',
    },
    tasksSection: {
        width: '100%',
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    tasksCount: {
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center',
        color: '#666',
    },
    tasksList: {
        width: '100%',
    },
    taskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 15,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    taskText: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    taskStatus: {
        fontSize: 16,
        marginLeft: 10,
    },
    noTasks: {
        textAlign: 'center',
        color: '#888',
        fontStyle: 'italic',
        marginTop: 20,
    },
    authButtons: {
        gap: 15,
        width: '100%',
        maxWidth: 300,
    },
    signInButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    signUpButton: {
        backgroundColor: '#34C759',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    signOutContainer: {
        marginTop: 20,
    },
});