import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCart } from '@/context/CartContext';
import { StatusBar } from 'expo-status-bar';
import { useUser } from '@/context/UserContext';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Indoor', icon: '🏠', color: 'rgba(232,245,233,0.05)' },
  { id: '2', name: 'Outdoor', icon: '☀️', color: 'rgba(255,249,196,0.05)' },
  { id: '3', name: 'Succulents', icon: '🌵', color: 'rgba(225,245,254,0.05)' },
  { id: '4', name: 'Seeds', icon: '🌱', color: 'rgba(243,229,245,0.05)' },
  { id: '5', name: 'Pots', icon: '🏺', color: 'rgba(255,224,178,0.05)' },
  { id: '6', name: 'Fertilizers', icon: '🧪', color: 'rgba(241,248,233,0.05)' },
  { id: '7', name: 'Tools', icon: '✂️', color: 'rgba(252,228,236,0.05)' },
  { id: '8', name: 'Pesticides', icon: '🛡', color: 'rgba(232,234,246,0.05)' },
  { id: '9', name: 'Soil Mix', icon: '🪴', color: 'rgba(239,235,233,0.05)' },
];

const PLANT_CARE_ESSENTIALS = [
  { id: 'care_neem', name: 'Neem Oil Spray', price: '₹199', desc: 'Organic pest control', icon: 'spray-bottle' },
  { id: 'fert_npk', name: 'NPK 19-19-19', price: '₹129', desc: 'All-purpose fertilizer', icon: 'leaf-circle' },
  { id: 'tool_shears', name: 'Pruning Shears', price: '₹299', desc: 'Sharp stainless steel', icon: 'content-cut' },
  { id: 'care_potting', name: 'Potting Mix', price: '₹149', desc: 'Rich organic blend', icon: 'flower-pollen' },
  { id: 'care_root', name: 'Root Hormone', price: '₹249', desc: 'Fast root growth', icon: 'sprout' },
];

const SEASONAL_PICKS = [
  { id: 'plant_marigold', name: 'Marigold', price: '₹29', season: 'Summer', img: require('@/assets/images/succulent_plant.png') },
  { id: 'plant_dahlia', name: 'Dahlia', price: '₹79', season: 'Monsoon', img: require('@/assets/images/office_plant.png') },
  { id: 'plant_chrys', name: 'Chrysanthemum', price: '₹99', season: 'Winter', img: require('@/assets/images/fiddle_leaf_fig.png') },
  { id: 'plant_hibiscus', name: 'Hibiscus', price: '₹49', season: 'All Year', img: require('@/assets/images/succulent_plant.png') },
];

const TRENDING = [
  { id: 'plant_snake', name: 'Snake Plant', price: '₹499', rating: '4.8', img: require('@/assets/images/succulent_plant.png') },
  { id: 'plant_fiddle', name: 'Fiddle Leaf', price: '₹1299', rating: '4.9', img: require('@/assets/images/fiddle_leaf_fig.png') },
  { id: 'plant_peace', name: 'Peace Lily', price: '₹349', rating: '4.7', img: require('@/assets/images/office_plant.png') },
  { id: 'plant_aloe', name: 'Aloe Vera', price: '₹199', rating: '4.6', img: require('@/assets/images/succulent_plant.png') },
  { id: 'plant_money', name: 'Money Plant', price: '₹149', rating: '4.5', img: require('@/assets/images/office_plant.png') },
  { id: 'plant_tulsi', name: 'Tulsi', price: '₹49', rating: '5.0', img: require('@/assets/images/succulent_plant.png') },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const { isDarkMode } = useUser();

  const bgColor = isDarkMode ? '#121212' : '#F5F9F6';
  const headerBg = isDarkMode ? '#1A1A1A' : '#1A2A1A';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A2A1A';
  const subTextColor = isDarkMode ? '#AAAAAA' : '#556B55';
  const cardBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,200,129,0.1)';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={{ height: insets.top, backgroundColor: headerBg }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: headerBg }]}>
          <Text style={styles.headerTitle}>Explore Garden</Text>
          <View style={[styles.searchBar, { backgroundColor: isDarkMode ? '#242424' : 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name="search" size={20} color={isDarkMode ? '#AAA' : '#EEE'} />
            <TextInput 
              style={[styles.searchInput, { color: '#FFF' }]} 
              placeholder="Search plants, tools, seeds..." 
              placeholderTextColor={isDarkMode ? '#666' : 'rgba(255,255,255,0.6)'} 
            />
          </View>
        </View>

        {/* Categories Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Categories</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catCard, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF', borderColor }]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/store'); }}
              >
                <Text style={styles.catEmoji}>{cat.icon}</Text>
                <Text style={[styles.catName, { color: textColor }]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Plant Care Essentials */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Plant Care Essentials</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {PLANT_CARE_ESSENTIALS.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.careCard, { backgroundColor: cardBg, borderColor }]}
                onPress={() => { addItem(item.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              >
                <View style={[styles.careIconBox, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#F8F9FA' }]}>
                  <MaterialCommunityIcons name={item.icon as any} size={28} color="#00C881" />
                </View>
                <Text style={[styles.careName, { color: textColor }]} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.careDesc, { color: subTextColor }]} numberOfLines={1}>{item.desc}</Text>
                <View style={styles.carePriceRow}>
                  <Text style={styles.carePrice}>{item.price}</Text>
                  <View style={styles.miniAdd}>
                    <Ionicons name="add" size={14} color="#00C881" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Seasonal Picks */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Seasonal Picks</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {SEASONAL_PICKS.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.seasonCard, { backgroundColor: cardBg, borderColor }]}
                onPress={() => { addItem(item.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              >
                <Image source={item.img} style={styles.seasonImg} resizeMode="contain" />
                <View style={styles.seasonBadge}>
                  <Text style={styles.seasonBadgeText}>{item.season}</Text>
                </View>
                <Text style={[styles.seasonName, { color: textColor }]}>{item.name}</Text>
                <Text style={styles.seasonPrice}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending Plants */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Trending Plants</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          <View style={styles.plantGrid}>
            {TRENDING.map(plant => (
              <TouchableOpacity key={plant.id} style={[styles.plantCard, { backgroundColor: cardBg, borderColor }]} onPress={() => router.push({ pathname: '/details', params: { id: plant.id } })}>
                <View style={[styles.imgBox, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,200,129,0.03)' }]}>
                  <Image source={plant.img} style={styles.pImg} resizeMode="contain" />
                  <View style={styles.ratingPill}>
                    <Text style={styles.ratingText}>{plant.rating} ★</Text>
                  </View>
                </View>
                <View style={[styles.pInfo, { backgroundColor: cardBg }]}>
                  <Text style={[styles.pName, { color: textColor }]}>{plant.name}</Text>
                  <View style={styles.pRow}>
                    <Text style={[styles.pPrice, { color: textColor }]}>{plant.price}</Text>
                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={() => { addItem(plant.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    >
                      <Text style={styles.addBtnText}>ADD</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    padding: 22,
    backgroundColor: '#1A1A1A',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#FFF', marginBottom: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242424',
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#FFF' },

  section: { paddingTop: 22, paddingHorizontal: 20 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#FFF', marginBottom: 14 },
  seeAll: { color: '#00C881', fontWeight: 'bold', fontSize: 13, marginBottom: 14 },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  catCard: {
    width: (width - 60) / 3,
    height: 85,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  catEmoji: { fontSize: 26 },
  catName: { fontSize: 11, fontWeight: '700', color: '#E0E0E0' },

  hScroll: { gap: 12, paddingBottom: 5 },
  careCard: {
    width: 135,
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  careIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  careName: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  careDesc: { fontSize: 10, color: '#AAA', marginTop: 2 },
  carePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  carePrice: { fontSize: 15, fontWeight: '900', color: '#00C881' },
  miniAdd: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#00C881',
    alignItems: 'center',
    justifyContent: 'center',
  },

  seasonCard: {
    width: 120,
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  seasonImg: { width: 70, height: 70, marginBottom: 6 },
  seasonBadge: {
    backgroundColor: 'rgba(0,200,129,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  seasonBadgeText: { fontSize: 9, fontWeight: '800', color: '#00C881' },
  seasonName: { fontSize: 12, fontWeight: '700', color: '#FFF' },
  seasonPrice: { fontSize: 14, fontWeight: '900', color: '#00C881', marginTop: 2 },

  plantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  plantCard: {
    width: (width - 52) / 2,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  imgBox: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 15,
  },
  pImg: { width: '100%', height: '100%' },
  ratingPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#00C881',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  pInfo: { padding: 12, backgroundColor: '#1E1E1E' },
  pName: { fontSize: 14, fontWeight: 'bold', color: '#FFF', marginBottom: 6 },
  pRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pPrice: { fontSize: 15, fontWeight: '900', color: '#FFF' },
  addBtn: {
    borderWidth: 1.5,
    borderColor: '#00C881',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  addBtnText: { color: '#00C881', fontSize: 10, fontWeight: '900' },
});
