import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { PRODUCTS } from '@/constants/products';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - 20 * 2 - CARD_GAP) / 2;

export default function RoomScreen() {
  const { room } = useLocalSearchParams<{ room: string }>();
  const { addItem } = useCart();
  const { isDarkMode } = useUser();
  const insets = useSafeAreaInsets();

  const bgColor = isDarkMode ? '#121212' : '#F5F9F6';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A2A1A';
  const subTextColor = isDarkMode ? '#AAAAAA' : '#556B55';
  const cardBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,200,129,0.1)';

  const roomPlants = PRODUCTS.filter(
    (p) => p.rooms?.includes(room ?? '') && p.img
  );

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
        <Text style={[styles.headerTitle, { color: textColor }]}>
          {room} Plants
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Subtitle */}
      <Text style={[styles.subtitle, { color: subTextColor }]}>
        {roomPlants.length} plant{roomPlants.length !== 1 ? 's' : ''} perfect for your {room?.toLowerCase()}
      </Text>

      {/* Plant Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {roomPlants.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={64} color={subTextColor} />
            <Text style={[styles.emptyTitle, { color: textColor }]}>
              No plants found
            </Text>
            <Text style={[styles.emptySubtitle, { color: subTextColor }]}>
              We don't have any plants for this room yet.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {roomPlants.map((plant) => (
              <TouchableOpacity
                key={plant.id}
                style={[styles.card, { backgroundColor: cardBg, borderColor }]}
                activeOpacity={0.9}
                onPress={() =>
                  router.push({ pathname: '/details', params: { id: plant.id } })
                }
              >
                {/* Image */}
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
                </View>

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

                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        addItem(plant.id);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <Text style={styles.addText}>ADD</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 100,
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
});
