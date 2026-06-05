import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCart } from '@/context/CartContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function StoreScreen() {
  const { addItem, removeItem, getItemQuantity } = useCart();
  const qty = getItemQuantity('plant_desk');

  return (
    <View style={styles.container}>
      {/* Blurred Background */}
      <Image source={require('@/assets/images/succulent_plant.png')} style={styles.bgBlur} blurRadius={100} />
      <View style={styles.overlay} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="heart-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          
          {/* Plant Carousel Area */}
          <View style={styles.carouselContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled snapToAlignment="center">
              {[1, 2, 3].map((_, i) => (
                <View key={i} style={styles.carouselItem}>
                  <View style={styles.plantGlass}>
                    <Image source={require('@/assets/images/office_plant.png')} style={styles.carouselImg} resizeMode="contain" />
                    <Text style={styles.carouselTitle}>Desk Plant</Text>
                    <View style={styles.carouselPriceRow}>
                      <Text style={styles.carouselPrice}>₹147.00 <Text style={styles.carouselOld}>₹195</Text></Text>
                      <TouchableOpacity 
                        style={styles.smallCartBtn}
                        onPress={() => {
                          addItem('plant_desk');
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                      >
                        <Ionicons name="cart-outline" size={18} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
            
            {/* Pagination Dots */}
            <View style={styles.dotsRow}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          {/* Product Details Section */}
          <View style={styles.detailsSection}>
            <View style={styles.detailsCard}>
              <View style={styles.detailsHeader}>
                <View>
                  <Text style={styles.dTitle}>Desk Plant</Text>
                  <Text style={styles.dSubtitle}>240 Reviews</Text>
                </View>
                <View style={styles.counter}>
                  <TouchableOpacity 
                    style={styles.countBtn}
                    onPress={() => {
                      if (qty > 0) {
                        removeItem('plant_desk');
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                    }}
                  >
                    <Text style={styles.countText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.countVal}>{qty}</Text>
                  <TouchableOpacity 
                    style={[styles.countBtn, styles.countBtnActive]}
                    onPress={() => {
                      addItem('plant_desk');
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text style={styles.countText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.deliveryRow}>
                <Text style={styles.deliveryLabel}>Delivery fee</Text>
                <Text style={styles.deliveryVal}>₹40.00</Text>
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Bottom Add to Cart Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.pricePill}>
            <View style={styles.priceInfo}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalVal}>₹{147.00 * (qty || 1)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.addToCartBtn}
              onPress={() => {
                addItem('plant_desk');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }}
            >
              <Text style={styles.btnText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgBlur: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 50, 30, 0.4)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 15,
    zIndex: 10,
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  carouselContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  carouselItem: {
    width: width,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  plantGlass: {
    width: '100%',
    borderRadius: 50,
    padding: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(180, 240, 76, 0.3)',
    alignItems: 'center',
  },
  carouselImg: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  carouselTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  carouselPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  carouselPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  carouselOld: {
    fontSize: 14,
    color: '#FF3B30',
    textDecorationLine: 'line-through',
  },
  smallCartBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#FFF',
  },
  detailsSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  detailsCard: {
    backgroundColor: '#B2F44C',
    borderRadius: 40,
    padding: 25,
    gap: 20,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  dSubtitle: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.5)',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    padding: 5,
    gap: 15,
  },
  countBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBtnActive: {
    backgroundColor: '#B2F44C',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  countText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  countVal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 30,
  },
  deliveryLabel: {
    fontSize: 16,
    color: '#FFF',
  },
  deliveryVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  pricePill: {
    backgroundColor: '#B2F44C',
    borderRadius: 40,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  priceInfo: {
    paddingLeft: 20,
  },
  totalLabel: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  totalVal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  addToCartBtn: {
    backgroundColor: '#181818',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 30,
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
