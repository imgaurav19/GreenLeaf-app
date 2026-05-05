import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'All', active: true },
  { id: '2', name: 'Indoor' },
  { id: '3', name: 'Outdoor' },
];

export default function StackedScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F7F9F2', '#E8EFE0']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={[styles.catPill, cat.active && styles.catPillActive]}>
              <Text style={[styles.catName, cat.active && styles.catNameActive]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stacked Cards */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stackContainer}>
          
          {/* Card 1 - Zerumbet (Green) */}
          <View style={[styles.stackCard, { backgroundColor: '#75D875', top: 0, zIndex: 1, minHeight: 120 }]}>
            <View style={styles.headerCardContent}>
              <Text style={[styles.headerCardTitle, { color: '#000' }]}>Zerumbet</Text>
              <TouchableOpacity style={styles.stackFav}>
                <Ionicons name="heart-outline" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Card 2 - Monstera (Black) */}
          <View style={[styles.stackCard, { backgroundColor: '#222', top: 60, zIndex: 2, minHeight: 120 }]}>
            <View style={styles.headerCardContent}>
              <Text style={[styles.headerCardTitle, { color: '#FFF' }]}>Monstera</Text>
              <TouchableOpacity style={styles.stackFav}>
                <Ionicons name="heart-outline" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Card 3 - Deliciosa (White) */}
          <View style={[styles.stackCard, { backgroundColor: '#FFF', top: 120, zIndex: 3, height: 420, shadowOpacity: 0.1 }]}>
            <View style={styles.mainCardContent}>
              <View style={styles.mainCardText}>
                <Text style={styles.mType}>Deliciosa</Text>
                <Text style={styles.mTitle}>Dubai, UAE</Text>
                
                <View style={styles.mAuthorRow}>
                  <Text style={styles.mAuthor}>Ciara Ortiz</Text>
                  <Text style={styles.mDate}>Posted 24.04.2024</Text>
                </View>

                <TouchableOpacity style={styles.mPriceBtn}>
                  <Text style={styles.mPriceText}>$99</Text>
                </TouchableOpacity>
              </View>
              
              <Image source={require('@/assets/images/fiddle_leaf_fig.png')} style={styles.mImg} />
              
              <TouchableOpacity style={styles.mFav}>
                <Ionicons name="heart-outline" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 10,
    marginBottom: 20,
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  catScroll: {
    paddingLeft: 25,
    paddingRight: 10,
    marginBottom: 30,
  },
  catPill: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#FFF',
  },
  catPillActive: {
    backgroundColor: '#D8F36C',
  },
  catName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  catNameActive: {
    color: '#000',
  },
  stackContainer: {
    paddingHorizontal: 25,
    paddingBottom: 250,
    position: 'relative',
    height: 700,
  },
  stackCard: {
    position: 'absolute',
    left: 25,
    right: 25,
    borderRadius: 40,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  headerCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerCardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  stackFav: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  mainCardContent: {
    flex: 1,
    position: 'relative',
  },
  mainCardText: {
    flex: 1,
    paddingTop: 10,
  },
  mType: {
    fontSize: 15,
    color: '#666',
    marginBottom: 5,
  },
  mTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#000',
    marginBottom: 100,
    letterSpacing: -1,
  },
  mAuthorRow: {
    marginBottom: 20,
  },
  mAuthor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  mDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  mPriceBtn: {
    height: 60,
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#D8F36C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mPriceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  mImg: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 250,
    height: 350,
    zIndex: -1,
  },
  mFav: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(150, 180, 100, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
});
