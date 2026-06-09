import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { useState, useEffect } from 'react';
import { insertTask, updateTask, getTaskById } from '@/lib/database';
import { TextField } from '@/lib/components/text-field';
import { MultilineTextField } from '@/lib/components/multiline-text-field';
import { useAdaptiveColors } from '@/lib/hooks/use-adaptive-colors';

export default function TaskEditScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const navigation = useNavigation();
  const colors = useAdaptiveColors();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [titleErrors, setTitleErrors] = useState<string[]>([]);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Modifier une tâche' : 'Nouvelle tâche',
    });
    if (isEditing) {
      const task = getTaskById(Number(id));
      if (task) {
        setTitle(task.title);
        setDesc(task.description ?? '');
      }
    }
  }, [id]);

  const save = () => {
    if (!title.trim()) {
      setTitleErrors(['Le titre est requis.']);
      return;
    }
    setTitleErrors([]);
    if (isEditing) {
      updateTask(Number(id), title.trim(), desc.trim() || null);
    } else {
      insertTask(title.trim(), desc.trim() || null);
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.card }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TextField
          placeholder="Tâche..."
          value={title}
          onChangeText={(v) => {
            setTitle(v);
            if (v.trim()) setTitleErrors([]);
          }}
          errors={titleErrors}
        />

        <MultilineTextField
          placeholder="Description..."
          value={desc}
          onChangeText={setDesc}
        />

        <TouchableOpacity
          style={[
            styles.btn,
            { backgroundColor: colors.primary },
            !title.trim() && styles.btnDisabled,
          ]}
          onPress={save}
          disabled={!title.trim()}
        >
          <Text style={styles.btnText}>Sauvegarder</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 4,
  },
  btn: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});