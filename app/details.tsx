import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DetailsScreen() {
  const [quantity, setQuantity] = useState(1);
  const params = useLocalSearchParams();

  // Mock data matching the screenshot style with Indian theme
  const plant = {
    name: params.name || 'Money Plant (Epipremnum)',
    price: 299,
    oldPrice: 499,
    rating: '4.8',
    reviews: '2.4k',
    img: require('@/assets/images/office_plant.png'),
    waterDeficiency: 47,
    lightDeficiency: 81,
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0F4EF', '#FFFFFF']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="heart-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Main Product Card */}
          <View style={styles.mainCard}>
            <View style={styles.imageBox}>
              <Image source={plant.img} style={styles.plantImg} resizeMode="contain" />
            </View>
            <Text style={styles.plantName}>{plant.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>₹{plant.price}</Text>
              <Text style={styles.oldPrice}>₹{plant.oldPrice}</Text>
              <TouchableOpacity style={styles.cartCircle}>
                <Ionicons name="cart-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quantity and Reviews Bar */}
          <View style={styles.infoBar}>
            <View>
              <Text style={styles.barTitle}>{plant.name}</Text>
              <Text style={styles.barSub}>{plant.reviews} Reviews</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => setQuantity(q => Math.max(1, q - 1))} style={styles.qtyBtn}>
                <Ionicons name="remove" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity onPress={() => setQuantity(q => q + 1)} style={[styles.qtyBtn, styles.qtyActive]}>
                <Ionicons name="add" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Delivery Fee */}
          <View style={styles.deliveryRow}>
            <Text style={styles.deliveryLabel}>Delivery fee</Text>
            <Text style={styles.deliveryValue}>₹40.00</Text>
          </View>

          {/* Diagnosis Section */}
          <View style={styles.diagnosisSection}>
            <Text style={styles.diagnosisTitle}>Initial Diagnosis</Text>
            
            <View style={styles.statRow}>
              <View style={styles.statIconBox}>
                <Ionicons name="water-outline" size={20} color="#666" />
              </View>
              <View style={styles.statContent}>
                <View style={styles.statHeader}>
                  <Text style={styles.statLabel}>Water Deficiency</Text>
                  <Text style={styles.statPercent}>{plant.waterDeficiency}.00%</Text>
                </View>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${plant.waterDeficiency}%`, backgroundColor: '#00C881' }]} />
                </View>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statIconBox}>
                <Ionicons name="sunny-outline" size={20} color="#666" />
              </View>
              <View style={styles.statContent}>
                <View style={styles.statHeader}>
                  <Text style={styles.statLabel}>Insufficient Light</Text>
                  <Text style={styles.statPercent}>{plant.lightDeficiency}.66%</Text>
                </View>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${plant.lightDeficiency}%`, backgroundColor: '#FFB800' }]} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Total Bar */}
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalPrice}>₹{plant.price * quantity}</Text>
          </View>
          <TouchableOpacity style={styles.addCartBtn} onPress={() => router.push('/checkout')}>
            <Text style={styles.addCartText}>Order (Cash on Delivery)</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  mainCard: {
    margin: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 40,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  imageBox: {
    width: '100%',
    height: 250,
    backgroundColor: '#FFF',
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantImg: {
    width: '80%',
    height: '80%',
  },
  plantName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
    marginBottom: 15,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000',
  },
  oldPrice: {
    fontSize: 16,
    color: '#FF6B6B',
    textDecorationLine: 'line-through',
    fontWeight: 'bold',
  },
  cartCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  infoBar: {
    marginHorizontal: 20,
    backgroundColor: '#D8F36C',
    borderRadius: 25,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  barTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  barSub: {
    fontSize: 12,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    padding: 5,
    gap: 15,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyActive: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  deliveryLabel: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  deliveryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  diagnosisSection: {
    paddingHorizontal: 25,
  },
  diagnosisTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  statContent: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statPercent: {
    fontSize: 12,
    color: '#999',
  },
  progressBg: {
    height: 6,
    backgroundColor: '#EEE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 80,
    backgroundColor: '#1A1A1A',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  totalLabel: {
    color: '#666',
    fontSize: 12,
  },
  totalPrice: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
  },
  addCartBtn: {
    backgroundColor: '#D8F36C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  addCartText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
