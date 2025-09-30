import React from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useRouter } from 'expo-router'

export default function Profile() {
  const router = useRouter()

  // Placeholder data (replace later with real Firebase user info)
  const user = {
    name: "Crissy",
    username: "crislyn2025",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Welcome to Clickme ✨",
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        {/* Avatar */}
        <Image source={{ uri: user.avatar }} style={styles.avatar} />

        {/* User Info */}
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.bio}>{user.bio}</Text>

        {/* Buttons */}
        <TouchableOpacity style={styles.primary}>
          <Text style={styles.primaryText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primary, { backgroundColor: '#f10788', marginTop: 12 }]}
        >
          <Text style={styles.primaryText}>Photos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primary, { backgroundColor: '#f10788', marginTop: 12 }]}
        >
          <Text style={styles.primaryText}>Videos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primary, { backgroundColor: '#74b9ff', marginTop: 12 }]}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.primaryText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fefbf6' },
  container: { padding: 20, flex: 1, alignItems: 'center' },

  title: { fontSize: 20, color: '#5d5a88', marginBottom: 16, fontWeight: '700' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: '700', color: '#333' },
  username: { fontSize: 16, color: '#777' },
  bio: { fontSize: 14, marginTop: 6, textAlign: 'center', color: '#555' },

  primary: { padding: 14, backgroundColor: '#f10788', borderRadius: 12, alignItems: 'center', width: '80%', marginTop: 20 },
  primaryText: { color: '#fff', fontWeight: '600' },
})