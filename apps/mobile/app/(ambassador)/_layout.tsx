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

/**
 * Ambassador area.
 *
 * Was a Stack with no navigation into referrals/wallet/profile, and nothing
 * routed here in the first place — index.tsx sent ambassadors to (people)/events,
 * so the whole group was unreachable. Tabs make every screen reachable.
 */
export default function AmbassadorLayout() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);

  // Hold while the persisted session is still being restored. Redirecting here
  // on a not-yet-populated user is what bounced signed-in people to the login
  // screen; the root layout shows the splash overlay meanwhile.
  if (status === 'loading') return null;


  if (!user || user.role !== 'ambassador') return <Redirect href="/" />;

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
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="referrals"
        options={{
          title: 'Referrals',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
