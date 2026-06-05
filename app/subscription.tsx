import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SubscriptionScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1A2A1A', '#0D140D']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Image source={require('@/assets/images/fiddle_leaf_fig.png')} style={styles.heroImg} />
          
          <Text style={styles.title}>Green Leaf Pro</Text>
          <Text style={styles.subtitle}>Unlock the full potential of your garden</Text>

          <View style={styles.features}>
            <FeatureItem icon="scan" text="Unlimited Plant Diagnostics" />
            <FeatureItem icon="cube" text="Exclusive AR Plant Models" />
            <FeatureItem icon="notifications" text="Smart Care Reminders" />
            <FeatureItem icon="people" text="Expert Botanist Chat" />
          </View>

          <View style={styles.pricingRow}>
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>Monthly</Text>
              <Text style={styles.priceValue}>₹9.99</Text>
            </View>
            <View style={[styles.priceCard, styles.activePrice]}>
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>BEST VALUE</Text>
              </View>
              <Text style={styles.priceLabel}>Yearly</Text>
              <Text style={styles.priceValue}>₹79.99</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.subscribeBtn} onPress={() => router.back()}>
            <LinearGradient colors={['#D8F36C', '#B2F44C']} style={styles.btnGradient}>
              <Text style={styles.btnText}>Start Free Hackathon Trial</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={styles.footerText}>Cancel anytime. No questions asked.</Text>
        </View>
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
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  heroImg: {
    width: 200,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  features: {
    width: '100%',
    gap: 15,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  featureText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  pricingRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 40,
  },
  priceCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  activePrice: {
    borderColor: '#D8F36C',
    backgroundColor: 'rgba(216, 243, 172, 0.1)',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#D8F36C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1A2A1A',
  },
  priceLabel: {
    color: '#AAA',
    fontSize: 12,
  },
  priceValue: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 5,
  },
  subscribeBtn: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 20,
  },
  btnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#1A2A1A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
});
