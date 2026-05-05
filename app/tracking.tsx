import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function TrackingScreen() {
  const [minutes, setMinutes] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutes(m => (m > 1 ? m - 1 : 1));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Simulated Map Background */}
      <View style={styles.mapPlaceholder}>
        <Image 
          source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/static/77.5946,12.9716,14,0/800x800?access_token=pk.eyJ1IjoiZ3BhdWwiLCJhIjoiY2t4bmJueXQyMDRqODJucG56bm56bm56In0.xxxxxxxxxxxx' }} 
          style={StyleSheet.absoluteFill} 
          resizeMode="cover"
        />
        {/* Delivery Path Simulation */}
        <View style={styles.deliveryMarker}>
          <View style={styles.markerPulse} />
          <MaterialCommunityIcons name="moped" size={24} color="#FFF" />
        </View>
        <View style={styles.homeMarker}>
          <Ionicons name="home" size={24} color="#00C881" />
        </View>
      </View>

      {/* Floating Header */}
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Arriving in {minutes} mins</Text>
            <Text style={styles.headerSub}>Delivering to Home</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Delivery Status Card */}
      <View style={styles.bottomSheet}>
        <View style={styles.handle} />
        
        <View style={styles.statusRow}>
          <View style={styles.deliveryInfo}>
            <Text style={styles.statusTitle}>Valet is reaching the nursery</Text>
            <Text style={styles.statusSub}>Arun is picking up your Monstera...</Text>
          </View>
          <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.deliveryAvatar} />
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="call" size={20} color="#00C881" />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#00C881" />
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>1x Monstera Deliciosa</Text>
            <Text style={styles.itemPrice}>₹45.00</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    position: 'relative',
  },
  safeHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 5,
  },
  backBtn: {
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  headerSub: {
    fontSize: 12,
    color: '#666',
  },
  deliveryMarker: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00C881',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  markerPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 200, 129, 0.2)',
  },
  homeMarker: {
    position: 'absolute',
    bottom: '30%',
    right: '25%',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#EEE',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  deliveryInfo: {
    flex: 1,
    marginRight: 20,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusSub: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  deliveryAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#EEE',
    paddingVertical: 12,
    borderRadius: 15,
  },
  actionText: {
    fontWeight: 'bold',
    color: '#00C881',
  },
  orderSummary: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    color: '#666',
  },
  itemPrice: {
    fontWeight: 'bold',
  },
});
