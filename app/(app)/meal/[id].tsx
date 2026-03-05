import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMealItems } from '../../../src/hooks/useMealItems';
import { supabase } from '../../../src/lib/supabase';
import { Button } from '../../../src/components/Button';
import { Colors, Radii, Spacing } from '../../../src/lib/theme';

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, deleteItem } = useMealItems(id!);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/(tabs)');
  }

  async function handleDeleteItem(itemId: string, name: string) {
    Alert.alert('Delete item', `Remove "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteItem(itemId);
          const remaining = items.filter((i) => i.id !== itemId);
          const totals = remaining.reduce(
            (acc, i) => ({
              calories: acc.calories + i.calories,
              protein: acc.protein + i.protein,
              carbs: acc.carbs + i.carbs,
              fat: acc.fat + i.fat,
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
          );
          await supabase
            .from('meals')
            .update({
              total_calories: totals.calories,
              total_protein: totals.protein,
              total_carbs: totals.carbs,
              total_fat: totals.fat,
            })
            .eq('id', id);

          if (remaining.length === 0) {
            await supabase.from('meals').delete().eq('id', id);
            goBack();
          }
        },
      },
    ]);
  }

  async function handleDeleteMeal() {
    Alert.alert('Delete meal', 'Delete this entire meal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('meals').delete().eq('id', id);
          router.back();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <Button title="Back" onPress={goBack} variant="secondary" />
        <Button title="Delete meal" onPress={handleDeleteMeal} variant="destructive" />
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Meal items</Text>
        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPortion}>{item.portion}</Text>
              <Text style={styles.itemMacros}>
                {item.protein}g P · {item.calories} cal · C: {item.carbs}g · F: {item.fat}g
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteItem(item.id, item.name)}
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.cardPadding, paddingVertical: 8 },
  container: { flex: 1, padding: Spacing.cardPadding },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: Radii.card,
    padding: 14,
    marginBottom: 8,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemPortion: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  itemMacros: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.destructive,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteButtonText: { fontSize: 20, color: Colors.white, fontWeight: '600', marginTop: -1 },
});
