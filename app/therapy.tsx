import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function TherapyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A140F', '#050A08']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plant Therapy</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Image 
          source={require('@/assets/images/office_plant.png')} 
          style={styles.heroImg}
        />

        <View style={styles.content}>
          <Text style={styles.mainTitle}>Heal your space with Professional Therapy</Text>
          <Text style={styles.description}>
            Our certified plant therapists help you create a stress-free environment using the power of nature. From office optimization to residential serenity, we bring the forest to you.
          </Text>

          <View style={styles.perks}>
            <View style={styles.perkItem}>
              <Ionicons name="sparkles" size={20} color="#00C881" />
              <Text style={styles.perkText}>Stress Reduction & Mindfulness</Text>
            </View>
            <View style={styles.perkItem}>
              <Ionicons name="leaf" size={20} color="#00C881" />
              <Text style={styles.perkText}>Custom Plant Design & Placement</Text>
            </View>
            <View style={styles.perkItem}>
              <Ionicons name="heart" size={20} color="#00C881" />
              <Text style={styles.perkText}>Ongoing Maintenance & Care Plans</Text>
            </View>
          </View>

          <View style={styles.bookingCard}>
            <Text style={styles.bookingTitle}>Choose Your Session</Text>
            
            <TouchableOpacity style={styles.sessionItem}>
              <View>
                <Text style={styles.sessionName}>Individual Serenity</Text>
                <Text style={styles.sessionSub}>45 mins • 1:1 Consultation</Text>
              </View>
              <Text style={styles.sessionPrice}>₹49</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.sessionItem, styles.sessionActive]}>
              <View>
                <Text style={styles.sessionName}>Full Office Refresh</Text>
                <Text style={styles.sessionSub}>120 mins • Team Setup</Text>
              </View>
              <Text style={styles.sessionPrice}>₹199</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mainBtn}>
              <LinearGradient colors={['#00C881', '#009D65']} style={styles.btnGradient}>
                <Text style={styles.btnText}>Book Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    marginBottom: 20,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroImg: {
    width: width,
    height: 300,
  },
  content: {
    padding: 24,
  },
  mainTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    color: '#888',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 30,
  },
  perks: {
    marginBottom: 40,
    gap: 15,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  perkText: {
    color: '#BBB',
    fontSize: 14,
    fontWeight: '600',
  },
  bookingCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bookingTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sessionActive: {
    borderColor: '#00C881',
    backgroundColor: 'rgba(0,200,129,0.05)',
  },
  sessionName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sessionSub: {
    color: '#666',
    fontSize: 12,
  },
  sessionPrice: {
    color: '#00C881',
    fontSize: 18,
    fontWeight: '900',
  },
  mainBtn: {
    marginTop: 10,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  btnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
