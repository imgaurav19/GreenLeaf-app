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
          title: '',
          tabBarIcon: () => (
            <View style={styles.scanWrap}>
              <LinearGradient colors={['#D8F36C', '#A8E040']} style={styles.scanCircle}>
                <Ionicons name="scan" size={30} color="#1A2A1A" />
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
});
