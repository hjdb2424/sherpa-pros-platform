import { useState } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/lib/theme';
import { useNotificationListener } from '@/lib/notifications';

function TabIcon({ name, focused, badge }: { name: string; focused: boolean; badge?: number }) {
  const icons: Record<string, { outline: keyof typeof Ionicons.glyphMap; filled: keyof typeof Ionicons.glyphMap }> = {
    Map: { outline: 'map-outline', filled: 'map' },
    Jobs: { outline: 'briefcase-outline', filled: 'briefcase' },
    Messages: { outline: 'chatbubbles-outline', filled: 'chatbubbles' },
    Profile: { outline: 'person-outline', filled: 'person' },
    Emergency: { outline: 'alert-circle-outline', filled: 'alert-circle' },
  };
  const entry = icons[name] ?? { outline: 'ellipse-outline', filled: 'ellipse' };
  const iconName = focused ? entry.filled : entry.outline;
  const isEmergency = name === 'Emergency';
  const iconColor = focused
    ? isEmergency ? colors.danger : colors.primary
    : colors.textMuted;
  return (
    <View style={styles.tabIcon}>
      <View>
        {isEmergency && focused ? (
          <View style={styles.emergencyIconBg}>
            <Ionicons name={iconName} size={22} color={iconColor} />
          </View>
        ) : (
          <Ionicons name={iconName} size={22} color={iconColor} />
        )}
        {badge != null && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </View>
      <Text numberOfLines={1} style={[styles.tabLabel, focused && (isEmergency ? styles.tabLabelEmergency : styles.tabLabelActive)]}>{name}</Text>
    </View>
  );
}

export default function ClientLayout() {
  const [notifCount, setNotifCount] = useState(0);

  useNotificationListener(() => {
    setNotifCount((prev) => prev + 1);
  });

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
        name="my-jobs/index"
        options={{ title: 'Jobs', tabBarIcon: ({ focused }) => <TabIcon name="Jobs" focused={focused} badge={notifCount} /> }}
      />
      <Tabs.Screen
        name="my-jobs/[id]"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
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
        name="emergency"
        options={{ title: 'Emergency', tabBarIcon: ({ focused }) => <TabIcon name="Emergency" focused={focused} /> }}
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
      <Tabs.Screen
        name="referral"
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
    borderTopColor: colors.borderMedium,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 80,
    paddingBottom: 20,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8,
  },
  tabIcon: { alignItems: 'center', gap: 2, width: 60 },
  tabLabel: { fontSize: 9, fontWeight: '500', color: colors.textMuted, textAlign: 'center' },
  tabLabelActive: { color: colors.primary, fontWeight: '600' },
  tabLabelEmergency: { color: colors.danger, fontWeight: '600' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
  },
  emergencyIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
