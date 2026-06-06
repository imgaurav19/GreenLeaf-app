import React from 'react';
import {
  StyleSheet, View, Text, ScrollView, Image, TouchableOpacity,
  Dimensions, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { PRODUCTS, getProductById } from '@/constants/products';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - 20 * 2 - CARD_GAP) / 2;

// Map vibes to filter logic
const VIBE_FILTERS: Record<string, (p: typeof PRODUCTS[0]) => boolean> = {
  'All': () => true,
  'Living Room': (p) => p.rooms?.includes('Living Room') ?? false,
  'Bedroom': (p) => p.rooms?.includes('Bedroom') ?? false,
  'Library': (p) => p.rooms?.includes('Library') ?? false,
  'Kitchen': (p) => p.rooms?.includes('Kitchen') ?? false,
  'Bathroom': (p) => p.rooms?.includes('Bathroom') ?? false,
  'Balcony': (p) => p.rooms?.includes('Balcony') ?? false,
  'Outdoor': (p) => p.season === 'Summer' || (p.rooms?.includes('Outdoor') ?? false),
  'Aquatic': (p) => p.rooms?.includes('Bathroom') ?? false,
  'Air Pure': (p) => p.tag?.includes('Air') ?? false,
  'Rare': (p) => p.tag === 'Rare',
  'Seasonal': (p) => p.season !== 'All Year',
  'Flowering': (p) => !!p.season,
};

const ROOM_ICONS: Record<string, string> = {
  'All': 'grid',
  'Living Room': 'leaf',
  'Bedroom': 'bed',
  'Library': 'book',
  'Kitchen': 'restaurant',
  'Bathroom': 'water',
  'Balcony': 'sunny',
  'Outdoor': 'sunny-outline',
  'Aquatic': 'water-outline',
  'Air Pure': 'leaf-outline',
  'Rare': 'diamond-outline',
  'Seasonal': 'calendar-outline',
  'Flowering': 'flower-outline',
};

export default function RoomScreen() {
  const { room } = useLocalSearchParams<{ room: string }>();
  const { addItem, removeItem, getItemQuantity, itemCount, items } = useCart();
  const { isDarkMode } = useUser();
  const insets = useSafeAreaInsets();

  const bgColor = isDarkMode ? '#121212' : '#F5F9F6';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A2A1A';
  const subTextColor = isDarkMode ? '#AAAAAA' : '#556B55';
  const cardBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,200,129,0.1)';

  const filterFn = VIBE_FILTERS[room ?? 'All'] || ((p: typeof PRODUCTS[0]) => p.rooms?.includes(room ?? '') ?? false);
  const roomPlants = PRODUCTS.filter((p) => p.img && filterFn(p));

  // Calculate total price for floating bag
  const totalPrice = items.reduce((sum, item) => {
    const product = getProductById(item.id);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  const roomLabel = room === 'All' ? 'All' : room;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Safe area spacer */}
      <View style={{ height: insets.top, backgroundColor: bgColor }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: cardBg }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={22} color={textColor} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name={(ROOM_ICONS[room ?? 'All'] || 'leaf') as any} size={20} color="#00C881" />
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {roomLabel} Plants
          </Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Subtitle */}
      <Text style={[styles.subtitle, { color: subTextColor }]}>
        {roomPlants.length} plant{roomPlants.length !== 1 ? 's' : ''} perfect for your {roomLabel?.toLowerCase()}
      </Text>

      {/* Plant Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: itemCount > 0 ? 160 : 100 }]}
      >
        {roomPlants.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={64} color={subTextColor} />
            <Text style={[styles.emptyTitle, { color: textColor }]}>
              No plants found
            </Text>
            <Text style={[styles.emptySubtitle, { color: subTextColor }]}>
              We don't have any plants for this category yet.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {roomPlants.map((plant) => {
              const qty = getItemQuantity(plant.id);
              return (
                <View
                  key={plant.id}
                  style={[styles.card, { backgroundColor: cardBg, borderColor }]}
                >
                  {/* Tappable image area for details */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() =>
                      router.push({ pathname: '/details', params: { id: plant.id } })
                    }
                  >
                    <View
                      style={[
                        styles.imgBox,
                        {
                          backgroundColor: isDarkMode
                            ? '#222'
                            : 'rgba(0,200,129,0.04)',
                        },
                      ]}
                    >
                      <Image
                        source={plant.img}
                        style={styles.plantImg}
                        resizeMode="contain"
                      />

                      {/* Rating badge */}
                      {plant.rating && (
                        <View style={styles.ratingBadge}>
                          <Text style={styles.ratingText}>{plant.rating} ★</Text>
                        </View>
                      )}

                      {/* Delivery ETA */}
                      <View style={styles.etaBadge}>
                        <Ionicons name="timer-outline" size={10} color="#1A2A1A" />
                        <Text style={styles.etaText}>{plant.time || '15 MINS'}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Info */}
                  <View style={styles.infoSection}>
                    <Text
                      style={[styles.plantName, { color: textColor }]}
                      numberOfLines={1}
                    >
                      {plant.name}
                    </Text>

                    <View style={styles.priceRow}>
                      <View>
                        <Text style={[styles.price, { color: textColor }]}>
                          ₹{plant.price}
                        </Text>
                        {plant.oldPrice && (
                          <Text style={[styles.oldPrice, { color: subTextColor }]}>
                            ₹{plant.oldPrice}
                          </Text>
                        )}
                      </View>

                      {/* Quantity Controls */}
                      {qty === 0 ? (
                        <TouchableOpacity
                          style={styles.addBtn}
                          onPress={() => {
                            addItem(plant.id);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          }}
                        >
                          <Text style={styles.addText}>ADD</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.qtySelector, { borderColor: isDarkMode ? '#333' : '#E0E0E0' }]}>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => {
                              removeItem(plant.id);
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                          >
                            <Ionicons name="remove" size={16} color="#00C881" />
                          </TouchableOpacity>
                          <Text style={[styles.qtyText, { color: textColor }]}>{qty}</Text>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => {
                              addItem(plant.id);
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                          >
                            <Ionicons name="add" size={16} color="#00C881" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Floating Cart Bag */}
      {itemCount > 0 && (
        <View style={[styles.floatingBag, { bottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={styles.floatingBagInner}
            activeOpacity={0.92}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/checkout');
            }}
          >
            <View style={styles.bagLeft}>
              <View style={styles.bagIconWrap}>
                <Ionicons name="bag-handle" size={22} color="#FFF" />
                <View style={styles.bagBadge}>
                  <Text style={styles.bagBadgeText}>{itemCount}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.bagItemCount}>{itemCount} item{itemCount !== 1 ? 's' : ''}</Text>
                <Text style={styles.bagTotal}>₹{totalPrice}</Text>
              </View>
            </View>
            <View style={styles.bagRight}>
              <Text style={styles.bagBtnText}>View Bag</Text>
              <Ionicons name="arrow-forward" size={18} color="#000" />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 4,
  },
  imgBox: {
    width: '100%',
    height: CARD_WIDTH * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  plantImg: {
    width: '80%',
    height: '80%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '800',
  },
  etaBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#D8F36C',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  etaText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#1A2A1A',
  },
  infoSection: {
    padding: 12,
    gap: 8,
  },
  plantName: {
    fontSize: 14,
    fontWeight: '800',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
  },
  oldPrice: {
    fontSize: 11,
    fontWeight: '600',
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
  addBtn: {
    backgroundColor: '#00C881',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 14,
    shadowColor: '#00C881',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  addText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // Quantity Selector
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,200,129,0.08)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#00C881',
    paddingHorizontal: 2,
    height: 34,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '900',
    minWidth: 18,
    textAlign: 'center',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Floating Cart Bag
  floatingBag: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  floatingBagInner: {
    backgroundColor: '#1A2A1A',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 16,
  },
  bagLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bagIconWrap: {
    position: 'relative',
  },
  bagBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#00C881',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  bagBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  bagItemCount: {
    color: '#AAAAAA',
    fontSize: 11,
    fontWeight: '600',
  },
  bagTotal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  bagRight: {
    backgroundColor: '#D8F36C',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 22,
  },
  bagBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900',
  },
});
