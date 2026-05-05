import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

const FAST_PLANTS = [
  { id: '1', name: 'Tulsi (Holy Basil)', price: '₹49', time: '12 MINS', rating: '4.9', img: require('@/assets/images/succulent_plant.png') },
  { id: '2', name: 'Money Plant', price: '₹149', time: '15 MINS', rating: '4.8', img: require('@/assets/images/office_plant.png') },
  { id: '3', name: 'Aloe Vera (Indian)', price: '₹99', time: '10 MINS', rating: '4.9', img: require('@/assets/images/succulent_plant.png') },
  { id: '4', name: 'Ashwagandha', price: '₹199', time: '18 MINS', rating: '4.7', img: require('@/assets/images/fiddle_leaf_fig.png') },
  { id: '5', name: 'Peace Lily', price: '₹299', time: '20 MINS', rating: '4.6', img: require('@/assets/images/office_plant.png') },
  { id: '6', name: 'Snake Plant', price: '₹349', time: '12 MINS', rating: '4.8', img: require('@/assets/images/succulent_plant.png') },
  { id: '7', name: 'Curry Leaf', price: '₹79', time: '10 MINS', rating: '4.4', img: require('@/assets/images/office_plant.png') },
  { id: '8', name: 'Jasmine (Mogra)', price: '₹129', time: '25 MINS', rating: '4.7', img: require('@/assets/images/fiddle_leaf_fig.png') },
];

export default function HomeScreen() {
  const [addedItems, setAddedItems] = React.useState<string[]>([]);
  const [location, setLocation] = React.useState('Fetching location...');
  const [area, setArea] = React.useState('Finding area...');
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Bangalore');
        setArea('MG Road, Central');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      });
      
      if (address.length > 0) {
        setArea(`${address[0].name}, ${address[0].street}`);
        setLocation(address[0].city || 'Bangalore');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={{ height: insets.top, backgroundColor: '#1A2A1A' }} />
      
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          
          {/* Top Wallpaper Hero */}
          <View style={styles.heroWall}>
            <Image 
              source={require('@/assets/images/fiddle_leaf_fig.png')} 
              style={styles.wallImg} 
              blurRadius={2}
            />
            <LinearGradient colors={['rgba(26,42,26,0.8)', 'transparent']} style={StyleSheet.absoluteFill} />
            
            <View style={styles.searchHeaderWall}>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={24} color="#D8F36C" />
                <View style={{ marginLeft: 8 }}>
                  <Text style={[styles.locationTitle, { color: '#FFF' }]}>{location}</Text>
                  <Text style={[styles.locationSub, { color: '#CCC' }]} numberOfLines={1}>{area}</Text>
                </View>
                <TouchableOpacity style={styles.avatarBtn}>
                  <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.avatarSmall} />
                </TouchableOpacity>
              </View>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#666" />
                <TextInput style={styles.searchInput} placeholder="Search for plants, pots, or seeds..." />
                <View style={styles.vDivider} />
                <Ionicons name="mic-outline" size={20} color="#00C881" />
              </View>
            </View>
          </View>

          {/* Offer Carousel */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled snapToAlignment="center" contentContainerStyle={styles.bannerRow}>
            {[
              { id: '1', offer: '60% OFF', text: 'On All Indoor Plants', code: 'GREEN60', colors: ['#00C881', '#009D65'] },
              { id: '2', offer: 'BOGO', text: 'Buy 1 Get 1 on Pots', code: 'POTLOVE', colors: ['#FF6F00', '#FF8F00'] },
              { id: '3', offer: 'FREEBIE', text: 'Free Seeds over ₹499', code: 'FREESEED', colors: ['#673AB7', '#512DA8'] },
            ].map(offer => (
              <TouchableOpacity key={offer.id} style={styles.offerBanner}>
                <LinearGradient colors={offer.colors as any} style={styles.bannerGradient}>
                  <View>
                    <Text style={styles.bannerOffer}>{offer.offer}</Text>
                    <Text style={styles.bannerText}>{offer.text}</Text>
                    <Text style={styles.bannerCode}>Code: {offer.code}</Text>
                  </View>
                  <Image source={require('@/assets/images/office_plant.png')} style={styles.bannerImg} />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* World Categories Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Vibe</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {[
              { id: '1', name: 'Outdoor', icon: 'sunny', color: '#FFF9C4' },
              { id: '2', name: 'Water Plants', icon: 'water', color: '#E1F5FE' },
              { id: '4', name: 'Air Purifying', icon: 'leaf', color: '#E8F5E9' },
              { id: '5', name: 'Rare Finds', icon: 'diamond', color: '#F3E5F5' },
            ].map(cat => (
              <TouchableOpacity key={cat.id} style={[styles.catCard, { backgroundColor: cat.color }]}>
                <Ionicons name={cat.icon as any} size={24} color="#000" />
                <Text style={styles.catName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Plant Therapy - Premium Banner */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Plant Therapy</Text>
          </View>
          <TouchableOpacity style={styles.therapyCard} onPress={() => router.push('/therapy')}>
            <Image source={require('@/assets/images/office_plant.png')} style={styles.therapyImg} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.therapyOverlay}>
              <View>
                <Text style={styles.therapyTitle}>Stress Relief Session</Text>
                <Text style={styles.therapySub}>Botanical healing for your mental health</Text>
              </View>
              <TouchableOpacity style={styles.bookBtn}>
                <Text style={styles.bookText}>Book Slot</Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>

          {/* All Listed Plants Grid */}
          <View style={[styles.sectionHeader, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>All Listed Plants</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Sort By</Text></TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {FAST_PLANTS.map(plant => (
              <TouchableOpacity 
                key={plant.id} 
                onPress={() => router.push('/details')}
                style={styles.productCard}
              >
                <View style={styles.imgBox}>
                  <Image source={plant.img} style={styles.pImg} resizeMode="contain" />
                  <View style={styles.etaBadge}>
                    <Ionicons name="timer-outline" size={10} color="#000" />
                    <Text style={styles.etaText}>{plant.time}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>{plant.rating} <Ionicons name="star" size={10} color="#FFF" /></Text>
                  </View>
                </View>
                <View style={styles.pInfo}>
                  <Text style={styles.pName} numberOfLines={1}>{plant.name}</Text>
                  <Text style={styles.pPrice}>{plant.price}</Text>
                  <TouchableOpacity 
                    style={[styles.addBtn, addedItems.includes(plant.id) && styles.addedBtn]}
                    onPress={() => setAddedItems(prev => addedItems.includes(plant.id) ? prev.filter(i => i !== plant.id) : [...prev, plant.id])}
                  >
                    <Text style={[styles.addText, addedItems.includes(plant.id) && styles.addedText]}>
                      {addedItems.includes(plant.id) ? 'ADDED' : 'ADD'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>

        {/* Blinkit-style Floating Bag */}
        {addedItems.length > 0 && (
          <TouchableOpacity 
            style={styles.floatingBag} 
            onPress={() => router.push('/tracking')}
            activeOpacity={0.9}
          >
            <LinearGradient colors={['#00C881', '#009D65']} style={styles.bagGradient}>
              <Ionicons name="bag-handle" size={24} color="#FFF" />
              <View style={styles.bagBadge}>
                <Text style={styles.bagBadgeText}>{addedItems.length}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  heroWall: {
    width: '100%',
    height: 220,
    backgroundColor: '#1A2A1A',
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: 20,
  },
  wallImg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  searchHeaderWall: {
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  locationSub: {
    fontSize: 12,
    color: '#666',
  },
  avatarBtn: {
    marginLeft: 'auto',
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEE',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  vDivider: {
    width: 1,
    height: 25,
    backgroundColor: '#DDD',
    marginHorizontal: 15,
  },
  bannerRow: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  offerBanner: {
    width: width - 40,
    height: 150,
    borderRadius: 25,
    overflow: 'hidden',
  },
  bannerGradient: {
    flex: 1,
    flexDirection: 'row',
    padding: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerOffer: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
  },
  bannerText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  bannerCode: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  bannerImg: {
    width: 120,
    height: 120,
  },
  categoryRow: {
    paddingLeft: 20,
    gap: 15,
    marginBottom: 30,
    paddingRight: 20,
  },
  catCard: {
    width: 100,
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
    fontWeight: '700',
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  seeAll: {
    color: '#00C881',
    fontWeight: '700',
  },
  therapyCard: {
    marginHorizontal: 20,
    height: 200,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 30,
  },
  therapyImg: {
    width: '100%',
    height: '100%',
  },
  therapyOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  therapyTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  therapySub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 5,
  },
  bookBtn: {
    backgroundColor: '#00C881',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  bookText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 60) / 2,
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  imgBox: {
    height: 160,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pImg: {
    width: '80%',
    height: '80%',
  },
  etaBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  etaText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
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
  pInfo: {
    padding: 15,
  },
  pName: {
    fontSize: 16,
    fontWeight: '700',
  },
  pTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  pPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  pPrice: {
    fontSize: 18,
    fontWeight: '900',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00C881',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFF',
  },
  addedBtn: {
    backgroundColor: '#00C881',
  },
  addText: {
    color: '#00C881',
    fontWeight: 'bold',
    fontSize: 12,
  },
  addedText: {
    color: '#FFF',
  },
  floatingBag: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 65,
    height: 65,
    borderRadius: 35,
    overflow: 'visible',
    shadowColor: '#00C881',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  bagGradient: {
    flex: 1,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  bagBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
