import { Tabs, router, usePathname } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBarButton } from '@/lib/components/app-bar-button';
import { AppEvents } from '@/lib/events';
import { useAdaptiveColors } from '@/lib/hooks/use-adaptive-colors';
import { Cog } from '@/lib/components/icons/cog';
import { Plus } from '@/lib/components/icons/plus';
import { Feather } from '@expo/vector-icons';

function NavBar() {
  const [showCompleted, setShowCompleted] = useState(true);
  const colors = useAdaptiveColors();
  const pathname = usePathname();

  const handleToggle = () => {
    const next = !showCompleted;
    setShowCompleted(next);
    AppEvents.emit('TOGGLE_COMPLETED', { show: next });
  };

  // Indicateur de page actuelle
  const isHome = pathname === '/';
  const isSettings = pathname === '/settings';

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.safeArea, { backgroundColor: colors.card }]}
    >
      {/* Indicateurs de page */}
      <View style={styles.indicators}>
        <View style={[styles.dot, isHome && { backgroundColor: colors.primary }]} />
        <View style={[styles.dot, isSettings && { backgroundColor: colors.primary }]} />
      </View>

      {/* Boutons */}
      <View style={[styles.bar, { borderTopColor: colors.inputBackground }]}>
        <AppBarButton onPress={() => router.push('/settings')}>
          <Cog size={20} color={colors.icon} />
        </AppBarButton>

        <AppBarButton size="lg" onPress={() => router.push('/task-edit')}>
          <Plus size={22} color={colors.icon} />
        </AppBarButton>

        <AppBarButton onPress={handleToggle}>
          <Feather
            name={showCompleted ? 'eye' : 'eye-off'}
            size={20}
            color={colors.icon}
          />
        </AppBarButton>
      </View>
    </SafeAreaView>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={() => <NavBar />}
    >
      <Tabs.Screen name="index" options={{ title: 'Tâches' }} />
      <Tabs.Screen name="_settings" options={{ href: null }} />
      <Tabs.Screen name="_toggle" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 4 : 10,
  },
});