import React, { useState, useLayoutEffect } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter, useNavigation } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../src/services/firebaseConfig'   // make sure this path is correct
import { doc, getDoc } from 'firebase/firestore'

export default function Login() {
  const router = useRouter()
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  const showModal = (message) => {
    setModalMessage(message)
    setModalVisible(true)
  }

  const handleLogin = async () => {
    if (!email || !password) {
      return showModal('Please enter both email and password.')
    }

    setLoading(true)
    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password)
      const user = userCredential.user

      // Fetch extra user info from Firestore (if exists)
      let userData = { id: user.uid, name: user.email, email: user.email }
      try {
        const userDocRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userDocRef)
        if (userSnap.exists()) {
          const d = userSnap.data()
          userData = {
            id: user.uid,
            name: d.fullname ?? d.name ?? user.email,
            email: d.email ?? user.email
          }
        }
      } catch (fireErr) {
        console.warn('Failed to fetch Firestore user doc:', fireErr)
      }

      // Save to AsyncStorage for app session
      await AsyncStorage.setItem('currentUser', JSON.stringify(userData))

      setLoading(false)
      // ✅ FIXED: redirect to /profile after login
      router.replace('/profile')
    } catch (err) {
      setLoading(false)
      console.error('Login error:', err)
      const code = err?.code ?? ''
      if (code === 'auth/wrong-password') {
        showModal('Invalid email or password.')
      } else if (code === 'auth/user-not-found') {
        showModal('No account found with this email.')
      } else if (code === 'auth/invalid-email') {
        showModal('Invalid email address.')
      } else {
        showModal(err?.message ?? 'An error occurred. Could not log in.')
      }
    }
  }

  return (
    <SafeAreaView style={l.safe}>
      <View style={l.container}>
        <Text style={l.title}>Welcome back</Text>
        <Text style={l.subtitle}>Log in to continue</Text>

        <View style={l.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={l.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={l.input}
          />
        </View>

        <TouchableOpacity style={[l.button, l.shadowButton]} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={l.buttonText}>Log in</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/signup')} style={l.link}>
          <Text style={l.linkText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Modal for alerts */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={l.modalBackground}>
          <View style={l.modalView}>
            <Text style={l.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={l.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={l.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const l = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fde2e4' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#4a4a4a', marginBottom: 40 },
  inputContainer: { width: '100%', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#d4c9d9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '80%',
    paddingVertical: 18,
    paddingHorizontal: 32,
    backgroundColor: '#d44c8c',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  shadowButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  link: { marginTop: 12 },
  linkText: { color: '#d44c8c', fontSize: 16, fontWeight: '600' },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: { marginBottom: 15, textAlign: 'center', fontSize: 16 },
  modalButton: { backgroundColor: '#d44c8c', borderRadius: 20, padding: 10, elevation: 2, minWidth: 100, alignItems: 'center' },
  modalButtonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
})
