import { useAdaptiveColors } from "@/lib/hooks/use-adaptive-colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
};

export default function HomeScreen() {
  const colors = useAdaptiveColors();
  const insets = useSafeAreaInsets();

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Faire les courses",
      description: "Lait, pain, œufs",
      completed: false,
    },
    {
      id: 2,
      title: "Appeler le médecin",
      description: "Prendre rendez-vous",
      completed: false,
    },
    {
      id: 3,
      title: "Terminer le projet",
      description: "Finir le développement",
      completed: true,
    },
  ]);

  const [showCompleted, setShowCompleted] = useState(true);

  const displayedTasks = showCompleted
    ? tasks
    : tasks.filter((t) => !t.completed);

  const handleToggleComplete = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      ),
    );
  };

  const renderTaskItem = ({ item: task }: { item: Task }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => handleToggleComplete(task.id)}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={task.completed ? "checkbox-marked" : "checkbox-blank-outline"}
        size={24}
        color={task.completed ? colors.primary : colors.secondaryText}
        style={styles.checkbox}
      />
      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            {
              color: colors.text,
              textDecorationLine: task.completed ? "line-through" : "none",
              opacity: task.completed ? 0.5 : 1,
            },
          ]}
        >
          {task.title}
        </Text>
        {task.description && (
          <Text
            style={[
              styles.taskDescription,
              {
                color: colors.secondaryText,
                opacity: task.completed ? 0.4 : 0.7,
              },
            ]}
            numberOfLines={1}
          >
            {task.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Task List */}
      {displayedTasks.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={{ color: colors.secondaryText }}>
            Aucune tâche{showCompleted ? "" : " en attente"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayedTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTaskItem}
          contentContainerStyle={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            paddingTop: insets.top + 8,
          }}
          scrollIndicatorInsets={{ top: insets.top }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
  },
  taskDescription: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
});
