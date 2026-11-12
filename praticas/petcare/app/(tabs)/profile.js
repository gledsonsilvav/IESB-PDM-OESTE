import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { getUserPets } from '../../services/petService';
import { getUserHealthRecords } from '../../services/healthService';
import { getUserLocations } from '../../services/locationService';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ pets: 0, health: 0, locations: 0 });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        if (!user) return;
        try {
          setLoading(true);
          const [petsData, healthData, locationsData] = await Promise.all([
            getUserPets(user.uid),
            getUserHealthRecords(user.uid),
            getUserLocations(user.uid),
          ]);
          setStats({
            pets: petsData.length,
            health: healthData.length,
            locations: locationsData.length,
          });
        } catch (error) {
          console.error('Erro ao carregar estatísticas:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }, [user])
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert('Não foi possível encerrar a sessão.');
      } else {
        Alert.alert('Erro', 'Não foi possível encerrar a sessão.');
      }
    }
  };

  const displayName = user?.email ? user.email.split('@')[0] : 'Tutor';

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {displayName.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.name}>{displayName}</Text>
      <Text style={styles.email}>{user?.email || 'Sessão ativa'}</Text>

      {loading ? (
        <ActivityIndicator size="small" color="#4CAF50" style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.pets}</Text>
            <Text style={styles.statLabel}>Pets</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.health}</Text>
            <Text style={styles.statLabel}>Saúde</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.locations}</Text>
            <Text style={styles.statLabel}>Locais</Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Terminar Sessão</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8F9FA',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarText: { color: '#FFF', fontSize: 34, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333', textTransform: 'capitalize' },
  email: { fontSize: 15, color: '#666', marginTop: 4, marginBottom: 24 },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: '100%',
    maxWidth: 400,
    justifyContent: 'space-around',
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#4CAF50' },
  statLabel: { fontSize: 13, color: '#666', marginTop: 4 },
  logoutButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  logoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});