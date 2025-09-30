import React from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native'
import { useRouter, Stack } from 'expo-router'

export default function Home() {
  const router = useRouter()

  return (
    <>
      {/* Hide the default header that shows "Index" */}
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safe}>
          <View style={styles.container}>
            {/* Logo Image */}
            <Image
              source={require('../assets/images/clickmelogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Logo / Brand */}
            <Text style={styles.brand}>Clickme</Text>
            <Text style={styles.tagline}>Post. Connect. Inspire.</Text>

            {/* Login button */}
            <TouchableOpacity
              style={[styles.primary, styles.shadowPrimary]}
              onPress={() => router.push('/login')}
              accessibilityLabel="Go to Login"
            >
              <Text style={styles.primaryText}>Login</Text>
            </TouchableOpacity>

            {/* Signup button */}
            <TouchableOpacity
              style={[styles.secondary, styles.shadowSecondary]}
              onPress={() => router.push('/signup')}
              accessibilityLabel="Go to Signup"
            >
              <Text style={styles.secondaryText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safe: {
    flex: 1,
    backgroundColor: 'transparent', // Changed to transparent to show background
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  brand: {
    fontSize: 48,
    marginBottom: 8,
    color: '#f10788ff', // A deep charcoal for contrast
    fontWeight: '700',
  },
  tagline: {
    fontSize: 18,
    marginBottom: 48,
    color: '#4a4a4a', // A softer gray for the tagline
    fontWeight: '500',
  },
  primary: {
    width: '80%',
    paddingVertical: 18,
    paddingHorizontal: 32,
    backgroundColor: '#d44c8c', // The main button color from your original code
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  shadowPrimary: {
    // This creates a subtle shadow for a "lifted" effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8, // For Android
  },
  secondary: {
    width: '80%',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d44c8c',
    backgroundColor: '#fff',
  },
  secondaryText: {
    color: '#d44c8c',
    fontSize: 18,
    fontWeight: '700',
  },
  shadowSecondary: {
    // A lighter shadow for the secondary button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4, // For Android
  },
})