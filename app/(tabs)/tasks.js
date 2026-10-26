import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { getCurrentPlace } from '../../services/location';
import { scheduleReminder } from '../../services/notifications';

export default function TasksScreen() {
  const [placeLabel, setPlaceLabel] = useState('');

  async function handleCheckIn() {
    const place = await getCurrentPlace();
    if (place) setPlaceLabel(place.label);
  }

  async function handleConclude() {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      // Ignora erro no emulador/navegador
    }
    Alert.alert('Sucesso', 'Tarefa concluída');
  }

  return (
    <View style={styles.container}>
      <Button title="Nova Tarefa (Modal)" onPress={() => router.push('/new-task')} />
      <View style={styles.spacer} />
      <Button title="Abrir Tarefa #42" onPress={() => router.push('/task/42')} />
      <View style={styles.spacer} />
      <Button title="Estudei aqui" onPress={handleCheckIn} />
      {!!placeLabel && <Text style={styles.placeText}>{placeLabel}</Text>}
      <View style={styles.spacer} />
      <Button title="Lembrar em 10 s" onPress={() => scheduleReminder('Hora de estudar!', 10)} />
      <View style={styles.spacer} />
      <Button title="Concluir" onPress={handleConclude} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  spacer: { height: 12 },
  placeText: { marginTop: 8, textAlign: 'center', color: '#7209b7', fontWeight: 'bold' },
});