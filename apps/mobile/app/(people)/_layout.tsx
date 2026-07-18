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

export default function PeopleLayout() {
  const user = useAuthStore((s) => s.user);

  if (!user || (user.role !== 'people' && user.role !== 'student' && user.role !== 'ambassador')) {
    return <Redirect href="/" />;
  }

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
        name="events"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="opportunities"
        options={{
          title: 'Opportunities',
          tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="applications"
        options={{
          title: 'Applied',
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen name="tasks" options={{ href: null }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      {/* Hidden screens — navigable via router.push() but not in tab bar */}
      <Tabs.Screen name="wallet" options={{ href: null }} />
      <Tabs.Screen name="apply/[id]" options={{ href: null }} />
      <Tabs.Screen name="host-event" options={{ href: null }} />
      <Tabs.Screen name="campus-cartel" options={{ href: null }} />
      <Tabs.Screen name="my-tasks" options={{ href: null }} />
      <Tabs.Screen name="task/[id]" options={{ href: null }} />
      <Tabs.Screen name="leaderboard" options={{ href: null }} />
    </Tabs>
  );
}
