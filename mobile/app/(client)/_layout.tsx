import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/lib/theme';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
    Map: 'map-outline',
    Jobs: 'briefcase-outline',
    Messages: 'chatbubbles-outline',
    Profile: 'person-outline',
  };
  const iconName = icons[name] ?? 'ellipse-outline';
  return (
    <View style={styles.tabIcon}>
      <Ionicons name={iconName} size={22} color={focused ? colors.primary : colors.textMuted} />
      <Text numberOfLines={1} style={[styles.tabLabel, focused && styles.tabLabelActive]}>{name}</Text>
    </View>
  );
}

export default function ClientLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Map', tabBarIcon: ({ focused }) => <TabIcon name="Map" focused={focused} /> }}
      />
      <Tabs.Screen
        name="my-jobs"
        options={{ title: 'Jobs', tabBarIcon: ({ focused }) => <TabIcon name="Jobs" focused={focused} /> }}
      />
      <Tabs.Screen
        name="messages"
        options={{ title: 'Messages', tabBarIcon: ({ focused }) => <TabIcon name="Messages" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} /> }}
      />
      <Tabs.Screen
        name="post-job/index"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
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
  tabIcon: { alignItems: 'center', gap: 2, width: 60 },
  tabLabel: { fontSize: 9, fontWeight: '500', color: colors.textMuted, textAlign: 'center' },
  tabLabelActive: { color: colors.primary, fontWeight: '600' },
});
