import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Tabs, router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          height: 70,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => (
          <View style={styles.navBg}>
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient 
              colors={['rgba(20, 35, 20, 0.85)', 'rgba(10, 18, 10, 0.95)']} 
              style={StyleSheet.absoluteFill} 
            />
          </View>
        ),
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={22} 
                color={focused ? "#D8F36C" : "rgba(255,255,255,0.45)"} 
              />
              {focused && <View style={styles.dot} />}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="ar_vr"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Ionicons 
                name={focused ? "cube" : "cube-outline"} 
                size={22} 
                color={focused ? "#D8F36C" : "rgba(255,255,255,0.45)"} 
              />
              {focused && <View style={styles.dot} />}
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: () => (
            <View style={styles.scanWrap}>
              <LinearGradient colors={['#D8F36C', '#A8E040']} style={styles.scanCircle}>
                <Ionicons name="scan" size={26} color="#1A2A1A" />
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
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={22} 
                color={focused ? "#D8F36C" : "rgba(255,255,255,0.45)"} 
              />
              {focused && <View style={styles.dot} />}
            </View>
          ),
        }}
      />

      {/* Hidden tabs */}
      <Tabs.Screen name="search" options={{ href: null }} />
    </Tabs>
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
    marginTop: -25,
  },
  scanCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
});
