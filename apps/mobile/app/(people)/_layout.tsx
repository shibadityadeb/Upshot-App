import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/auth.store';
import { useTabBarStyle, TAB_LABEL_STYLE } from '../../src/hooks/useTabBarStyle';

export default function PeopleLayout() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const tabBarStyle = useTabBarStyle();

  // Hold while the persisted session is still being restored. Redirecting here
  // on a not-yet-populated user is what bounced signed-in people to the login
  // screen; the root layout shows the splash overlay meanwhile.
  if (status === 'loading') return null;


  if (!user || (user.role !== 'people' && user.role !== 'student' && user.role !== 'ambassador')) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0E0E0E',
        tabBarInactiveTintColor: '#9AA09A',
        tabBarStyle,
        tabBarLabelStyle: TAB_LABEL_STYLE,
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
          title: 'Workshops',
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
      <Tabs.Screen name="sponsor/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="host-event" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="campus-cartel" options={{ href: null }} />
      <Tabs.Screen name="my-tasks" options={{ href: null }} />
      <Tabs.Screen name="task/[id]" options={{ href: null }} />
    </Tabs>
  );
}
