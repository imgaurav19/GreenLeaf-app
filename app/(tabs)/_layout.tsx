import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Tabs, router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useCart } from '../context/CartContext';

export default function TabLayout() {
  const { itemCount } = useCart();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#D8F36C',
          tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
          tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 25,
            right: 25,
            height: 75,
            backgroundColor: '#1A2A1A',
            borderTopWidth: 0,
            borderRadius: 35,
            paddingBottom: 12,
            paddingTop: 10,
            elevation: 10,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 15,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '900',
            marginTop: -2,
          }
        }}>
        
        <Tabs.Screen
          name="index"
          options={{
            title: 'HOME',
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={26} 
                color={focused ? "#D8F36C" : "rgba(255,255,255,0.45)"} 
              />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: 'EXPLORE',
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                name={focused ? "search" : "search-outline"} 
                size={26} 
                color={focused ? "#D8F36C" : "rgba(255,255,255,0.45)"} 
              />
            ),
          }}
        />
        
        <Tabs.Screen
          name="scan_placeholder"
          options={{
            title: 'SCAN',
            tabBarIcon: ({ focused }) => (
              <View style={styles.scanWrap}>
                <LinearGradient colors={['#D8F36C', '#A8E040']} style={styles.scanCircle}>
                  <Ionicons name="scan" size={28} color="#1A2A1A" />
                </LinearGradient>
              </View>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity 
                {...props} 
                onPress={() => router.push('/scan')} 
                style={styles.scanTouchable}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'USER',
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={26} 
                color={focused ? "#D8F36C" : "rgba(255,255,255,0.45)"} 
              />
            ),
          }}
        />

        {/* Hidden tabs */}
        <Tabs.Screen name="search" options={{ href: null }} />
        <Tabs.Screen name="orders" options={{ href: null }} />
        <Tabs.Screen name="ar_vr" options={{ href: null }} />
      </Tabs>

      {/* Global Floating Bag */}
      {itemCount > 0 && (
        <TouchableOpacity 
          style={styles.floatingBag} 
          onPress={() => router.push('/tracking')}
          activeOpacity={0.9}
        >
          <LinearGradient colors={['#00C881', '#009D65']} style={styles.bagGradient}>
            <Ionicons name="bag-handle" size={24} color="#FFF" />
            <View style={styles.bagBadge}>
              <Text style={styles.bagBadgeText}>{itemCount}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}
  );
}

const styles = StyleSheet.create({
  navBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 35,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D8F36C',
    marginTop: 5,
  },
  scanWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  scanCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D8F36C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  scanTouchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingBag: {
    position: 'absolute',
    bottom: 110,
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
    zIndex: 1000,
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
