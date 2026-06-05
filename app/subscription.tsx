import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

type SubscriptionPlan = 'pro' | 'box';

export default function SubscriptionScreen() {
  const params = useLocalSearchParams();
  const initialPlan = (params.plan as SubscriptionPlan) || 'pro';
  
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(initialPlan);
  const [proCycle, setProCycle] = useState<'monthly' | 'yearly'>('yearly');

  const handleSubscribe = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const planName = selectedPlan === 'pro' 
      ? `Green Leaf Pro (${proCycle === 'yearly' ? 'Yearly' : 'Monthly'})` 
      : 'Monthly Plant Box Subscription';
      
    Alert.alert(
      'Subscription Successful!',
      `Thank you for subscribing to the ${planName}. Welcome to the Green Leaf family!`,
      [{ text: 'Great!', onPress: () => router.replace('/(tabs)') }]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1A2A1A', '#0D140D']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Image source={require('@/assets/images/fiddle_leaf_fig.png')} style={styles.heroImg} />
          
          <Text style={styles.title}>Green Leaf Subscription</Text>
          <Text style={styles.subtitle}>Curated botanicals and smart garden care</Text>

          {/* Plan Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity 
              style={[styles.tab, selectedPlan === 'pro' && styles.tabActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedPlan('pro');
              }}
            >
              <Text style={[styles.tabText, selectedPlan === 'pro' && styles.tabTextActive]}>Pro Membership</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, selectedPlan === 'box' && styles.tabActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedPlan('box');
              }}
            >
              <Text style={[styles.tabText, selectedPlan === 'box' && styles.tabTextActive]}>Monthly Plant Box</Text>
            </TouchableOpacity>
          </View>

          {/* Dynamic Content */}
          {selectedPlan === 'pro' ? (
            <View style={styles.planDetails}>
              <View style={styles.features}>
                <FeatureItem icon="scan-outline" text="Unlimited AI Plant Health Diagnostics" />
                <FeatureItem icon="cube-outline" text="Exclusive AR Oxygen and Growth Models" />
                <FeatureItem icon="notifications-outline" text="Smart Custom Water & Care Reminders" />
                <FeatureItem icon="chatbubbles-outline" text="24/7 Expert Botanist Support Chat" />
              </View>

              <View style={styles.pricingRow}>
                <TouchableOpacity 
                  style={[styles.priceCard, proCycle === 'monthly' && styles.activePrice]}
                  onPress={() => setProCycle('monthly')}
                >
                  <Text style={styles.priceLabel}>Monthly</Text>
                  <Text style={styles.priceValue}>₹99<Text style={styles.per}>/mo</Text></Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.priceCard, proCycle === 'yearly' && styles.activePrice]}
                  onPress={() => setProCycle('yearly')}
                >
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>BEST VALUE</Text>
                  </View>
                  <Text style={styles.priceLabel}>Yearly</Text>
                  <Text style={styles.priceValue}>₹799<Text style={styles.per}>/yr</Text></Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.planDetails}>
              <View style={styles.features}>
                <FeatureItem icon="gift-outline" text="2 Curated Premium Plants every month" />
                <FeatureItem icon="leaf-outline" text="Free Custom Fertilizers & Pots included" />
                <FeatureItem icon="car-outline" text="Free Priority Safe Doorstep Delivery" />
                <FeatureItem icon="shield-checkmark-outline" text="Damage replacement warranty" />
              </View>

              <View style={styles.pricingRow}>
                <View style={[styles.priceCard, styles.activePrice, { width: '100%' }]}>
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>PHYSICAL BOX</Text>
                  </View>
                  <Text style={styles.priceLabel}>Monthly Subscription Box</Text>
                  <Text style={styles.priceValue}>₹499<Text style={styles.per}>/mo</Text></Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe}>
            <LinearGradient colors={['#D8F36C', '#B2F44C']} style={styles.btnGradient}>
              <Text style={styles.btnText}>
                {selectedPlan === 'pro' 
                  ? `Subscribe to Pro (₹${proCycle === 'yearly' ? '799/yr' : '99/mo'})` 
                  : 'Subscribe to Plant Box (₹499/mo)'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={styles.footerText}>Cancel anytime instantly. Cancel fee: ₹0.</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function FeatureItem({ icon, text }: any) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={20} color="#D8F36C" />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeBtn: {
    padding: 20,
    alignSelf: 'flex-start',
    zIndex: 10,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingBottom: 60,
  },
  heroImg: {
    width: 150,
    height: 180,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 25,
    padding: 4,
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 22,
  },
  tabActive: {
    backgroundColor: '#D8F36C',
  },
  tabText: {
    color: '#AAA',
    fontWeight: '700',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#1A2A1A',
  },
  planDetails: {
    width: '100%',
    alignItems: 'center',
  },
  features: {
    width: '100%',
    gap: 14,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  pricingRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 24,
    width: '100%',
  },
  priceCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    position: 'relative',
  },
  activePrice: {
    borderColor: '#D8F36C',
    backgroundColor: 'rgba(216, 243, 172, 0.1)',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#D8F36C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#1A2A1A',
  },
  priceLabel: {
    color: '#AAA',
    fontSize: 11,
    fontWeight: '700',
  },
  priceValue: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  per: {
    fontSize: 12,
    fontWeight: '400',
    color: '#AAA',
  },
  subscribeBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 16,
    marginTop: 10,
  },
  btnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#1A2A1A',
    fontSize: 15,
    fontWeight: '900',
  },
  footerText: {
    color: '#666',
    fontSize: 11,
  },
});
