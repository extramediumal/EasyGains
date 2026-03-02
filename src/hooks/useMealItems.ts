import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { MealItem } from '../types/database';

export function useMealItems(mealId: string) {
  const [items, setItems] = useState<MealItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    const { data } = await supabase
      .from('meal_items')
      .select('*')
      .eq('meal_id', mealId);

    setItems(data || []);
    setLoading(false);
  }, [mealId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function deleteItem(itemId: string) {
    await supabase.from('meal_items').delete().eq('id', itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }

  return { items, loading, refetch: fetchItems, deleteItem };
}
