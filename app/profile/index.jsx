import React, { useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image, TextInput, Modal, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Mock data for Instagram-style posts with real images
const mockPosts = [
  {
    id: '1',
    username: 'pet_photographer',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616c04c8eaf?w=40&h=40&fit=crop&crop=face',
    postImage: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
    caption: 'This beautiful tabby cat has the most mesmerizing eyes 😍 Perfect lighting made this shot magical ✨ #catphotography #pets #portraitphotography #catsofinstagram',
    likes: 1247,
    comments: [
      {
        id: 'c1',
        username: 'cat_lover_99',
        text: 'Absolutely gorgeous! 😻',
        timeAgo: '1h'
      },
      {
        id: 'c2',
        username: 'photography_fan',
        text: 'The lighting is perfect! Great shot 📸',
        timeAgo: '2h'
      }
    ],
    timeAgo: '2h',
    isLiked: false
  },
  {
    id: '2',
    username: 'wanderlust_adventures',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    caption: 'Mountain peaks touching the clouds ☁️ Nothing beats this view after a 6-hour hike! Worth every step 🥾 #mountains #hiking #nature #adventure #wanderlust',
    likes: 2156,
    comments: [
      {
        id: 'c3',
        username: 'hiker_joe',
        text: 'Which trail is this? Looks amazing!',
        timeAgo: '3h'
      }
    ],
    timeAgo: '5h',
    isLiked: true
  },
  {
    id: '3',
    username: 'foodie_chronicles',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    postImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
    caption: 'Homemade margherita pizza with fresh basil from my garden 🍕🌿 Recipe coming to my blog tomorrow! #homemade #pizza #cooking #foodblogger #italian',
    likes: 892,
    comments: [
      {
        id: 'c4',
        username: 'pizza_enthusiast',
        text: 'Looks delicious! Can\'t wait for the recipe 🤤',
        timeAgo: '4h'
      },
      {
        id: 'c5',
        username: 'garden_lover',
        text: 'Fresh basil makes all the difference!',
        timeAgo: '5h'
      }
    ],
    timeAgo: '8h',
    isLiked: false
  },
  {
    id: '4',
    username: 'ocean_vibes',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
    postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    caption: 'Golden hour at the beach never gets old 🌅 The waves were perfect for some surfing earlier! #beach #sunset #surfing #goldenhour #oceanlife',
    likes: 3241,
    comments: [
      {
        id: 'c6',
        username: 'surfer_dude',
        text: 'Epic sunset session! 🏄‍♂️',
        timeAgo: '12h'
      }
    ],
    timeAgo: '1d',
    isLiked: true
  },
  {
    id: '5',
    username: 'urban_explorer',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    postImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    caption: 'City lights reflecting on the water 🌃 Love exploring new places after dark, the city has a completely different energy! #cityscape #nightphotography #urban #lights',
    likes: 1567,
    comments: [],
    timeAgo: '2d',
    isLiked: false
  },
  {
    id: '6',
    username: 'coffee_culture',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    postImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    caption: 'Perfect latte art to start the morning ☕️ This local café always nails it! What\'s your go-to coffee order? #coffee #latteart #morning #café #coffeelover',
    likes: 756,
    comments: [
      {
        id: 'c7',
        username: 'caffeine_addict',
        text: 'Double espresso for me! ☕',
        timeAgo: '1d'
      }
    ],
    timeAgo: '3d',
    isLiked: true
  }
]

export default function InstagramFeed() {
  const router = useRouter()
  const [posts, setPosts] = useState(mockPosts)
  const [loading, setLoading] = useState(false)
  const [commentModalVisible, setCommentModalVisible] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false)
  const [editPostModalVisible, setEditPostModalVisible] = useState(false)
  const [newPostCaption, setNewPostCaption] = useState('')
  const [newPostImage, setNewPostImage] = useState('')
  const [postMenuVisible, setPostMenuVisible] = useState(null)
  // New state variables for Delete Confirmation Modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [postToDeleteId, setPostToDeleteId] = useState(null)

  const load = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts)
      setLoading(false)
    }, 1000)
  }

  useFocusEffect(
    React.useCallback(() => {
      load()
    }, [])
  )

  const logout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('currentUser')
          router.replace('/login')
        }
      }
    ])
  }

  const handleLike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    )
  }

  const handleComment = (post) => {
    setSelectedPost(post)
    setCommentModalVisible(true)
  }

  const handleShare = (post) => {
    Alert.alert('Share Post', `Share ${post.username}'s post?`, [
      { text: 'Cancel' },
      { text: 'Share', onPress: () => console.log('Post shared!') }
    ])
  }

  const submitComment = () => {
    if (commentText.trim() && selectedPost) {
      const newComment = {
        id: `c${Date.now()}`,
        username: 'current_user',
        text: commentText.trim(),
        timeAgo: 'now'
      }

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === selectedPost.id
            ? {
                ...post,
                comments: [...post.comments, newComment]
              }
            : post
        )
      )

      setSelectedPost(prev => ({
        ...prev,
        comments: [...prev.comments, newComment]
      }))

      setCommentText('')
      Alert.alert('Success', 'Comment added!')
    }
  }

  const handleCreatePost = () => {
    if (newPostCaption.trim()) {
      const newPost = {
        id: `${Date.now()}`,
        username: 'current_user',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
        postImage: newPostImage.trim() || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop',
        caption: newPostCaption.trim(),
        likes: 0,
        comments: [],
        timeAgo: 'now',
        isLiked: false
      }

      setPosts(prevPosts => [newPost, ...prevPosts])
      setNewPostCaption('')
      setNewPostImage('')
      setCreatePostModalVisible(false)
      Alert.alert('Success', 'Post created!')
    } else {
      Alert.alert('Error', 'Please enter a caption for your post')
    }
  }

  const handleEditPost = () => {
    if (newPostCaption.trim()) {
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === selectedPost.id
            ? {
                ...post,
                caption: newPostCaption.trim(),
                postImage: newPostImage.trim() || post.postImage
              }
            : post
        )
      )

      setNewPostCaption('')
      setNewPostImage('')
      setEditPostModalVisible(false)
      setSelectedPost(null)
      Alert.alert('Success', 'Post updated!')
    } else {
      Alert.alert('Error', 'Please enter a caption for your post')
    }
  }

  const openEditModal = (post) => {
    setPostMenuVisible(null)
    setSelectedPost(post)
    setNewPostCaption(post.caption)
    setNewPostImage(post.postImage)
    setEditPostModalVisible(true)
  }

  // --- START OF NEW/EDITED LOGIC FOR DELETE POST MODAL ---

  const confirmDeletePost = (postId) => {
    // Close the menu first
    setPostMenuVisible(null)
    // Set the ID of the post to delete and open the custom modal
    setPostToDeleteId(postId)
    setDeleteModalVisible(true)
  }

  const handleDeletePost = () => {
    if (postToDeleteId) {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postToDeleteId))
    }
    // Close the modal and reset the ID
    setDeleteModalVisible(false)
    setPostToDeleteId(null)
  }
  
  const handleCancelDelete = () => {
    // Close the modal and reset the ID
    setDeleteModalVisible(false)
    setPostToDeleteId(null)
  }

  // --- END OF NEW/EDITED LOGIC FOR DELETE POST MODAL ---


  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
          <View>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.timeAgo}>{item.timeAgo}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setPostMenuVisible(postMenuVisible === item.id ? null : item.id)}
        >
          <Text style={styles.moreText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Post Menu Dropdown */}
      {postMenuVisible === item.id && (
        <View style={styles.postMenu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openEditModal(item)}
          >
            <Text style={styles.menuIcon}>✏️</Text>
            <Text style={styles.menuText}>Edit Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, styles.deleteMenuItem]}
            onPress={() => confirmDeletePost(item.id)} // Calls the new logic
          >
            <Text style={styles.menuIcon}>🗑️</Text>
            <Text style={[styles.menuText, styles.deleteText]}>Delete Post</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Post Image */}
      <Image source={{ uri: item.postImage }} style={styles.postImage} />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <View style={styles.leftActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Text style={[styles.actionIcon, item.isLiked && styles.liked]}>
              {item.isLiked ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleComment(item)}
          >
            <Text style={styles.actionIcon}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShare(item)}
          >
            <Text style={styles.actionIcon}>📤</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🔖</Text>
        </TouchableOpacity>
      </View>

      {/* Likes Count */}
      <View style={styles.likesContainer}>
        <Text style={styles.likesText}>
          {item.likes} {item.likes === 1 ? 'like' : 'likes'}
        </Text>
      </View>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.captionText}>
          <Text style={styles.username}>{item.username}</Text> {item.caption}
        </Text>
      </View>

      {/* View Comments */}
      {item.comments.length > 0 && (
        <TouchableOpacity
          style={styles.viewCommentsButton}
          onPress={() => handleComment(item)}
        >
          <Text style={styles.viewCommentsText}>
            View all {item.comments.length} comments
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )

  // --- Delete Confirmation Modal Component ---
  const DeleteConfirmationModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={deleteModalVisible}
      onRequestClose={handleCancelDelete}
    >
      <View style={styles.deleteModalOverlay}>
        <View style={styles.deleteModalContent}>
          <Text style={styles.deleteModalTitle}>Are you sure to want to delete your post?</Text>
          <Text style={styles.deleteModalSubtitle}>This cannot be undone.</Text>
          <View style={styles.deleteModalButtons}>
            <TouchableOpacity
              style={styles.deleteButtonYes}
              onPress={handleDeletePost}
            >
              <Text style={styles.deleteButtonTextYes}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButtonNo}
              onPress={handleCancelDelete}
            >
              <Text style={styles.deleteButtonTextNo}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
  // ------------------------------------------

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Clickme</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setCreatePostModalVisible(true)}
          >
            <Text style={styles.headerIcon}>➕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={logout}>
            <Text style={styles.headerIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={load}
      />

      {/* Other Modals (Comment, Create Post, Edit Post) */}
      {/* ... (Your existing modal code for Comment Modal) ... */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentModalVisible}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity
                onPress={() => setCommentModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            <ScrollView style={styles.commentsScrollView}>
              {selectedPost && selectedPost.comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Text style={styles.commentText}>
                    <Text style={styles.commentUsername}>{comment.username}</Text> {comment.text}
                  </Text>
                  <Text style={styles.commentTime}>{comment.timeAgo}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity
                style={styles.postButton}
                onPress={submitComment}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Post Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={createPostModalVisible}
        onRequestClose={() => setCreatePostModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setCreatePostModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TouchableOpacity
                style={styles.postButton}
                onPress={handleCreatePost}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.createPostScroll}>
              <View style={styles.createPostContainer}>
                <TextInput
                  style={styles.captionTextInput}
                  placeholder="What's on your mind?"
                  value={newPostCaption}
                  onChangeText={setNewPostCaption}
                  multiline
                />

                <View style={styles.imageInputSection}>
                  <Text style={styles.sectionLabel}>Image URL:</Text>
                  <TextInput
                    style={styles.imageUrlInput}
                    placeholder="Enter image URL (https://...)"
                    value={newPostImage}
                    onChangeText={setNewPostImage}
                  />
                  {newPostImage ? (
                    <Image
                      source={{ uri: newPostImage }}
                      style={styles.previewImage}
                      onError={() => Alert.alert('Error', 'Invalid image URL')}
                    />
                  ) : null}
                </View>

                <View style={styles.mediaOptionsContainer}>
                  <TouchableOpacity style={styles.mediaOption}>
                    <Text style={styles.mediaIcon}>🖼️</Text>
                    <Text style={styles.mediaText}>Add Photo/Video</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.mediaOption}>
                    <Text style={styles.mediaIcon}>🎬</Text>
                    <Text style={styles.mediaText}>Reels</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Post Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editPostModalVisible}
        onRequestClose={() => setEditPostModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => {
                  setEditPostModalVisible(false)
                  setNewPostCaption('')
                  setNewPostImage('')
                  setSelectedPost(null)
                }}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Post</Text>
              <TouchableOpacity
                style={styles.postButton}
                onPress={handleEditPost}
              >
                <Text style={styles.postButtonText}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.createPostScroll}>
              <View style={styles.createPostContainer}>
                <TextInput
                  style={styles.captionTextInput}
                  placeholder="What's on your mind?"
                  value={newPostCaption}
                  onChangeText={setNewPostCaption}
                  multiline
                />

                <View style={styles.imageInputSection}>
                  <Text style={styles.sectionLabel}>Image URL:</Text>
                  <TextInput
                    style={styles.imageUrlInput}
                    placeholder="Enter image URL (https://...)"
                    value={newPostImage}
                    onChangeText={setNewPostImage}
                  />
                  {newPostImage ? (
                    <Image
                      source={{ uri: newPostImage }}
                      style={styles.previewImage}
                      onError={() => Alert.alert('Error', 'Invalid image URL')}
                    />
                  ) : null}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Render the new Delete Confirmation Modal */}
      <DeleteConfirmationModal />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fcfcfc86'
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0'
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'cursive'
  },
  headerActions: {
    flexDirection: 'row'
  },
  headerButton: {
    marginLeft: 16
  },
  headerIcon: {
    fontSize: 24
  },

  // Post Styles
  postContainer: {
    marginBottom: 16,
    backgroundColor: '#ffffffff'
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000'
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  moreButton: {
    padding: 8
  },
  moreText: {
    fontSize: 20,
    color: '#666'
  },

  // Post Menu Dropdown
  postMenu: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    minWidth: 150
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0'
  },
  deleteMenuItem: {
    borderBottomWidth: 0
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12
  },
  menuText: {
    fontSize: 16,
    color: '#000'
  },
  deleteText: {
    color: '#ff3b30'
  },

  // Post Image
  postImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover'
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  leftActions: {
    flexDirection: 'row'
  },
  actionButton: {
    marginRight: 16
  },
  actionIcon: {
    fontSize: 24
  },
  liked: {
    color: '#ff3040'
  },

  // Likes and Caption
  likesContainer: {
    paddingHorizontal: 16,
    marginBottom: 8
  },
  likesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000'
  },
  captionContainer: {
    paddingHorizontal: 16,
    marginBottom: 8
  },
  captionText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 18
  },
  viewCommentsButton: {
    paddingHorizontal: 16,
    marginBottom: 12
  },
  viewCommentsText: {
    fontSize: 14,
    color: '#666'
  },

  // Generic Modals Styles (Comment, Create, Edit)
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    height: '70%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000'
  },
  closeButton: {
    padding: 8
  },
  closeText: {
    fontSize: 18,
    color: '#666'
  },
  commentsScrollView: {
    flex: 1,
    paddingHorizontal: 16
  },
  commentItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0'
  },
  commentText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 18,
    marginBottom: 4
  },
  commentUsername: {
    fontWeight: '600'
  },
  commentTime: {
    fontSize: 12,
    color: '#666'
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0'
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    marginRight: 12
  },
  postButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600'
  },

  // Create Post Modal Styles
  cancelButton: {
    padding: 8
  },
  cancelText: {
    fontSize: 16,
    color: '#007bff'
  },
  createPostScroll: {
    flex: 1
  },
  createPostContainer: {
    padding: 16
  },
  captionTextInput: {
    fontSize: 16,
    color: '#000',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20
  },
  imageInputSection: {
    marginBottom: 20
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8
  },
  imageUrlInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    resizeMode: 'cover'
  },
  mediaOptionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16
  },
  mediaOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12
  },
  mediaIcon: {
    fontSize: 24,
    marginRight: 12
  },
  mediaText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500'
  },

  // --- NEW DELETE CONFIRMATION MODAL STYLES ---
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '85%', // Make it prominent
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 5,
  },
  deleteModalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  deleteButtonYes: {
    flex: 1,
    backgroundColor: '#007bff', // Red for Delete
    borderRadius: 10,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  deleteButtonTextYes: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButtonNo: {
    flex: 1,
    backgroundColor: '#fff', // White/clear background for Cancel
    borderRadius: 10,
    paddingVertical: 12,
    marginLeft: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  deleteButtonTextNo: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  }
  // --- END NEW DELETE CONFIRMATION MODAL STYLES ---
})