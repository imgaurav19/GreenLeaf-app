import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, TextInput, Dimensions } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const FAST_PLANTS = [
  { id: '1', name: 'Tulsi (Holy Basil)', price: '₹49', time: '10 min', rating: '4.9', img: require('@/assets/images/succulent_plant.png') },
  { id: '2', name: 'Money Plant', price: '₹149', time: '15 min', rating: '4.8', img: require('@/assets/images/office_plant.png') },
  { id: '3', name: 'Aloe Vera (Indian)', price: '₹99', time: '10 min', rating: '4.9', img: require('@/assets/images/succulent_plant.png') },
  { id: '4', name: 'Ashwagandha', price: '₹199', time: '20 min', rating: '4.7', img: require('@/assets/images/fiddle_leaf_fig.png') },
  { id: '5', name: 'Peace Lily', price: '₹299', time: '18 min', rating: '4.6', img: require('@/assets/images/office_plant.png') },
  { id: '6', name: 'Snake Plant', price: '₹349', time: '12 min', rating: '4.8', img: require('@/assets/images/succulent_plant.png') },
  { id: '7', name: 'Curry Leaf', price: '₹79', time: '10 min', rating: '4.4', img: require('@/assets/images/office_plant.png') },
  { id: '8', name: 'Jasmine (Mogra)', price: '₹129', time: '22 min', rating: '4.7', img: require('@/assets/images/fiddle_leaf_fig.png') },
  { id: '9', name: 'Coral Moss (Sea)', price: '₹399', time: '40 min', rating: '4.9', img: require('@/assets/images/succulent_plant.png') },
  { id: '10', name: 'Alpine Edelweiss', price: '₹599', time: '45 min', rating: '5.0', img: require('@/assets/images/office_plant.png') },
  { id: '11', name: 'Snow Orchid (Antarctica)', price: '₹899', time: '60 min', rating: '4.9', img: require('@/assets/images/fiddle_leaf_fig.png') },
  { id: '12', name: 'Wild Lavender (Mountain)', price: '₹249', time: '25 min', rating: '4.6', img: require('@/assets/images/succulent_plant.png') },
];

export default function HomeScreen() {
  const [addedItems, setAddedItems] = React.useState<string[]>([]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0F4EF', '#FFFFFF']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>

          
          {/* Zomato-style Search Header */}
          <View style={styles.searchHeader}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={24} color="#00C881" />
              <View>
                <Text style={styles.locationTitle}>Home</Text>
                <Text style={styles.locationSub}>Your current location...</Text>
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

          {/* Offer Banner */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bannerRow}>
            <TouchableOpacity style={styles.offerBanner}>
              <LinearGradient colors={['#00C881', '#009D65']} style={styles.bannerGradient}>
                <View>
                  <Text style={styles.bannerOffer}>60% OFF</Text>
                  <Text style={styles.bannerText}>On All Indoor Plants</Text>
                  <Text style={styles.bannerCode}>Code: GREEN60</Text>
                </View>
                <Image source={require('@/assets/images/office_plant.png')} style={styles.bannerImg} />
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>

          {/* World Categories Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>World Collections</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {[
              { id: '1', name: 'Outdoor', icon: 'sunny', color: '#FFF9C4' },
              { id: '2', name: 'Sea Plants', icon: 'water', color: '#E1F5FE' },
              { id: '3', name: 'Antarctica', icon: 'snow', color: '#F3E5F5' },
              { id: '4', name: 'Mountain', icon: 'triangle-outline', color: '#E8F5E9' },
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
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>{plant.rating} <Ionicons name="star" size={10} color="#FFF" /></Text>
                  </View>
                </View>
                <View style={styles.pInfo}>
                  <Text style={styles.pName}>{plant.name}</Text>
                  <Text style={styles.pTime}>{plant.time}</Text>
                  <View style={styles.pPriceRow}>
                    <Text style={styles.pPrice}>{plant.price}</Text>
                    <TouchableOpacity 
                      style={[styles.addBtn, addedItems.includes(plant.id) && styles.addedBtn]}
                      onPress={() => setAddedItems(prev => addedItems.includes(plant.id) ? prev.filter(i => i !== plant.id) : [...prev, plant.id])}
                    >
                      <Text style={[styles.addText, addedItems.includes(plant.id) && styles.addedText]}>
                        {addedItems.includes(plant.id) ? 'ADDED' : 'ADD'}
                      </Text>
                      {!addedItems.includes(plant.id) && <Ionicons name="add" size={16} color="#00C881" />}
                    </TouchableOpacity>
                  </View>
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  searchHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
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
