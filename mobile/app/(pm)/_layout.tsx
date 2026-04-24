import { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/lib/theme';
import { useNotificationListener } from '@/lib/notifications';
import { t, onLanguageChange } from '@/lib/i18n';

function TabIcon({ name, focused, badge, iconKey }: { name: string; focused: boolean; badge?: number; iconKey?: string }) {
  const icons: Record<string, { outline: keyof typeof Ionicons.glyphMap; filled: keyof typeof Ionicons.glyphMap }> = {
    finance: { outline: 'stats-chart-outline', filled: 'stats-chart' },
    properties: { outline: 'business-outline', filled: 'business' },
    pros: { outline: 'map-outline', filled: 'map' },
    'work orders': { outline: 'construct-outline', filled: 'construct' },
    more: { outline: 'menu-outline', filled: 'menu' },
  };
  const key = iconKey ?? name.toLowerCase();
  const entry = icons[key] ?? { outline: 'ellipse-outline', filled: 'ellipse' };
  const iconName = focused ? entry.filled : entry.outline;
  return (
    <View style={styles.tabIcon}>
      <View>
        <Ionicons name={iconName} size={22} color={focused ? colors.primary : colors.textMuted} />
        {badge != null && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </View>
      <Text numberOfLines={1} style={[styles.tabLabel, focused && styles.tabLabelActive]}>{name}</Text>
    </View>
  );
}

export default function PMLayout() {
  const [woCount] = useState(3); // Mock: 3 open urgent work orders
  const [, setLangTick] = useState(0);

  useEffect(() => {
    return onLanguageChange(() => setLangTick((n) => n + 1));
  }, []);

  useNotificationListener(() => {
    // Handle notifications for PM
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
        name="pros"
        options={{
          title: 'Pros',
          tabBarIcon: ({ focused }) => <TabIcon name="Pros" iconKey="pros" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="properties/index"
        options={{
          title: 'Properties',
          tabBarIcon: ({ focused }) => <TabIcon name="Properties" iconKey="properties" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="properties/[id]"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Finance',
          tabBarIcon: ({ focused }) => <TabIcon name="Finance" iconKey="finance" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="work-orders"
        options={{
          title: 'Maintenance',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Maint." iconKey="work orders" focused={focused} badge={woCount} />
          ),
        }}
      />
      <Tabs.Screen
        name="work-order-detail"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ focused }) => <TabIcon name="More" iconKey="more" focused={focused} />,
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
});
