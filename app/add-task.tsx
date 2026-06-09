import { useAdaptiveColors } from "@/lib/hooks/use-adaptive-colors";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddTaskScreen() {
  const colors = useAdaptiveColors();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = () => {
    if (title.trim()) {
      setTitle("");
      setDescription("");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.primary, paddingTop: insets.top },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.background }]}>
          Ajouter une tâche
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Titre</Text>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.inputBackground,
              },
            ]}
            placeholder="Titre de la tâche"
            placeholderTextColor={colors.secondaryText}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.textarea,
              {
                color: colors.text,
                backgroundColor: colors.inputBackground,
              },
            ]}
            placeholder="Description..."
            placeholderTextColor={colors.secondaryText}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleAddTask}
          style={({ pressed }) => [
            styles.submitButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={styles.submitButtonText}>Ajouter</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* HEADER */
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },

  /* CONTENT */
  content: {
    flex: 1,
    padding: 16,
  },

  /* FORM */
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
  },
  textarea: {
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: "top",
  },

  /* bouton */
  submitButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});