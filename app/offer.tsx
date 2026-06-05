import React from 'react';
import {
  StyleSheet, View, Text, ScrollView, Image, TouchableOpacity,
  Dimensions, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { PRODUCTS, Product } from '@/constants/products';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

// Define what each offer code shows
type OfferConfig = {
  title: string;
  subtitle: string;
  discount: number; // percentage or 0
  filterFn: (p: Product) => boolean;
  headerColors: [string, string];
  icon: string;
};

const OFFER_CONFIGS: Record<string, OfferConfig> = {
  GREEN60: {
    title: '60% OFF',
    subtitle: 'On All Indoor Plants',
    discount: 60,
    filterFn: (p) => p.id.startsWith('plant_'),
    headerColors: ['#00C881', '#00A86B'],
    icon: 'leaf',
  },
  NEWLEAF15: {
    title: '15% OFF',
    subtitle: 'New Account Signup Bonus',
    discount: 15,
    filterFn: (p) => p.id.startsWith('plant_') || p.id.startsWith('tool_'),
    headerColors: ['#6C63FF', '#4834DF'],
    icon: 'gift',
  },
  POTLOVE: {
    title: 'Buy 1 Get 1',
    subtitle: 'BOGO on Pots & Tools',
    discount: 50,
    filterFn: (p) => p.id.startsWith('tool_'),
    headerColors: ['#FF6B6B', '#EE5A24'],
    icon: 'pricetags',
  },
  FREESEED: {
    title: 'Free Seeds',
    subtitle: 'Free Seeds on Orders ₹499+',
    discount: 0,
    filterFn: (p) => p.id.startsWith('care_') || p.id.startsWith('fert_'),
    headerColors: ['#F9CA24', '#F0932B'],
    icon: 'sparkles',
  },
};

export default function OfferScreen() {
  const { code, offer, text } = useLocalSearchParams<{ code: string; offer: string; text: string }>();
  const { addItem, getItemQuantity, removeItem } = useCart();
  const { isDarkMode } = useUser();
  const insets = useSafeAreaInsets();

  const config = OFFER_CONFIGS[code || ''] || {
    title: offer || 'Special Offer',
    subtitle: text || 'Browse our collection',
    discount: 0,
    filterFn: (p: Product) => p.id.startsWith('plant_'),
    headerColors: ['#00C881', '#00A86B'] as [string, string],
    icon: 'flash',
  };

  const products = PRODUCTS.filter(config.filterFn);

  const getDiscountedPrice = (price: number) => {
    if (config.discount === 0) return price;
    return Math.round(price * (1 - config.discount / 100));
  };

  const bgColor = isDarkMode ? '#121212' : '#F5F9F6';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A2A1A';
  const subTextColor = isDarkMode ? '#AAAAAA' : '#556B55';
  const cardBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,200,129,0.1)';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="light-content" />

      {/* Gradient Header */}
      <LinearGradient
        colors={config.headerColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.headerIconWrap}>
            <Ionicons name={config.icon as any} size={28} color="#FFF" />
          </View>
          <Text style={styles.headerTitle}>{config.title}</Text>
          <Text style={styles.headerSubtitle}>{config.subtitle}</Text>
          {code && (
            <View style={styles.codePill}>
              <Text style={styles.codeText}>Use code: {code}</Text>
            </View>
          )}
        </View>

        <Text style={styles.productCount}>{products.length} items available</Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Products Grid */}
        <View style={styles.grid}>
          {products.map((plant) => {
            const qty = getItemQuantity(plant.id);
            const discountedPrice = getDiscountedPrice(plant.price);
            const hasDiscount = config.discount > 0;

            return (
              <TouchableOpacity
                key={plant.id}
                style={[styles.card, { backgroundColor: cardBg, borderColor }]}
                onPress={() => router.push({ pathname: '/details', params: { id: plant.id } })}
                activeOpacity={0.9}
              >
                {/* Discount badge */}
                {hasDiscount && (
                  <View style={[styles.discountBadge, { backgroundColor: config.headerColors[0] }]}>
                    <Text style={styles.discountText}>{config.discount}% OFF</Text>
                  </View>
                )}

                {/* Image */}
                <View style={[styles.imgBox, { backgroundColor: isDarkMode ? '#222' : 'rgba(0,200,129,0.04)' }]}>
                  {plant.img ? (
                    <Image source={plant.img} style={styles.productImg} resizeMode="contain" />
                  ) : (
                    <MaterialCommunityIcons name="leaf" size={48} color="#00C881" />
                  )}

                  {/* Rating badge */}
                  {plant.rating && (
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingText}>{plant.rating} ★</Text>
                    </View>
                  )}

                  {/* ETA badge */}
                  {plant.time && (
                    <View style={styles.etaBadge}>
                      <Ionicons name="timer-outline" size={10} color="#1A2A1A" />
                      <Text style={styles.etaText}>{plant.time}</Text>
                    </View>
                  )}
                </View>

                {/* Info */}
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardName, { color: textColor }]} numberOfLines={1}>
                    {plant.name}
                  </Text>

                  {plant.tag && (
                    <View style={[styles.tagPill, { backgroundColor: isDarkMode ? 'rgba(0,200,129,0.15)' : '#E8F5E9' }]}>
                      <Text style={[styles.tagText, { color: isDarkMode ? '#00C881' : '#2E7D32' }]}>{plant.tag}</Text>
                    </View>
                  )}

                  <View style={styles.priceRow}>
                    <View>
                      <Text style={[styles.cardPrice, { color: config.headerColors[0] }]}>
                        ₹{discountedPrice}
                      </Text>
                      {hasDiscount && (
                        <Text style={styles.oldPrice}>₹{plant.price}</Text>
                      )}
                    </View>

                    {qty === 0 ? (
                      <TouchableOpacity
                        style={[styles.addBtn, { borderColor: config.headerColors[0] }]}
                        onPress={(e) => {
                          e.stopPropagation();
                          addItem(plant.id);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                      >
                        <Text style={[styles.addText, { color: config.headerColors[0] }]}>ADD</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={[styles.qtySelector, { borderColor: config.headerColors[0] }]}>
                        <TouchableOpacity onPress={(e) => { e.stopPropagation(); removeItem(plant.id); }}>
                          <Ionicons name="remove" size={16} color={config.headerColors[0]} />
                        </TouchableOpacity>
                        <Text style={[styles.qtyText, { color: textColor }]}>{qty}</Text>
                        <TouchableOpacity onPress={(e) => { e.stopPropagation(); addItem(plant.id); }}>
                          <Ionicons name="add" size={16} color={config.headerColors[0]} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 4,
  },
  codePill: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  codeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  productCount: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 14,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  imgBox: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImg: {
    width: '75%',
    height: '75%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#267E3E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  etaBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  etaText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#1A2A1A',
  },
  cardInfo: {
    padding: 12,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  tagPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '900',
  },
  oldPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addBtn: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  addText: {
    fontWeight: '900',
    fontSize: 11,
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 8,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '900',
    minWidth: 14,
    textAlign: 'center',
  },
});
