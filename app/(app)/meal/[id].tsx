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

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, deleteItem } = useMealItems(id!);

  async function handleDeleteItem(itemId: string, name: string) {
    Alert.alert('Delete item', `Remove "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteItem(itemId);
          // Recalculate meal totals
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

          // If no items left, delete the meal
          if (remaining.length === 0) {
            await supabase.from('meals').delete().eq('id', id);
            router.back();
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
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteMeal}>
          <Text style={styles.deleteAll}>Delete meal</Text>
        </TouchableOpacity>
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
            <TouchableOpacity onPress={() => handleDeleteItem(item.id, item.name)}>
              <Text style={styles.deleteText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  backText: { fontSize: 16, color: '#000' },
  deleteAll: { fontSize: 16, color: '#FF3B30' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemPortion: { fontSize: 13, color: '#999', marginTop: 2 },
  itemMacros: { fontSize: 13, color: '#666', marginTop: 4 },
  deleteText: { fontSize: 24, color: '#FF3B30', paddingLeft: 12 },
});
