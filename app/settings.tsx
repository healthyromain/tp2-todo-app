import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { deleteAllTasks, insertSeedTasks } from '@/lib/database';
import { SettingsButton } from '@/lib/components/settings-button';
import { useAdaptiveColors } from '@/lib/hooks/use-adaptive-colors';
import { Feather } from '@expo/vector-icons';

export default function SettingsScreen() {
  const colors = useAdaptiveColors();

  const handleSeed = () => {
    insertSeedTasks();
    Alert.alert('Succès', 'Données de test insérées.');
  };

  const handleReset = () => {
    Alert.alert('Confirmer', 'Vider toute la base de données ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Vider',
        style: 'destructive',
        onPress: () => {
          deleteAllTasks();
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <SettingsButton
          label="Insérer des données de test"
          icon={(color) => <Feather name="database" size={16} color={color} />}
          onPress={handleSeed}
        />

        <View style={[styles.separator, { backgroundColor: colors.inputBackground }]} />

        <SettingsButton
          label="Vider la base de données"
          color={colors.danger}
          icon={(color) => <Feather name="trash-2" size={16} color={color} />}
          onPress={handleReset}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
  },
  section: {
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
});