import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Map: '\u{1F5FA}\uFE0F',
    Jobs: '\u{1F527}',
    Earnings: '\u{1F4B0}',
    Messages: '\u{1F4AC}',
    Profile: '\u{1F464}',
  };
  return (
    <View style={styles.tabIcon}>
      <Text style={{ fontSize: 20 }}>{icons[name] ?? '\u2022'}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{name}</Text>
    </View>
  );
}

export default function ProLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Map', tabBarIcon: ({ focused }) => <TabIcon name="Map" focused={focused} /> }}
      />
      <Tabs.Screen
        name="jobs"
        options={{ title: 'Jobs', tabBarIcon: ({ focused }) => <TabIcon name="Jobs" focused={focused} /> }}
      />
      <Tabs.Screen
        name="earnings"
        options={{ title: 'Earnings', tabBarIcon: ({ focused }) => <TabIcon name="Earnings" focused={focused} /> }}
      />
      <Tabs.Screen
        name="messages"
        options={{ title: 'Messages', tabBarIcon: ({ focused }) => <TabIcon name="Messages" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.borderLight,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabIcon: { alignItems: 'center', gap: 2 },
  tabLabel: { fontSize: 10, fontWeight: '500', color: colors.textMuted },
  tabLabelActive: { color: colors.primary, fontWeight: '600' },
});
