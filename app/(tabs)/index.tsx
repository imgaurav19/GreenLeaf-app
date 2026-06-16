import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Image, TouchableOpacity,
  TextInput, Dimensions, FlatList, Animated, ActivityIndicator, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';

import { useCart } from '@/context/CartContext';
import { useTabBar } from '@/context/TabBarContext';
import { useUser } from '@/context/UserContext';
import LocationPickerModal from '@/components/LocationPickerModal';
import { getProductById, PRODUCTS } from '@/constants/products';

const { width } = Dimensions.get('window');
const BANNER_GAP = 12;
const BANNER_WIDTH = width - 60;

// Carousel banners with image overlay text
const PROMO_BANNERS = [
  { id: '1', offer: '60% OFF', text: 'On All Indoor Plants', code: 'GREEN60', bg: require('@/assets/images/office_plant.png') },
  { id: '2', offer: '15% OFF', text: 'New Account Signup Bonus', code: 'NEWLEAF15', bg: require('@/assets/images/fiddle_leaf_fig.png') },
  { id: '3', offer: 'BOGO', text: 'Buy 1 Get 1 on Pots', code: 'POTLOVE', bg: require('@/assets/images/succulent_plant.png') },
  { id: '4', offer: 'FREE', text: 'Plant Therapy Session', code: 'THERAPY1', bg: require('@/assets/images/office_plant.png') },
  { id: '5', offer: '₹499/mo', text: 'Monthly Plant Box Subscribe', code: 'PLANTBOX', bg: require('@/assets/images/fiddle_leaf_fig.png') },
  { id: '6', offer: 'FREEBIE', text: 'Free Seeds over ₹499', code: 'FREESEED', bg: require('@/assets/images/succulent_plant.png') },
];

const FAST_PLANTS = PRODUCTS.filter(p => p.id.startsWith('plant_')).slice(0, 30);
const TOOLS_DATA = PRODUCTS.filter(p => p.id.startsWith('tool_'));
const PESTICIDES_DATA = PRODUCTS.filter(p => p.id.startsWith('care_'));
const FERTILIZERS = PRODUCTS.filter(p => p.id.startsWith('fert_'));

export default function HomeScreen() {
  const { addItem, removeItem, getItemQuantity, itemCount } = useCart();
  const { handleScroll } = useTabBar();
  const { userName, avatar, locationCity, setLocationCity, area, setArea, isDarkMode, ownedPlants, globalFilter, setGlobalFilter } = useUser();
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleVibeSelect = (vibe: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsFiltering(true);
    setTimeout(() => {
      setGlobalFilter(vibe);
      setIsFiltering(false);
    }, 2000);
  };
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(true);

  // Pick a random plant for "Today's Pick" — changes daily
  const todaysPick = useMemo(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % PRODUCTS.filter(p => p.id.startsWith('plant_')).length;
    return PRODUCTS.filter(p => p.id.startsWith('plant_'))[index];
  }, []);

  const pickMessages = useMemo(() => {
    const messages = [
      'Our experts picked this low-maintenance beauty for you today. Perfect for any room!',
      'Handpicked by our plant gurus just for you. Add some green to your day!',
      'Today\'s top recommendation — a crowd favorite that thrives indoors!',
      'This one\'s trending! Grab it before it sells out today.',
      'A perfect plant to brighten up your space. Our daily pick for you!',
      'Freshly curated by our botanists — ideal for your home garden!',
    ];
    const today = new Date();
    const msgIndex = (today.getFullYear() + today.getMonth() + today.getDate()) % messages.length;
    return messages[msgIndex];
  }, []);
  const [showNotifications, setShowNotifications] = useState(false);
  const [eta, setEta] = useState(18);

  useEffect(() => {
    setEta(Math.floor(Math.random() * (22 - 12 + 1)) + 12);
  }, []);

  const insets = useSafeAreaInsets();

  const bgColor = isDarkMode ? '#121212' : '#F5F9F6';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A2A1A';
  const subTextColor = isDarkMode ? '#AAAAAA' : '#556B55';
  const cardBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,200,129,0.1)';

  const handleLocationPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLocationPickerVisible(true);
  };

  // Auto-swipe carousel
  const carouselRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % PROMO_BANNERS.length;
      carouselRef.current?.scrollToIndex({ index: currentIndex.current, animated: true });
      setActiveSlide(currentIndex.current);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (BANNER_WIDTH + BANNER_GAP));
    currentIndex.current = index;
    setActiveSlide(index);
  };

  // Premium carousel banner with image overlay
  const renderBanner = ({ item }: { item: typeof PROMO_BANNERS[0] }) => (
    <TouchableOpacity 
      style={styles.bannerSlide}
      activeOpacity={0.95}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({
          pathname: '/subscription',
          params: { plan: item.code === 'PLANTBOX' ? 'box' : 'pro' }
        });
      }}
    >
      <Image source={item.bg} style={styles.bannerBgImg} resizeMode="cover" />
      <LinearGradient colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.75)']} style={styles.bannerOverlay}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerOffer}>{item.offer}</Text>
          <Text style={styles.bannerText}>{item.text}</Text>
          <View style={styles.bannerCodePill}>
            <Text style={styles.bannerCode}>{item.code}</Text>
          </View>
        </View>
        {/* Dots inside the banner */}
        <View style={styles.dotRowInBanner}>
          {PROMO_BANNERS.map((_, i) => (
            <View key={i} style={[styles.carouselDot, activeSlide === i && styles.carouselDotActive]} />
          ))}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={{ height: insets.top, backgroundColor: isDarkMode ? '#1A1A1A' : '#1A2A1A' }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }} onScroll={handleScroll} scrollEventThrottle={16}>

        {/* Blinkit-style Top Section */}
        <View style={styles.blinkitHeader}>
          <View style={styles.blinkitTopRow}>
            <View>
              <Text style={[styles.blinkitSubTitle, { color: textColor }]}>GreenLeaf in</Text>
              <Text style={[styles.blinkitMainTime, { color: textColor }]}>{eta} minutes</Text>
            </View>
            <View style={styles.blinkitRight}>
              <TouchableOpacity 
                style={[styles.blinkitWallet, { backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF' }]}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                activeOpacity={0.8}
              >
                <View style={styles.blinkitWalletIconBg}>
                  <Ionicons name="wallet" size={14} color="#FFF" />
                </View>
                <Text style={[styles.blinkitWalletText, { color: textColor }]}>₹0</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.blinkitProfile, { backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF' }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push('/profile');
                }}
                activeOpacity={0.8}
              >
                <Image source={{ uri: avatar }} style={{ width: '100%', height: '100%', borderRadius: 24 }} />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity style={styles.blinkitAddressRow} onPress={handleLocationPress} activeOpacity={0.7}>
            <Text style={[styles.blinkitAddressText, { color: textColor }]} numberOfLines={1}>
              <Text style={{ fontWeight: '900' }}>HOME</Text> - {userName}, {area}
            </Text>
            <Ionicons name="caret-down" size={12} color={textColor} style={{ marginTop: 2 }} />
          </TouchableOpacity>
        </View>


        <View style={styles.searchContainer}>
          <View style={[styles.searchBox, { backgroundColor: cardBg, borderColor }]}>
            <Ionicons name="search-outline" size={20} color={isDarkMode ? '#999' : '#666'} />
            <TextInput 
              style={[styles.searchInputNew, { color: textColor }]} 
              placeholder="Search Plants" 
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Shop by Vibe Moved Here */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.vibeRow, { marginTop: 10, marginBottom: 5 }]}>
          {[
            { id: '1', name: 'Outdoor', icon: '☀️', color: isDarkMode ? 'rgba(255,249,196,0.15)' : 'rgba(255,249,196,0.7)' },
            { id: '2', name: 'Aquatic', icon: '💧', color: isDarkMode ? 'rgba(225,245,254,0.15)' : 'rgba(225,245,254,0.7)' },
            { id: '3', name: 'Air Pure', icon: '🌿', color: isDarkMode ? 'rgba(232,245,233,0.15)' : 'rgba(232,245,233,0.7)' },
            { id: '4', name: 'Rare', icon: '💎', color: isDarkMode ? 'rgba(243,229,245,0.15)' : 'rgba(243,229,245,0.7)' },
            { id: '5', name: 'Seasonal', icon: '🍂', color: isDarkMode ? 'rgba(255,224,178,0.15)' : 'rgba(255,224,178,0.7)' },
            { id: '6', name: 'Flowering', icon: '🌺', color: isDarkMode ? 'rgba(252,228,236,0.15)' : 'rgba(252,228,236,0.7)' },
          ].map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.vibeCard, { backgroundColor: cat.color, borderColor }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push({ pathname: '/room', params: { room: cat.name } });
              }}
            >
              <Text style={styles.vibeEmoji}>{cat.icon}</Text>
              <Text style={[styles.vibeName, { color: textColor }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Room Selectors */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomScroll}>
          {[
            { name: 'All', icon: 'grid' },
            { name: 'Living Room', icon: 'leaf' },
            { name: 'Bedroom', icon: 'bed' },
            { name: 'Library', icon: 'book' },
            { name: 'Kitchen', icon: 'restaurant' },
          ].map((room) => (
            <TouchableOpacity 
              key={room.name}
              style={[
                styles.roomPill, 
                { backgroundColor: cardBg },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push({ pathname: '/room', params: { room: room.name } });
              }}
            >
              <View style={[
                styles.roomIconWrap, 
                { backgroundColor: isDarkMode ? '#FFF' : '#C8E6C9' },
              ]}>
                <Ionicons 
                  name={room.icon as any} 
                  size={18} 
                  color={'#1A2A1A'} 
                />
              </View>
              <Text style={[
                styles.roomText, 
                { color: isDarkMode ? '#AAAAAA' : '#556B55' },
              ]}>
                {room.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Auto-Swipe Carousel with image overlays */}
        <View style={styles.carouselWrap}>
          <FlatList
            ref={carouselRef}
            data={PROMO_BANNERS}
            renderItem={renderBanner}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={BANNER_WIDTH + BANNER_GAP}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 30 }}
            onMomentumScrollEnd={handleScrollEnd}
            getItemLayout={(_, index) => ({ 
              length: BANNER_WIDTH + BANNER_GAP, 
              offset: (BANNER_WIDTH + BANNER_GAP) * index, 
              index 
            })}
          />
        </View>

        {/* My Home Garden / Owned Plants */}
        {ownedPlants && ownedPlants.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>My Home Garden</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
              {ownedPlants.map((plant, index) => (
                <View key={`owned-${index}`} style={[styles.toolCard, { backgroundColor: cardBg, borderColor }]}>
                  <View style={[styles.toolImgWrap, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#F8F9FA' }]}>
                    <MaterialCommunityIcons name="leaf-circle-outline" size={40} color="#00C881" />
                  </View>
                  <Text style={[styles.toolName, { color: textColor }]} numberOfLines={1}>{plant.name}</Text>
                  <Text style={styles.toolPrice}>Purchased: {plant.quantity}</Text>
                  <View style={[styles.toolAddPill, { backgroundColor: '#00C881' }]}>
                    <Ionicons name="checkmark" size={14} color="#FFF" />
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}


        {/* Plant Therapy Banner */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Plant Therapy</Text>
          <TouchableOpacity onPress={() => router.push('/subscription')}>
            <Text style={styles.seeAll}>Subscribe</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.therapyCard} onPress={() => router.push('/therapy')} activeOpacity={0.9}>
          <Image source={require('@/assets/images/office_plant.png')} style={styles.therapyImg} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.therapyOverlay}>
            <View style={{ flex: 1 }}>
              <Text style={styles.therapyTitle}>Stress Relief Session</Text>
              <Text style={styles.therapySub}>Botanical healing for mental health</Text>
            </View>
            <View style={styles.bookBtn}>
              <Text style={styles.bookText}>Book</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Room Specific Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Featured Plants</Text>
          <TouchableOpacity onPress={() => router.push('/store')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {FAST_PLANTS.filter(plant => {
            if (searchQuery && !plant.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (globalFilter === 'All') return true;
            
            const pData = getProductById(plant.id);
            if (!pData) return false;
            
            // Check if filter matches room, tag, or season
            const inRoom = pData.rooms?.includes(globalFilter);
            const isTag = pData.tag?.toLowerCase().includes(globalFilter.toLowerCase());
            const isSeason = pData.season?.toLowerCase().includes(globalFilter.toLowerCase());
            // Hardcode some vibe mappings
            const isAirPure = globalFilter === 'Air Pure' && pData.tag?.includes('Air');
            const isFlowering = globalFilter === 'Flowering' && pData.season;
            const isAquatic = globalFilter === 'Aquatic' && pData.rooms?.includes('Bathroom');
            
            return inRoom || isTag || isSeason || isAirPure || isFlowering || isAquatic;
          }).map(plant => {
            const qty = getItemQuantity(plant.id);
            return (
              <TouchableOpacity 
                key={plant.id} 
                style={styles.roomPlantCard} 
                onPress={() => router.push({ pathname: '/details', params: { id: plant.id } })}
              >
                <Image source={plant.img} style={styles.roomPlantImg} resizeMode="cover" />
                <LinearGradient 
                  colors={['transparent', 'rgba(0,0,0,0.8)']} 
                  style={styles.plantOverlay}
                >
                  <View style={styles.plantMainInfo}>
                    <Text style={styles.plantNameOverlay} numberOfLines={2}>{plant.name}</Text>
                    <View style={styles.plantPriceRow}>
                      <Text style={styles.plantPriceOverlay}>₹{plant.price}</Text>
                      <View style={styles.etaRow}>
                        <Ionicons name="time-outline" size={12} color="#FFF" />
                        <Text style={styles.etaTextOverlay}>{plant.time || '15 MINS'}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.ratingBadgeTop}>
                    <Text style={styles.ratingTextTop}>{plant.rating || '4.8'} ★</Text>
                  </View>

                  {qty === 0 ? (
                    <TouchableOpacity 
                      style={styles.overlayAddBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        addItem(plant.id);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <Text style={styles.overlayAddText}>ADD</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.overlayQtySelector}>
                      <TouchableOpacity onPress={(e) => { e.stopPropagation(); removeItem(plant.id); }}>
                        <Ionicons name="remove" size={14} color="#000" />
                      </TouchableOpacity>
                      <Text style={styles.overlayQtyText}>{qty}</Text>
                      <TouchableOpacity onPress={(e) => { e.stopPropagation(); addItem(plant.id); }}>
                        <Ionicons name="add" size={14} color="#000" />
                      </TouchableOpacity>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Tools & Accessories */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Tools & Accessories</Text>
          <TouchableOpacity onPress={() => router.push('/store')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {TOOLS_DATA.map(tool => (
            <TouchableOpacity key={tool.id} style={[styles.toolCard, { backgroundColor: cardBg, borderColor }]} onPress={() => { addItem(tool.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
              <View style={[styles.toolImgWrap, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#F8F9FA' }]}>
                <Image source={tool.img} style={styles.toolImg} resizeMode="contain" />
              </View>
              <Text style={[styles.toolName, { color: textColor }]}>{tool.name}</Text>
              <Text style={styles.toolPrice}>₹{tool.price}</Text>
              <View style={styles.toolAddPill}>
                <Ionicons name="add" size={14} color="#FFF" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Safe Pesticides Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Safe Pesticides</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {PESTICIDES_DATA.map(item => (
            <TouchableOpacity key={item.id} style={[styles.pesticideCard, { backgroundColor: cardBg, borderColor }]} onPress={() => { addItem(item.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
              <View style={[styles.pestTag, { backgroundColor: isDarkMode ? 'rgba(0,200,129,0.15)' : '#E8F5E9' }]}>
                <Text style={[styles.pestTagText, { color: isDarkMode ? '#00C881' : '#2E7D32' }]}>{item.tag}</Text>
              </View>
              <MaterialCommunityIcons name="spray-bottle" size={32} color="#00C881" />
              <Text style={[styles.pestName, { color: textColor }]}>{item.name}</Text>
              <Text style={styles.pestPrice}>₹{item.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Organic Fertilizers */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Organic Fertilizers</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {FERTILIZERS.map(item => (
            <TouchableOpacity key={item.id} style={[styles.fertCard, { backgroundColor: cardBg, borderColor }]} onPress={() => { addItem(item.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
              <MaterialCommunityIcons name="leaf-circle" size={32} color="#4CAF50" />
              <View style={styles.fertInfo}>
                <Text style={[styles.fertName, { color: textColor }]}>{item.name}</Text>
                <Text style={[styles.fertDesc, { color: subTextColor }]}>{item.desc}</Text>
                <Text style={[styles.fertPrice, { color: isDarkMode ? '#D8F36C' : '#2E7D32' }]}>₹{item.price}</Text>
              </View>
              <View style={[styles.fertAdd, { backgroundColor: isDarkMode ? '#00C881' : '#2E7D32' }]}>
                <Ionicons name="add" size={18} color="#FFF" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Hero Plants — Swipeable */}
        <View style={[styles.sectionHeader, { marginTop: 5 }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Featured Plants</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, gap: 14, paddingRight: 20, marginBottom: 24 }}>
          {FAST_PLANTS.filter(plant => {
            if (searchQuery && !plant.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (globalFilter === 'All') return true;
            
            const pData = getProductById(plant.id);
            if (!pData) return false;
            
            const inRoom = pData.rooms?.includes(globalFilter);
            const isTag = pData.tag?.toLowerCase().includes(globalFilter.toLowerCase());
            const isSeason = pData.season?.toLowerCase().includes(globalFilter.toLowerCase());
            const isAirPure = globalFilter === 'Air Pure' && pData.tag?.includes('Air');
            const isFlowering = globalFilter === 'Flowering' && pData.season;
            const isAquatic = globalFilter === 'Aquatic' && pData.rooms?.includes('Bathroom');
            
            return inRoom || isTag || isSeason || isAirPure || isFlowering || isAquatic;
          }).slice(0, 4).map(plant => (
            <TouchableOpacity
              key={plant.id}
              onPress={() => router.push({ pathname: '/details', params: { id: plant.id } })}
              style={[styles.heroCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#E8F5E9' }]}
              activeOpacity={0.9}
            >
              <Image source={plant.img} style={styles.heroImg} resizeMode="contain" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.heroOverlay}>
                <View style={styles.heroRatingPill}>
                  <Text style={styles.heroRating}>{plant.rating} ★</Text>
                </View>
                <View style={styles.heroBottom}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.heroName}>{plant.name}</Text>
                    <View style={styles.heroMeta}>
                      <Text style={styles.heroPrice}>₹{plant.price}</Text>
                      <View style={styles.heroEta}>
                        <Ionicons name="timer-outline" size={10} color="#D8F36C" />
                        <Text style={styles.heroEtaText}>{plant.time || '15 MINS'}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.heroAddBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      addItem(plant.id);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                  >
                    <Text style={styles.heroAddText}>ADD</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* All Listed Plants — Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>All Plants</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Sort By</Text></TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {FAST_PLANTS.filter(plant => {
            if (searchQuery && !plant.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (globalFilter === 'All') return true;
            
            const pData = getProductById(plant.id);
            if (!pData) return false;
            
            const inRoom = pData.rooms?.includes(globalFilter);
            const isTag = pData.tag?.toLowerCase().includes(globalFilter.toLowerCase());
            const isSeason = pData.season?.toLowerCase().includes(globalFilter.toLowerCase());
            const isAirPure = globalFilter === 'Air Pure' && pData.tag?.includes('Air');
            const isFlowering = globalFilter === 'Flowering' && pData.season;
            const isAquatic = globalFilter === 'Aquatic' && pData.rooms?.includes('Bathroom');
            
            return inRoom || isTag || isSeason || isAirPure || isFlowering || isAquatic;
          }).map(plant => (
            <TouchableOpacity
              key={plant.id}
              onPress={() => router.push({ pathname: '/details', params: { id: plant.id } })}
              style={[styles.plantCard, { backgroundColor: cardBg, borderColor }]}
              activeOpacity={0.9}
            >
              <View style={[styles.imgBox, { backgroundColor: isDarkMode ? '#222' : 'rgba(0,200,129,0.04)' }]}>
                <Image source={plant.img} style={styles.pImg} resizeMode="contain" />
                <View style={styles.etaBadge}>
                  <Ionicons name="timer-outline" size={10} color="#1A2A1A" />
                  <Text style={styles.etaText}>{plant.time || '15 MINS'}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>{plant.rating || '4.8'} ★</Text>
                </View>
              </View>
              <View style={styles.pInfo}>
                <Text style={[styles.pName, { color: textColor }]} numberOfLines={1}>{plant.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.pPrice, { color: textColor }]}>₹{plant.price}</Text>
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

        {/* Last Seen */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Last Seen 👀</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {PRODUCTS.slice(3, 8).map(plant => (
            <View key={'last_seen_'+plant.id} style={[styles.toolCard, { backgroundColor: cardBg, borderColor }]}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/details', params: { id: plant.id } })} activeOpacity={0.8}>
                <View style={[styles.toolImgWrap, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#F5F5F5' }]}>
                  <Image source={plant.img} style={styles.toolImg} resizeMode="contain" />
                </View>
                <Text style={[styles.toolName, { color: textColor }]} numberOfLines={1}>{plant.name}</Text>
                <Text style={styles.toolPrice}>₹{plant.price}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.toolAddPill}
                onPress={() => {
                  addItem(plant.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons name="add" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Your Previous Orders */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Your Previous Orders 📦</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {PRODUCTS.slice(8, 12).map(plant => (
            <View key={'prev_order_'+plant.id} style={[styles.toolCard, { backgroundColor: cardBg, borderColor }]}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/details', params: { id: plant.id } })} activeOpacity={0.8}>
                <View style={[styles.toolImgWrap, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#E8F5E9' }]}>
                  <Image source={plant.img} style={styles.toolImg} resizeMode="contain" />
                </View>
                <Text style={[styles.toolName, { color: textColor }]} numberOfLines={1}>{plant.name}</Text>
                <Text style={styles.toolPrice}>₹{plant.price}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.toolAddPill}
                onPress={() => {
                  addItem(plant.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons name="refresh" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>


        {/* Summer Collection */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Summer Collection ☀️</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {PRODUCTS.filter(p => p.season === 'Summer' || p.rooms?.includes('Outdoor')).slice(0, 10).map(plant => (
            <View key={plant.id} style={[styles.toolCard, { backgroundColor: cardBg, borderColor }]}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/details', params: { id: plant.id } })} activeOpacity={0.8}>
                <View style={[styles.toolImgWrap, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#FFF9C4' }]}>
                  <Image source={plant.img} style={styles.toolImg} resizeMode="contain" />
                </View>
                <Text style={[styles.toolName, { color: textColor }]} numberOfLines={1}>{plant.name}</Text>
                <Text style={styles.toolPrice}>₹{plant.price}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.toolAddPill}
                onPress={() => {
                  addItem(plant.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons name="add" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Winter Collection */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Winter Collection ❄️</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {PRODUCTS.filter(p => p.season === 'Winter' || p.rooms?.includes('Outdoor')).slice(0, 10).map(plant => (
            <View key={plant.id} style={[styles.toolCard, { backgroundColor: cardBg, borderColor }]}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/details', params: { id: plant.id } })} activeOpacity={0.8}>
                <View style={[styles.toolImgWrap, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#E3F2FD' }]}>
                  <Image source={plant.img} style={styles.toolImg} resizeMode="contain" />
                </View>
                <Text style={[styles.toolName, { color: textColor }]} numberOfLines={1}>{plant.name}</Text>
                <Text style={styles.toolPrice}>₹{plant.price}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.toolAddPill}
                onPress={() => {
                  addItem(plant.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons name="add" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Aquatic Collection */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Aquatic Collection 💧</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {PRODUCTS.filter(p => p.rooms?.includes('Bathroom')).slice(0, 10).map(plant => (
            <View key={plant.id} style={[styles.toolCard, { backgroundColor: cardBg, borderColor }]}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/details', params: { id: plant.id } })} activeOpacity={0.8}>
                <View style={[styles.toolImgWrap, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#E1F5FE' }]}>
                  <Image source={plant.img} style={styles.toolImg} resizeMode="contain" />
                </View>
                <Text style={[styles.toolName, { color: textColor }]} numberOfLines={1}>{plant.name}</Text>
                <Text style={styles.toolPrice}>₹{plant.price}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.toolAddPill}
                onPress={() => {
                  addItem(plant.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons name="add" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

      </ScrollView>

      {/* Global Filtering Loading Overlay */}
      {isFiltering && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)', zIndex: 1000, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#00C881" />
          <Text style={{ marginTop: 15, color: textColor, fontSize: 18, fontWeight: '600' }}>Applying {globalFilter} Vibe...</Text>
        </View>
      )}

      {/* Location Picker */}
      <LocationPickerModal visible={locationPickerVisible} onClose={() => setLocationPickerVisible(false)} />

      {/* Today's Recommendation Modal */}
      <Modal
        visible={showRecommendation}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.recommendationOverlay}>
          <View style={[styles.recommendationCard, { backgroundColor: cardBg }]}>
            <TouchableOpacity 
              style={styles.closeRecBtn} 
              onPress={() => setShowRecommendation(false)}
            >
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableOpacity>
            
            <View style={styles.recBadge}>
              <Text style={styles.recBadgeText}>TODAY'S PICK</Text>
            </View>
            
            <Image 
              source={todaysPick.img} 
              style={styles.recImage} 
              resizeMode="contain" 
            />
            
            <Text style={[styles.recTitle, { color: textColor }]}>
              {todaysPick.name}
            </Text>
            <Text style={styles.recDesc}>
              {pickMessages}
            </Text>
            
            <View style={styles.recPriceRow}>
              <Text style={[styles.recPrice, { color: textColor }]}>₹{todaysPick.price}</Text>
              {todaysPick.oldPrice && (
                <Text style={styles.recOldPrice}>₹{todaysPick.oldPrice}</Text>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.recAddBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                addItem(todaysPick.id);
                setShowRecommendation(false);
              }}
            >
              <Text style={styles.recAddText}>Add to Bag</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: cardBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: textColor }}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Ionicons name="close-circle-outline" size={28} color={subTextColor} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', marginBottom: 16, backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5', padding: 12, borderRadius: 12 }}>
                <Ionicons name="water-outline" size={24} color="#00C881" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', color: textColor, marginBottom: 4 }}>Time to water your Fiddle Leaf!</Text>
                  <Text style={{ color: subTextColor, fontSize: 12 }}>It has been 7 days since you last watered it.</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 16, backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5', padding: 12, borderRadius: 12 }}>
                <Ionicons name="pricetag-outline" size={24} color="#FFA500" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', color: textColor, marginBottom: 4 }}>Flash Sale: 60% OFF 🪴</Text>
                  <Text style={{ color: subTextColor, fontSize: 12 }}>Use code GREEN60 at checkout today.</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 16, backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5', padding: 12, borderRadius: 12 }}>
                <Ionicons name="leaf-outline" size={24} color="#1877F2" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', color: textColor, marginBottom: 4 }}>New Rare Plants Arrived!</Text>
                  <Text style={{ color: subTextColor, fontSize: 12 }}>Check out the new variegated Monstera.</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },

  // New Personalized Header
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerUserBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#00C881',
  },
  headerGreeting: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 13,
    color: '#AAAAAA',
    fontWeight: '600',
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4B2B',
    borderWidth: 1.5,
    borderColor: '#121212',
  },
  qtySelector: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 4,
    height: 36,
    gap: 10,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000',
    minWidth: 12,
    textAlign: 'center',
  },

  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 6,
    marginBottom: 10,
  },
  addressText: {
    fontSize: 13,
    color: '#AAAAAA',
    fontWeight: '600',
    flex: 1,
  },

  mainHeadline: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  searchBox: {
    flex: 1,
    height: 52,
    backgroundColor: '#1E1E1E',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInputNew: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // Room Selectors
  roomScroll: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 10,
    marginBottom: 25,
  },
  roomPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#1E1E1E',
    gap: 8,
  },
  roomPillActive: {
    backgroundColor: '#00C881', 
  },
  roomIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomIconWrapActive: {
    backgroundColor: '#1A2A1A',
  },
  roomText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
  roomTextActive: {
    color: '#1A2A1A',
  },

  // Carousel
  carouselWrap: { marginBottom: 22 },
  bannerSlide: {
    width: BANNER_WIDTH,
    height: 180,
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: BANNER_GAP,
  },
  bannerBgImg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: 'flex-end',
  },
  bannerContent: {},
  bannerOffer: { fontSize: 32, fontWeight: '900', color: '#FFF' },
  bannerText: { fontSize: 14, color: '#FFF', fontWeight: '600', marginTop: 2 },
  bannerCodePill: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bannerCode: { fontSize: 11, color: '#FFF', fontWeight: '800' },
  dotRowInBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 5,
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  carouselDotActive: {
    width: 20,
    backgroundColor: '#FFF',
    borderRadius: 3,
  },

  // Shop by Vibe
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1A2A1A' },
  seeAll: { color: '#00C881', fontWeight: '700', fontSize: 13 },
  vibeRow: { paddingLeft: 20, gap: 12, paddingRight: 20, marginBottom: 24 },
  vibeCard: {
    width: 80,
    height: 90,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
  },
  vibeEmoji: { fontSize: 26 },
  vibeName: { fontSize: 11, fontWeight: '700', color: '#333' },

  // Therapy
  therapyCard: {
    marginHorizontal: 20,
    height: 160,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
  },
  therapyImg: { width: '100%', height: '100%' },
  therapyOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  therapyTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  therapySub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 },
  bookBtn: {
    backgroundColor: '#00C881',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  bookText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },

  // Horizontal scroll sections
  hScroll: { paddingLeft: 20, gap: 12, paddingRight: 20, marginBottom: 24 },

  // Tools
  toolCard: {
    width: 130,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  toolImgWrap: {
    width: '100%',
    height: 90,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  toolImg: { width: 70, height: 70 },
  toolName: { fontSize: 13, fontWeight: '700', color: '#1A2A1A' },
  toolPrice: { fontSize: 15, fontWeight: '900', color: '#00C881' },
  toolAddPill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00C881',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Pesticides
  pesticideCard: {
    width: 140,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    gap: 6,
  },
  pestTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  pestTagText: { fontSize: 9, fontWeight: '800', color: '#2E7D32', textTransform: 'uppercase' },
  pestName: { fontSize: 13, fontWeight: '700', color: '#1A2A1A' },
  pestPrice: { fontSize: 15, fontWeight: '900', color: '#00C881' },

  // Fertilizers
  fertCard: {
    width: 180,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fertInfo: {
    flex: 1,
    gap: 2,
  },
  fertName: { fontSize: 13, fontWeight: '700', color: '#1A2A1A' },
  fertDesc: { fontSize: 10, color: '#666' },
  fertPrice: { fontSize: 15, fontWeight: '900', color: '#2E7D32' },
  fertAdd: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Room Specific Cards (Featured)
  roomPlantCard: {
    width: 200,
    height: 240,
    borderRadius: 24,
    marginRight: 15,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  roomPlantImg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  plantOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 12,
  },
  plantMainInfo: {
    marginBottom: 4,
  },
  plantNameOverlay: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  plantPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plantPriceOverlay: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    opacity: 0.8,
  },
  etaTextOverlay: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  ratingBadgeTop: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#00C881',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingTextTop: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
  },
  overlayAddBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#D4EF70',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
  },
  overlayAddText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1A2A1A',
  },
  overlayQtySelector: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4EF70',
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 32,
    gap: 8,
  },
  overlayQtyText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1A2A1A',
  },

  // Plant Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  plantCard: {
    width: (width - 52) / 2,
    marginBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,200,129,0.1)',
  },
  imgBox: {
    height: 140,
    backgroundColor: 'rgba(0,200,129,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pImg: { width: '75%', height: '75%' },
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
  etaText: { fontSize: 9, fontWeight: '900', color: '#1A2A1A' },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#267E3E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  pInfo: { padding: 12 },
  pName: { fontSize: 14, fontWeight: '700', color: '#1A2A1A' },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  pPrice: { fontSize: 16, fontWeight: '900', color: '#1A2A1A' },
  addBtn: {
    borderWidth: 1.5,
    borderColor: '#00C881',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  addText: { color: '#00C881', fontWeight: '900', fontSize: 11 },

  // Hero Featured Cards
  heroCard: {
    width: width * 0.6,
    height: 260,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#E8F5E9',
    shadowColor: '#00C881',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  heroImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 16,
  },
  heroRatingPill: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,200,129,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  heroRating: { color: '#FFF', fontSize: 11, fontWeight: '900' },
  heroBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  heroName: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  heroPrice: { color: '#D8F36C', fontSize: 20, fontWeight: '900' },
  heroEta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  heroEtaText: { color: '#D8F36C', fontSize: 10, fontWeight: '800' },
  heroAddBtn: {
    backgroundColor: '#D8F36C',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#D8F36C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Recommendation Modal
  recommendationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  recommendationCard: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  closeRecBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recBadge: {
    backgroundColor: '#00C881',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  recBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  recImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  recTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center',
  },
  recDesc: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  recPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  recPrice: {
    fontSize: 24,
    fontWeight: '900',
  },
  recOldPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  recAddBtn: {
    backgroundColor: '#D8F36C',
    width: '100%',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D8F36C',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  recAddText: {
    color: '#1A2A1A',
    fontSize: 16,
    fontWeight: '900',
  },
  
  // Header Badge
  bagBadgeHeader: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#00C881',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  bagBadgeTextHeader: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },

  // Blinkit Header Styles
  blinkitHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  blinkitTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  blinkitSubTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  blinkitMainTime: {
    fontSize: 34,
    fontWeight: '900',
    marginTop: -4,
    letterSpacing: -1.5,
  },
  blinkitRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  blinkitWallet: {
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  blinkitWalletIconBg: {
    backgroundColor: '#CCA700', // Gold color
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  blinkitWalletText: {
    fontSize: 13,
    fontWeight: '900',
  },
  blinkitProfile: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  blinkitAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  blinkitAddressText: {
    fontSize: 16,
  },
});
