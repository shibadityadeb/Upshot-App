import { Redirect, Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useAuthStore } from '../../src/store/auth.store';
import { colors } from '../../src/constants/theme';

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);

  if (!user || user.role !== 'admin') return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text> }}
      />
      <Tabs.Screen
        name="events"
        options={{ title: 'Events', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📅</Text> }}
      />
      <Tabs.Screen
        name="people"
        options={{ title: 'People', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👥</Text> }}
      />
      <Tabs.Screen
        name="tasks"
        options={{ title: 'Tasks', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>✅</Text> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚙️</Text> }}
      />
    </Tabs>
  );
}
