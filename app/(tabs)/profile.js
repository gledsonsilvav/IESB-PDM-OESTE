import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pickImage } from '../../services/media';

const PHOTO_KEY = '@profile-photo';

export default function ProfileScreen() {
  const [photoUri, setPhotoUri] = useState(null);

  useEffect(() => {
    async function loadPhoto() {
      const saved = await AsyncStorage.getItem(PHOTO_KEY);
      if (saved) setPhotoUri(saved);
    }
    loadPhoto();
  }, []);

  async function handlePickImage() {
    const uri = await pickImage();
    if (uri) {
      setPhotoUri(uri);
      await AsyncStorage.setItem(PHOTO_KEY, uri);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePickImage}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholder]}>
            <Text style={styles.placeholderText}>Escolher Foto</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 140, height: 140, borderRadius: 70 },
  placeholder: { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#333', fontSize: 14 },
});