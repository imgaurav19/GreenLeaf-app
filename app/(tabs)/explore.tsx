import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Indoor', icon: 'home', color: '#E8F5E9' },
  { id: '2', name: 'Outdoor', icon: 'sunny', color: '#FFF9C4' },
  { id: '3', name: 'Succulents', icon: 'water', color: '#E1F5FE' },
  { id: '4', name: 'Seeds', icon: 'leaf', color: '#F3E5F5' },
  { id: '5', name: 'Pots', icon: 'cube', color: '#FFE0B2' },
  { id: '6', name: 'Fertilizers', icon: 'flask', color: '#F1F8E9' },
];

const ALL_PLANTS = [
  { id: '1', name: 'Snake Plant', price: '₹499', rating: '4.8', img: require('@/assets/images/succulent_plant.png') },
  { id: '2', name: 'Fiddle Leaf', price: '₹1299', rating: '4.9', img: require('@/assets/images/fiddle_leaf_fig.png') },
  { id: '3', name: 'Peace Lily', price: '₹349', rating: '4.7', img: require('@/assets/images/office_plant.png') },
  { id: '4', name: 'Aloe Vera', price: '₹199', rating: '4.6', img: require('@/assets/images/succulent_plant.png') },
  { id: '5', name: 'Money Plant', price: '₹149', rating: '4.5', img: require('@/assets/images/office_plant.png') },
  { id: '6', name: 'Tulsi', price: '₹49', rating: '5.0', img: require('@/assets/images/succulent_plant.png') },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top, backgroundColor: '#1A2A1A' }} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore Garden</Text>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput style={styles.searchInput} placeholder="Search plants, tools, seeds..." />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat.id} style={[styles.catCard, { backgroundColor: cat.color }]}>
                <Ionicons name={cat.icon as any} size={28} color="#1A2A1A" />
                <Text style={styles.catName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Plants</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          
          <View style={styles.plantGrid}>
            {ALL_PLANTS.map(plant => (
              <TouchableOpacity key={plant.id} style={styles.plantCard} onPress={() => router.push('/details')}>
                <View style={styles.imgBox}>
                  <Image source={plant.img} style={styles.pImg} resizeMode="contain" />
                </View>
                <View style={styles.pInfo}>
                  <Text style={styles.pName}>{plant.name}</Text>
                  <View style={styles.pRow}>
                    <Text style={styles.pPrice}>{plant.price}</Text>
                    <View style={styles.pRating}>
                      <Ionicons name="star" size={12} color="#FFB800" />
                      <Text style={styles.pRatingText}>{plant.rating}</Text>
                    </View>
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
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    padding: 25,
    backgroundColor: '#1A2A1A',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 55,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  section: {
    padding: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
  seeAll: {
    color: '#00C881',
    fontWeight: 'bold',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'space-between',
  },
  catCard: {
    width: (width - 80) / 3,
    height: 100,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  catName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  plantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  plantCard: {
    width: (width - 65) / 2,
    backgroundColor: '#F9F9F9',
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  imgBox: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  pImg: {
    width: '100%',
    height: '100%',
  },
  pInfo: {
    padding: 15,
    backgroundColor: '#FFF',
  },
  pName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#00C881',
  },
  pRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pRatingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
});
