import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Dimensions,
  FlatList, Animated, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const ONBOARDING = [
  {
    id: '1',
    title: 'GROW\nBLOOM\nTHRIVE',
    subtitle: 'Step into the world of urban gardening with smart care tips.',
    bg: ['#C5E84D', '#A8D830'] as const,
    img: require('@/assets/images/office_plant.png'),
    textColor: '#1A2A1A',
  },
  {
    id: '2',
    title: 'SCAN\nANY\nPLANT',
    subtitle: 'Use AI to identify diseases and get real-time health metrics.',
    bg: ['#1A2A1A', '#0D140D'] as const,
    img: require('@/assets/images/fiddle_leaf_fig.png'),
    textColor: '#FFF',
  },
  {
    id: '3',
    title: 'LIVING\nWITH\nGREENS',
    subtitle: 'Premium plants curated for your living room, library, and more.',
    bg: ['#E8DCC8', '#D4C4A8'] as const,
    img: require('@/assets/images/succulent_plant.png'),
    textColor: '#333',
  },
  {
    id: '4',
    title: 'PLANT\nTHERAPY\nSESSIONS',
    subtitle: ' certified experts help you heal through botanical interactions.',
    bg: ['#A8E6CF', '#7DD3B0'] as const,
    img: require('@/assets/images/office_plant.png'),
    textColor: '#1A2A1A',
  },
  {
    id: '5',
    title: 'REALTIME\nAR\nINSIGHTS',
    subtitle: 'Check oxygen output, age, and disease in real-time AR mode.',
    bg: ['#2D3436', '#636E72'] as const,
    img: require('@/assets/images/fiddle_leaf_fig.png'),
    textColor: '#D8F36C',
  },
  {
    id: '6',
    title: 'FAST\n15 MINS\nDELIVERY',
    subtitle: 'Fresh greens delivered to your doorstep in minutes.',
    bg: ['#FF9A76', '#FF6F61'] as const,
    img: require('@/assets/images/succulent_plant.png'),
    textColor: '#FFF',
  },
];

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Auto-swipe every 3.5s
  useEffect(() => {
    const timer = setInterval(() => {
      const next = (currentIndex.current + 1) % ONBOARDING.length;
      currentIndex.current = next;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    currentIndex.current = idx;
    setActiveIndex(idx);
  };

  const goNext = () => {
    if (activeIndex < ONBOARDING.length - 1) {
      const next = activeIndex + 1;
      currentIndex.current = next;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    } else {
      router.replace('/login');
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) {
      const prev = activeIndex - 1;
      currentIndex.current = prev;
      flatListRef.current?.scrollToIndex({ index: prev, animated: true });
      setActiveIndex(prev);
    }
  };

  const renderSlide = ({ item }: { item: typeof ONBOARDING[0] }) => (
    <View style={[styles.slide, { width }]}>
      <LinearGradient colors={[...item.bg]} style={StyleSheet.absoluteFill} />
      
      <View style={styles.slideContent}>
        <Text style={[styles.slideTitle, { color: item.textColor }]}>{item.title}</Text>
        
        <Image source={item.img} style={styles.slideImg} resizeMode="contain" />
        
        <Text style={[styles.slideSub, { color: item.textColor, opacity: 0.7 }]}>{item.subtitle}</Text>
      </View>
    </View>
  );

  const currentSlide = ONBOARDING[activeIndex];
  const isDark = currentSlide.bg[0] === '#1A2A1A' || currentSlide.bg[0] === '#2D3436';

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <FlatList
        ref={flatListRef}
        data={ONBOARDING}
        renderItem={renderSlide}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      />

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Dots */}
        <View style={styles.dotsRow}>
          {ONBOARDING.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                activeIndex === i && styles.dotActive,
                { backgroundColor: activeIndex === i ? (isDark ? '#D8F36C' : '#1A2A1A') : (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)') },
              ]}
            />
          ))}
        </View>

        {/* Nav Buttons */}
        <View style={styles.navBtns}>
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }]}
            onPress={goPrev}
          >
            <Ionicons name="arrow-back" size={22} color={isDark ? '#FFF' : '#333'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: isDark ? '#FFF' : '#1A2A1A' }]}
            onPress={goNext}
          >
            <Ionicons name="arrow-forward" size={22} color={isDark ? '#000' : '#FFF'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/login')}>
        <Text style={[styles.skipText, { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)' }]}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { height, justifyContent: 'center' },
  slideContent: { flex: 1, padding: 35, justifyContent: 'center' },
  slideTitle: {
    fontSize: 48, fontWeight: '900', lineHeight: 54, letterSpacing: -2,
    marginBottom: 10,
  },
  slideImg: {
    width: width * 0.75, height: height * 0.38, alignSelf: 'center', marginVertical: 20,
  },
  slideSub: {
    fontSize: 16, lineHeight: 24, fontWeight: '500',
  },
  bottomControls: {
    position: 'absolute', bottom: 50, left: 30, right: 30,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 24, borderRadius: 4 },
  navBtns: { flexDirection: 'row', gap: 10 },
  navBtn: {
    width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
  },
  skipBtn: { position: 'absolute', top: 60, right: 30 },
  skipText: { fontSize: 16, fontWeight: '600' },
});
