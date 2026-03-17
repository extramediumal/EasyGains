import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { useSubscription } from '../../src/providers/SubscriptionProvider';
import { Button } from '../../src/components/Button';
import { Colors, Spacing } from '../../src/lib/theme';

export default function PaywallScreen() {
  const { source } = useLocalSearchParams<{ source?: string }>();
  const { restorePurchases } = useSubscription();

  const SUBTITLES: Record<string, string> = {
    entry_limit: "You've used all 3 free entries today.",
    notifications: "Unlock custom reminders and coaching tips.",
    settings: "Unlimited entries, smarter tracking, and more.",
  };
  const subtitle = SUBTITLES[source || ''] || "Go Pro and get the most out of EasyGains.";
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    async function loadOfferings() {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current?.availablePackages) {
          setPackages(offerings.current.availablePackages);
        }
      } catch {
        // offerings not configured yet
      } finally {
        setLoading(false);
      }
    }
    loadOfferings();
  }, []);

  async function handlePurchase(pkg: PurchasesPackage) {
    setPurchasing(true);
    try {
      await Purchases.purchasePackage(pkg);
      router.back();
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('Purchase failed', e.message);
      }
    } finally {
      setPurchasing(false);
    }
  }

  async function handleRestore() {
    try {
      await restorePurchases();
      Alert.alert('Restored', 'Your purchases have been restored.');
      router.back();
    } catch {
      Alert.alert('Error', 'No purchases found to restore.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Go Pro</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.features}>
        <Text style={styles.feature}>✓ Unlimited voice entries</Text>
        <Text style={styles.feature}>✓ Smart clarifying questions</Text>
        <Text style={styles.feature}>✓ Weekly analytics</Text>
        <Text style={styles.feature}>✓ Reminders</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} />
      ) : packages.length === 0 ? (
        <Text style={styles.unavailable}>Subscriptions unavailable right now.</Text>
      ) : (
        <View style={styles.packages}>
          {packages
            .sort((a, b) => a.product.price - b.product.price)
            .map((pkg) => (
              <View key={pkg.identifier} style={styles.packageCard}>
                <View style={styles.packageInfo}>
                  <Text style={styles.packageTitle}>{pkg.product.title}</Text>
                  <Text style={styles.packagePrice}>{pkg.product.priceString}</Text>
                </View>
                <Button
                  title={purchasing ? 'Loading...' : 'Subscribe'}
                  onPress={() => handlePurchase(pkg)}
                  disabled={purchasing}
                  variant="primary"
                />
              </View>
            ))}
        </View>
      )}

      <Button title="Restore purchases" onPress={handleRestore} variant="ghost" />
      <Button title="Not now" onPress={() => router.back()} variant="ghost" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: Spacing.screenPadding, backgroundColor: Colors.background },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  features: { marginBottom: 32 },
  feature: { fontSize: 16, marginBottom: 10, color: Colors.textPrimary },
  unavailable: { textAlign: 'center', color: Colors.textMuted, marginTop: 16 },
  packages: { gap: 12, marginBottom: 16 },
  packageCard: { backgroundColor: Colors.cardBackground, borderRadius: 16, padding: 16, gap: 12 },
  packageInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  packageTitle: { fontSize: 16, fontWeight: '600' },
  packagePrice: { fontSize: 16, color: Colors.textSecondary },
});
