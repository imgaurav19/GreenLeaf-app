import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Haptics from 'expo-haptics';
import { useUser } from '@/context/UserContext';

const { width, height } = Dimensions.get('window');

export default function TrackingScreen() {
  const { locationCity, coords } = useUser();
  const params = useLocalSearchParams();
  const [minutes, setMinutes] = useState(15);
  const [status, setStatus] = useState<'dispatched' | 'picking' | 'delivering'>('dispatched');

  // Parse ordered items and price calculations
  const subtotal = Number(params.subtotal) || 299;
  const deliveryFee = Number(params.deliveryFee) || 40;
  const discount = Number(params.discount) || 0;
  const total = Number(params.total) || 339;

  let orderedItems: any[] = [];
  try {
    if (params.items) {
      orderedItems = JSON.parse(params.items as string);
    }
  } catch (e) {
    console.warn('Error parsing items', e);
  }

  // Fallback if empty
  if (orderedItems.length === 0) {
    orderedItems = [{ name: 'Money Plant (Epipremnum)', price: 299, quantity: 1 }];
  }

  // Dynamic coordinates based on current UserContext coords
  const HOME_LOC = {
    latitude: coords?.latitude || 22.5726,
    longitude: coords?.longitude || 88.3639
  };
  
  const NURSERY = {
    latitude: HOME_LOC.latitude - 0.012,
    longitude: HOME_LOC.longitude + 0.015
  };
  
  const BIKER_START = {
    latitude: HOME_LOC.latitude - 0.006,
    longitude: HOME_LOC.longitude + 0.007
  };

  const ROUTE_COORDS = [
    NURSERY,
    { latitude: HOME_LOC.latitude - 0.010, longitude: HOME_LOC.longitude + 0.013 },
    { latitude: HOME_LOC.latitude - 0.008, longitude: HOME_LOC.longitude + 0.010 },
    BIKER_START,
    { latitude: HOME_LOC.latitude - 0.004, longitude: HOME_LOC.longitude + 0.005 },
    { latitude: HOME_LOC.latitude - 0.002, longitude: HOME_LOC.longitude + 0.002 },
    HOME_LOC,
  ];

  const [bikerPos, setBikerPos] = useState(BIKER_START);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('picking');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 4000);

    const interval = setInterval(() => {
      setMinutes(m => (m > 1 ? m - 1 : 1));
    }, 60000);

    // Simulate biker movement
    let step = 0;
    const moveInterval = setInterval(() => {
      step = (step + 1) % ROUTE_COORDS.length;
      setBikerPos(ROUTE_COORDS[step]);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      clearInterval(moveInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Real Map centered on dynamic location */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: HOME_LOC.latitude,
          longitude: HOME_LOC.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* Route line */}
        <Polyline
          coordinates={ROUTE_COORDS}
          strokeColor="#00C881"
          strokeWidth={4}
          lineDashPattern={[8, 4]}
        />

        {/* Nursery marker */}
        <Marker coordinate={NURSERY} title="Green Leaf Nursery">
          <View style={styles.nurseryMarker}>
            <MaterialCommunityIcons name="store" size={18} color="#FFF" />
          </View>
        </Marker>

        {/* Biker marker */}
        <Marker coordinate={bikerPos} title="Delivery Partner">
          <View style={styles.bikerMarker}>
            <View style={styles.bikerPulse} />
            <MaterialCommunityIcons name="moped" size={20} color="#FFF" />
          </View>
        </Marker>

        {/* Home marker */}
        <Marker coordinate={HOME_LOC} title="Your Home">
          <View style={styles.homeMarker}>
            <Ionicons name="home" size={18} color="#FFF" />
          </View>
        </Marker>
      </MapView>

      {/* Floating Header */}
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#1A2A1A" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              {status === 'dispatched' ? 'Order Dispatched' : `Arriving in ${minutes} mins`}
            </Text>
            <Text style={styles.headerSub}>
              {status === 'dispatched' ? 'Finding nearby biker...' : `Delivering to ${locationCity}`}
            </Text>
          </View>
          <View style={styles.etaPill}>
            <Ionicons name="time" size={14} color="#00C881" />
            <Text style={styles.etaText}>{minutes}m</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.handle} />

        <View style={styles.statusRow}>
          <View style={styles.deliveryInfo}>
            <Text style={styles.statusTitle}>
              {status === 'dispatched' ? 'Your order is being packed' : 'Valet is reaching the nursery'}
            </Text>
            <Text style={styles.statusSub}>
              {status === 'dispatched' ? 'Preparing your plants for dispatch...' : 'Arun is picking up your plants...'}
            </Text>
          </View>
          <View style={styles.deliveryAvatar}>
            <MaterialCommunityIcons name="account" size={28} color="#00C881" />
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <Ionicons name="call" size={18} color="#00C881" />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <Ionicons name="chatbubble-ellipses" size={18} color="#00C881" />
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <Ionicons name="share-outline" size={18} color="#00C881" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.orderSummaryScroll}>
          <View style={styles.orderSummary}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            
            {orderedItems.map((item, index) => (
              <View key={item.name + '-' + index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
              </View>
            ))}

            <View style={styles.itemRow}>
              <Text style={styles.itemName}>Delivery Fee</Text>
              <Text style={styles.itemPrice}>₹{deliveryFee}</Text>
            </View>

            {discount > 0 && (
              <View style={styles.itemRow}>
                <Text style={[styles.itemName, { color: '#00C881' }]}>Discount</Text>
                <Text style={[styles.itemPrice, { color: '#00C881' }]}>-₹{discount}</Text>
              </View>
            )}

            <View style={[styles.itemRow, { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 8, marginTop: 8 }]}>
              <Text style={[styles.itemName, { fontWeight: '900', color: '#000' }]}>Total</Text>
              <Text style={[styles.itemPrice, { fontWeight: '900', fontSize: 18 }]}>₹{total}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  map: { flex: 1 },
  safeHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#1A2A1A' },
  headerSub: { fontSize: 11, color: '#888', marginTop: 2 },
  etaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,200,129,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  etaText: { fontSize: 13, fontWeight: '900', color: '#00C881' },

  // Map markers
  nurseryMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6F00',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  bikerMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00C881',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  bikerPulse: {
    position: 'absolute',
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 200, 129, 0.2)',
  },
  homeMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A2A1A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D8F36C',
  },

  // Bottom sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 10,
    maxHeight: '52%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  deliveryInfo: { flex: 1, marginRight: 16 },
  statusTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A2A1A' },
  statusSub: { fontSize: 12, color: '#888', marginTop: 4 },
  deliveryAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,200,129,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,200,129,0.2)',
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(0,200,129,0.03)',
  },
  actionText: { fontWeight: '700', color: '#00C881', fontSize: 13 },
  orderSummaryScroll: {
    maxHeight: 120,
  },
  orderSummary: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 14,
  },
  summaryTitle: { fontSize: 15, fontWeight: '900', color: '#1A2A1A', marginBottom: 10 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: { color: '#666', fontSize: 13 },
  itemPrice: { fontWeight: '700', fontSize: 13, color: '#1A2A1A' },
});
