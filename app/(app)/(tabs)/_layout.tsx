import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { MicButton } from '../../../src/components/MicButton';
import { router } from 'expo-router';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Today' }} />
        <Tabs.Screen name="weekly" options={{ title: 'Weekly' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      </Tabs>
      <View style={styles.micContainer}>
        <MicButton onPress={() => router.push('/(app)/voice-input')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: {
    height: 60,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  micContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    zIndex: 10,
  },
});
