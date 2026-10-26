import * as Location from 'expo-location';
import { Alert } from 'react-native';

export async function getCurrentPlace() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permissão negada', 'Não foi possível obter acesso à sua localização.');
    return null;
  }

  const loc = await Location.getCurrentPositionAsync({});
  const reverse = await Location.reverseGeocodeAsync({
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
  });

  if (reverse.length > 0) {
    const item = reverse[0];
    return { label: `${item.street || item.name || 'Local'}, ${item.city || ''}` };
  }
  return { label: 'Localização obtida' };
}