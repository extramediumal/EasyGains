import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo, LOG_LEVEL } from 'react-native-purchases';
import { useAuth } from './AuthProvider';

const REVENUECAT_IOS_KEY = 'appl_WRdlqTAYukeBzuFYnoYUVDJWCPP';
const REVENUECAT_ANDROID_KEY = 'goog_YOUR_ANDROID_KEY_HERE'; // TODO: Replace with real Google Play key from RevenueCat
const REVENUECAT_API_KEY = Platform.OS === 'ios' ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;

export const ENTITLEMENT_PRO = 'pro';

interface SubscriptionContextType {
  isPro: boolean;
  customerInfo: CustomerInfo | null;
  loading: boolean;
  restorePurchases: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPro: false,
  customerInfo: null,
  loading: true,
  restorePurchases: async () => {},
});

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.ERROR);
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      Purchases.logIn(session.user.id).catch(() => {});
    }
  }, [session?.user?.id]);

  useEffect(() => {
    async function load() {
      try {
        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
      } catch {
        // If RevenueCat isn't configured yet, treat as free
      } finally {
        setLoading(false);
      }
    }
    load();

    const purchaserInfoUpdateListener = Purchases.addCustomerInfoUpdateListener((info) => {
      setCustomerInfo(info);
    });

    return () => purchaserInfoUpdateListener.remove();
  }, []);

  async function restorePurchases() {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
    } catch (e) {
      throw e;
    }
  }

  const isPro = !!customerInfo?.entitlements.active[ENTITLEMENT_PRO];

  return (
    <SubscriptionContext.Provider value={{ isPro, customerInfo, loading, restorePurchases }}>
      {children}
    </SubscriptionContext.Provider>
  );
}
