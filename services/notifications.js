import { Platform } from 'react-native';

let Notifications = null;
try {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (error) {
  console.warn('Notifications não suportado inteiramente no Expo Go:', error.message);
}

export async function scheduleReminder(title, seconds = 10) {
  if (!Notifications) return;

  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    await Notifications.scheduleNotificationAsync({
      content: { title, body: 'Lembrete do CampusGo' },
      trigger: { seconds },
    });
  } catch (err) {
    console.warn('Erro ao agendar notificação:', err.message);
  }
}