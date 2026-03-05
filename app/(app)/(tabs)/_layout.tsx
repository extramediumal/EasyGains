import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MicButton } from '../../../src/components/MicButton';
import { router } from 'expo-router';
import { Colors } from '../../../src/lib/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: [styles.tabBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 8, height: 60 + (insets.bottom > 0 ? insets.bottom : 0) }],
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Today',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="today-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="weekly"
          options={{
            title: 'Weekly',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <View style={[styles.micContainer, { bottom: insets.bottom + 60 }]}>
        <MicButton onPress={() => router.push('/(app)/voice-input')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  micContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  },
});
