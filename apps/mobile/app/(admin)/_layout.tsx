import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/auth.store';

const TAB_BAR_STYLE = {
  backgroundColor: '#FFFFFF',
  borderTopWidth: 1,
  borderTopColor: '#E7E7E0',
  height: 66,
  paddingBottom: 10,
  paddingTop: 8,
};

const LABEL_STYLE = {
  fontSize: 10,
  fontWeight: '700' as const,
  letterSpacing: 0.3,
  marginTop: 3,
};

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);

  if (!user || user.role !== 'admin') return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0E0E0E',
        tabBarInactiveTintColor: '#9AA09A',
        tabBarStyle: TAB_BAR_STYLE,
        tabBarLabelStyle: LABEL_STYLE,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: 'People',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="unfiltered"
        options={{
          title: 'Unfiltered',
          tabBarIcon: ({ color, size }) => <Ionicons name="videocam-outline" size={size} color={color} />,
        }}
      />
      {/* Hidden screens — navigable via router.push() but not shown in tab bar */}
      <Tabs.Screen name="ambassador-codes" options={{ href: null }} />
      <Tabs.Screen name="create-task" options={{ href: null }} />
      <Tabs.Screen name="event-detail/[id]" options={{ href: null }} />
      <Tabs.Screen name="person-detail/[id]" options={{ href: null }} />
      <Tabs.Screen name="host-app-detail/[id]" options={{ href: null }} />
      <Tabs.Screen name="campus-cartel" options={{ href: null }} />
    </Tabs>
  );
}
