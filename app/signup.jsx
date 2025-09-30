import React, { useState, useLayoutEffect } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter, useNavigation } from 'expo-router'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../src/services/firebaseConfig"
import { doc, setDoc } from "firebase/firestore"

export default function Signup() {
  const router = useRouter()
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const showModal = (message) => {
    setModalMessage(message)
    setModalVisible(true)
  }

  const handleSignup = async () => {
    if (!email || !password || !name) {
      return showModal('All fields are required.')
    }
    setLoading(true)
    try {
      // ✅ Create account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // ✅ Save user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullname: name,
        email: email,
        createdAt: new Date()
      })

      // ✅ Save session locally
      const newUser = { id: user.uid, name: name, email }
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser))

      setLoading(false)
      showModal('Account created successfully!')

      setTimeout(() => {
        router.replace('/tasks')
      }, 1000)

    } catch (err) {
      setLoading(false)
      console.log("Signup error:", err) // 🔎 Debug in Expo logs

      if (err.code === 'auth/email-already-in-use') {
        showModal('This email is already registered. Please log in.')
      } else if (err.code === 'auth/invalid-email') {
        showModal('Invalid email address.')
      } else if (err.code === 'auth/weak-password') {
        showModal('Password should be at least 6 characters.')
      } else if (err.code === 'permission-denied') {
        showModal('Firestore permission denied. Check your Firebase rules.')
      } else {
        showModal(err.message) // ✅ show the exact Firebase error
      }
    }
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <Text style={s.title}>Create an account</Text>
        <Text style={s.subtitle}>Join our community</Text>

        <View style={s.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={s.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={s.input}
          />
        </View>

        <TouchableOpacity style={[s.button, s.shadowButton]} onPress={handleSignup} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.buttonText}>Sign up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/login')} style={s.link}>
          <Text style={s.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={s.modalBackground}>
          <View style={s.modalView}>
            <Text style={s.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={s.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={s.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fde2e4',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#4a4a4a',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  shadowButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  link: {
    marginTop: 12,
  },
  linkText: {
    color: '#d44c8c',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#d44c8c',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
