import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTasks, toggleTask } from '@/lib/database';
import { AppEvents } from '@/lib/events';
import { TaskItem } from '@/lib/components/task-item';
import { useAdaptiveColors } from '@/lib/hooks/use-adaptive-colors';
import type { TaskItemData } from '@/lib/types';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<TaskItemData[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const colors = useAdaptiveColors();

  const load = useCallback(() => {
    setTasks(getTasks());
  }, []);

  useFocusEffect(load);

  useEffect(() => {
    const unsub = AppEvents.on('TOGGLE_COMPLETED', ({ show }: { show: boolean }) => {
      setShowCompleted(show);
    });
    return () => unsub();
  }, []);

  const displayed = showCompleted
    ? tasks
    : tasks.filter(t => !t.completed);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.card }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.inputBackground }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Mes tâches</Text>
        <Text style={[styles.headerCount, { color: colors.secondaryText }]}>
          {displayed.length} tâche{displayed.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={displayed}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onChange={(completed) => {
              toggleTask(item.id, completed);
              load();
            }}
            onLongPress={() =>
              router.push({
                pathname: '/task-edit',
                params: { id: item.id },
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.secondaryText }]}>
            Aucune tâche pour le moment.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerCount: {
    fontSize: 14,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 15,
  },
});