import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Button } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');

export default function ARVRScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.grantBtn} onPress={requestPermission}>
          <Text style={styles.grantBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Real Camera Background */}
      <CameraView style={StyleSheet.absoluteFill} facing="back" />
      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.roundBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.modePill}>
            <MaterialCommunityIcons name="brain" size={14} color="#D8F36C" />
            <Text style={styles.modeText}>AI Disease Check</Text>
          </View>
          <TouchableOpacity style={styles.roundBtn}>
            <Ionicons name="flash-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerContainer}>
          {/* Floating Plant in AR */}
          <Image 
            source={require('@/assets/images/fiddle_leaf_fig.png')} 
            style={styles.floatingPlant} 
          />
          
          {/* Interaction Visuals */}
          <View style={styles.focusRing}>
            <View style={styles.focusDot} />
          </View>

          <View style={styles.scanPrompt}>
            <Ionicons name="camera" size={24} color="#D8F36C" />
            <Text style={styles.promptText}>Tap to place plant on floor</Text>
          </View>
        </View>

        {/* Bottom Shelf of Plants to Try */}
        <View style={styles.bottomSection}>
          <BlurView intensity={30} tint="dark" style={styles.shelfBlur}>
            <Text style={styles.shelfTitle}>Select Plant for AR View</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelfScroll}>
              {[
                { id: 1, img: require('@/assets/images/succulent_plant.png'), name: 'Aloe' },
                { id: 2, img: require('@/assets/images/office_plant.png'), name: 'Zami' },
                { id: 3, img: require('@/assets/images/fiddle_leaf_fig.png'), name: 'Ficus' },
                { id: 4, img: require('@/assets/images/succulent_plant.png'), name: 'Cactus' },
              ].map(item => (
                <TouchableOpacity key={item.id} style={styles.shelfItem}>
                  <Image source={item.img} style={styles.shelfImg} />
                  <Text style={styles.shelfItemName}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity style={styles.captureBtn}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </BlurView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modePill: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(216, 243, 108, 0.5)',
  },
  modeText: {
    color: '#D8F36C',
    fontWeight: 'bold',
    fontSize: 12,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingPlant: {
    width: 300,
    height: 400,
    zIndex: 10,
  },
  focusRing: {
    position: 'absolute',
    width: 250,
    height: 100,
    borderRadius: 125 / 50, // Squashed circle for floor look
    borderWidth: 2,
    borderColor: 'rgba(216, 243, 108, 0.5)',
    bottom: '25%',
    transform: [{ scaleY: 0.5 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D8F36C',
  },
  scanPrompt: {
    position: 'absolute',
    bottom: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  promptText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  shelfBlur: {
    paddingTop: 20,
    paddingBottom: 110,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  shelfTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 25,
    marginBottom: 15,
  },
  shelfScroll: {
    paddingLeft: 25,
    gap: 15,
    marginBottom: 20,
  },
  shelfItem: {
    width: 80,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  shelfImg: {
    width: 50,
    height: 50,
  },
  shelfItemName: {
    color: '#AAA',
    fontSize: 10,
    marginTop: 5,
  },
  captureBtn: {
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 20,
  },
  message: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  grantBtn: {
    backgroundColor: '#D8F36C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  grantBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
