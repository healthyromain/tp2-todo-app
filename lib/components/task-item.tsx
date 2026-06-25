import type { TaskItemData } from "@/lib/types";
import { useCallback, useEffect, type FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { Checkbox } from "./checkbox";
import { TodoTitle } from "./task-title";

type Props = {
  task: TaskItemData;
  onLongPress?: () => void;
  onChange?: (completed: boolean) => Promise<void> | void;
  disabled?: boolean;
};

export const TaskItem: FC<Props> = function ({
  task,
  onLongPress,
  onChange,
  disabled = false,
}) {
  const completed = task.completed;

  const pressed = useSharedValue<boolean>(false);
  const animatedStyles = useAnimatedStyle(() => ({
    opacity: withTiming(pressed.value ? 0.6 : 1, {
      easing: Easing.inOut(Easing.quad),
    }),
    transform: [
      {
        scale: withTiming(pressed.value ? 0.95 : 1, {
          duration: 500,
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
  }));

  const handlePress = () => {
    onChange?.(!completed);
  };

  const handleLongPress = useCallback(() => {
    pressed.set(false);
    onLongPress?.();
  }, []);

  const opacity = useSharedValue(task.completed ? 0.5 : 1);
  useEffect(() => {
    opacity.value = withTiming(completed ? 0.5 : 1, {
      duration: 200,
      easing: Easing.inOut(Easing.bounce),
    });
  }, [completed]);

  const formattedDate = task.created_at
    ? new Date(task.created_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => pressed.set(true)}
      onPressOut={() => pressed.set(false)}
      disabled={disabled}
      onLongPress={handleLongPress}
    >
      <Animated.View style={animatedStyles}>
        <Animated.View style={{ opacity }}>
          <View style={styles.header}>
            <Checkbox
              size={10}
              checked={completed}
              disabled={disabled}
              onValueChange={handlePress}
            />
            <TodoTitle title={task.title} completed={completed} />
          </View>

          {task.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{task.description}</Text>
            </View>
          )}

          {formattedDate && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.date}>{formattedDate}</Text>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  description: {
    color: "#888",
    fontWeight: "600",
  },
  descriptionContainer: {
    marginTop: 4,
    marginLeft: 28,
  },
  date: {
    color: "#bbb",
    fontSize: 11,
    fontWeight: "500",
  },
});
