import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { getProductById } from '@/constants/products';

const { width } = Dimensions.get('window');

export default function DetailsScreen() {
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const params = useLocalSearchParams();
  const { addItem } = useCart();
  const { isDarkMode } = useUser();
  const insets = useSafeAreaInsets();

  const productId = (params.id as string) || 'plant_money';
  const productData = getProductById(productId);

  const plant = {
    id: productId,
    name: productData?.name || 'Money Plant (Epipremnum)',
    price: productData?.price || 299,
    oldPrice: productData?.oldPrice || Math.round((productData?.price || 299) * 1.5),
    rating: productData?.rating || '4.8',
    reviews: '2.4k',
    img: productData?.img || require('@/assets/images/office_plant.png'),
    desc: productData?.desc || 'A beautiful, low-maintenance plant perfect for indoor spaces.',
    waterDeficiency: 47,
    lightDeficiency: 81,
  };

  const bgColor = isDarkMode ? '#121212' : '#F5F9F6';
  const cardBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A2A1A';
  const subColor = isDarkMode ? '#AAAAAA' : '#556B55';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Top safe area */}
      <View style={{ height: insets.top, backgroundColor: isDarkMode ? '#1A1A1A' : '#E8F5E9' }} />

      {/* Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {/* Header over image */}
        <View style={[styles.imageSection, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E8F5E9' }]}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.headerBtn, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
            >
              <Ionicons name="chevron-back" size={24} color={textColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerBtn, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
              onPress={() => { setIsFav(!isFav); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            >
              <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={24} color={isFav ? '#FF4B4B' : textColor} />
            </TouchableOpacity>
          </View>

          <Image source={plant.img} style={styles.plantImg} resizeMode="contain" />
        </View>

        {/* Product Info Card */}
        <View style={[styles.infoCard, { backgroundColor: cardBg, borderColor }]}>
          {/* Rating pill */}
          {plant.rating && (
            <View style={styles.ratingRow}>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={14} color="#FFB800" />
                <Text style={styles.ratingText}>{plant.rating}</Text>
              </View>
              <Text style={[styles.reviewsText, { color: subColor }]}>{plant.reviews} Reviews</Text>
            </View>
          )}

          <Text style={[styles.plantName, { color: textColor }]}>{plant.name}</Text>
          <Text style={[styles.plantDesc, { color: subColor }]}>{plant.desc}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={[styles.currentPrice, { color: textColor }]}>₹{plant.price}</Text>
            <Text style={styles.oldPrice}>₹{plant.oldPrice}</Text>
            <View style={styles.discountPill}>
              <Text style={styles.discountText}>
                {Math.round(((plant.oldPrice - plant.price) / plant.oldPrice) * 100)}% OFF
              </Text>
            </View>
          </View>
        </View>

        {/* Quantity Selector */}
        <View style={[styles.qtyCard, { backgroundColor: cardBg, borderColor }]}>
          <Text style={[styles.qtyLabel, { color: textColor }]}>Quantity</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={[styles.qtyBtn, { backgroundColor: isDarkMode ? '#333' : '#F0F0F0' }]}
              onPress={() => { setQuantity(q => Math.max(1, q - 1)); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            >
              <Ionicons name="remove" size={20} color={textColor} />
            </TouchableOpacity>
            <Text style={[styles.qtyText, { color: textColor }]}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.qtyBtn, { backgroundColor: '#00C881' }]}
              onPress={() => { setQuantity(q => q + 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            >
              <Ionicons name="add" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={[styles.deliveryCard, { backgroundColor: isDarkMode ? 'rgba(0,200,129,0.08)' : 'rgba(0,200,129,0.06)', borderColor: isDarkMode ? 'rgba(0,200,129,0.2)' : 'rgba(0,200,129,0.15)' }]}>
          <View style={styles.deliveryIconWrap}>
            <MaterialCommunityIcons name="truck-delivery-outline" size={22} color="#00C881" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.deliveryTitle, { color: textColor }]}>Free Delivery</Text>
            <Text style={[styles.deliverySub, { color: subColor }]}>15-30 min · Delivery fee ₹40</Text>
          </View>
          <MaterialCommunityIcons name="clock-fast" size={20} color="#00C881" />
        </View>

        {/* Plant Diagnosis */}
        <View style={[styles.diagCard, { backgroundColor: cardBg, borderColor }]}>
          <Text style={[styles.diagTitle, { color: textColor }]}>Plant Health</Text>

          <View style={styles.statRow}>
            <View style={[styles.statIconBox, { backgroundColor: isDarkMode ? '#222' : '#E8F5E9' }]}>
              <Ionicons name="water-outline" size={18} color="#00C881" />
            </View>
            <View style={styles.statContent}>
              <View style={styles.statHeader}>
                <Text style={[styles.statLabel, { color: textColor }]}>Water Need</Text>
                <Text style={[styles.statPercent, { color: subColor }]}>{plant.waterDeficiency}%</Text>
              </View>
              <View style={[styles.progressBg, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]}>
                <View style={[styles.progressFill, { width: `${plant.waterDeficiency}%`, backgroundColor: '#00C881' }]} />
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={[styles.statIconBox, { backgroundColor: isDarkMode ? '#222' : '#FFF9E5' }]}>
              <Ionicons name="sunny-outline" size={18} color="#FFB800" />
            </View>
            <View style={styles.statContent}>
              <View style={styles.statHeader}>
                <Text style={[styles.statLabel, { color: textColor }]}>Light Need</Text>
                <Text style={[styles.statPercent, { color: subColor }]}>{plant.lightDeficiency}%</Text>
              </View>
              <View style={[styles.progressBg, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]}>
                <View style={[styles.progressFill, { width: `${plant.lightDeficiency}%`, backgroundColor: '#FFB800' }]} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar — always visible */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12), backgroundColor: isDarkMode ? '#1A1A1A' : '#FFF', borderTopColor: borderColor }]}>
        <View style={styles.bottomLeft}>
          <Text style={[styles.totalLabel, { color: subColor }]}>Total</Text>
          <Text style={[styles.totalPrice, { color: textColor }]}>₹{plant.price * quantity}</Text>
        </View>
        <TouchableOpacity
          style={styles.addBagBtn}
          activeOpacity={0.85}
          onPress={() => {
            for (let i = 0; i < quantity; i++) {
              addItem(plant.id);
            }
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push('/checkout');
          }}
        >
          <Ionicons name="bag-add" size={20} color="#FFF" />
          <Text style={styles.addBagText}>Add to Bag</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Image section
  imageSection: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantImg: {
    width: width * 0.55,
    height: width * 0.55,
    marginTop: 8,
  },

  // Info card
  infoCard: {
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,184,0,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFB800',
  },
  reviewsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  plantName: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },
  plantDesc: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '900',
  },
  oldPrice: {
    fontSize: 15,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  discountPill: {
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },

  // Quantity
  qtyCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  qtyLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  qtyBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 20,
    fontWeight: '900',
    minWidth: 24,
    textAlign: 'center',
  },

  // Delivery
  deliveryCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
  },
  deliveryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0,200,129,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  deliverySub: {
    fontSize: 12,
    marginTop: 2,
  },

  // Diagnosis
  diagCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  diagTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  statPercent: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Bottom bar — NOT absolute, sits at bottom of screen
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  bottomLeft: {},
  totalLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: '900',
  },
  addBagBtn: {
    backgroundColor: '#00C881',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 18,
  },
  addBagText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 16,
  },
});
