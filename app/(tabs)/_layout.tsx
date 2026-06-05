import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { TabBarProvider, useTabBar } from '@/context/TabBarContext';

const VISIBLE_ROUTES = ['index', 'explore', 'scan_placeholder', 'bag_placeholder', 'profile'];

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();
  const { avatar, isDarkMode } = useUser();
  const { tabBarTranslateY, tabBarOpacity } = useTabBar();

  const renderIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? '#00C881' : (isDarkMode ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.4)');
    switch (routeName) {
      case 'index':
        return <Ionicons name={isFocused ? 'home' : 'home-outline'} size={24} color={color} />;
      case 'explore':
        return <Ionicons name={isFocused ? 'compass' : 'compass-outline'} size={25} color={color} />;
      case 'scan_placeholder':
        return <Ionicons name={isFocused ? 'scan' : 'scan-outline'} size={24} color={color} />;
      case 'bag_placeholder':
        return (
          <View>
            <Ionicons name={isFocused ? 'bag' : 'bag-outline'} size={24} color={color} />
            {itemCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{itemCount}</Text>
              </View>
            )}
          </View>
        );
      case 'profile':
        return (
          <View style={[
            styles.avatarWrap, 
            { borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.15)' },
            isFocused && { borderColor: '#00C881', borderWidth: 2 }
          ]}>
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          </View>
        );
      default:
        return null;
    }
  };

  const visibleRoutes = state.routes.filter(r => VISIBLE_ROUTES.includes(r.name));

  return (
    <Animated.View
      style={[
        styles.tabBarOuter,
        {
          paddingBottom: insets.bottom,
          transform: [{ translateY: tabBarTranslateY }],
          opacity: tabBarOpacity,
          borderTopColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
        },
      ]}
    >
      <BlurView 
        intensity={85} 
        tint={isDarkMode ? 'dark' : 'light'} 
        style={[
          styles.tabBarBlur,
          { backgroundColor: isDarkMode ? 'rgba(18, 18, 18, 0.85)' : 'rgba(255, 255, 255, 0.85)' }
        ]}
      >
        {visibleRoutes.map((route) => {
          const isFocused = state.routes[state.index].name === route.name;

          const onPress = () => {
            if (route.name === 'scan_placeholder') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/scan');
              return;
            }
            if (route.name === 'bag_placeholder') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/checkout');
              return;
            }
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem} activeOpacity={0.7}>
              {isFocused && <View style={[styles.activeIndicator, { backgroundColor: '#00C881' }]} />}
              {renderIcon(route.name, isFocused)}
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </Animated.View>
  );
}

function TabLayoutInner() {
  const { itemCount } = useCart();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="explore" />
        <Tabs.Screen name="scan_placeholder" />
        <Tabs.Screen name="bag_placeholder" />
        <Tabs.Screen name="profile" />
        <Tabs.Screen name="search" options={{ href: null }} />
        <Tabs.Screen name="orders" options={{ href: null }} />
        <Tabs.Screen name="ar_vr" options={{ href: null }} />
      </Tabs>

      {/* Floating Checkout Bar */}
      {itemCount > 0 && (
        <TouchableOpacity
          style={[styles.checkoutBar, { bottom: 72 + insets.bottom }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            router.push('/checkout');
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#00C881', '#00A86B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkoutInner}
          >
            <View style={styles.checkoutLeft}>
              <View style={styles.checkoutBag}>
                <Ionicons name="bag" size={20} color="#FFF" />
                <View style={styles.checkoutCount}>
                  <Text style={styles.checkoutCountText}>{itemCount}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.checkoutTitle}>{itemCount} Item{itemCount > 1 ? 's' : ''}</Text>
                <Text style={styles.checkoutSubtitle}>View Bag & Checkout</Text>
              </View>
            </View>
            <View style={styles.checkoutRight}>
              <Text style={styles.checkoutAction}>Checkout</Text>
              <Ionicons name="chevron-forward" size={18} color="#FFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <TabBarProvider>
      <TabLayoutInner />
    </TabBarProvider>
  );
}

const styles = StyleSheet.create({
  tabBarOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  tabBarBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.75)',
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 48,
    height: 3,
    backgroundColor: '#1877F2',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#E41E3F',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFF',
    zIndex: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  avatarWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#000000',
    overflow: 'hidden',
  },
  avatarActive: {
    borderColor: '#1877F2',
    borderWidth: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  checkoutBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#00C881',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  checkoutInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  checkoutLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkoutBag: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkoutCount: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: '#FFF', width: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  checkoutCountText: { color: '#00C881', fontSize: 9, fontWeight: '900' },
  checkoutTitle: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  checkoutSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '500' },
  checkoutRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  checkoutAction: { color: '#FFF', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
});
