import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing, Image, Dimensions, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [mlStatus, setMlStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isScanning]);

  const handleGalleryPick = () => {
    setIsScanning(true);
    setMlStatus('loading');
    
    // Simulate ML Processing (TensorFlow/PyTorch)
    setTimeout(() => {
      setMlStatus('success');
      setTimeout(() => {
        setIsScanning(false);
        router.push({
          pathname: '/details',
          params: { name: 'Money Plant (Scanned)', disease: 'Healthy' }
        });
      }, 1500);
    }, 3000);
  };

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 320],
  });

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/fiddle_leaf_fig.png')} style={styles.cameraPreview} />
      
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.mlBadge}>
            <MaterialCommunityIcons name="tensorflow" size={16} color="#FF6F00" />
            <Text style={styles.mlText}>TF-Lite Active</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="flash-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.viewfinderContainer}>
          <View style={styles.viewfinder}>
            <View style={[styles.bracket, styles.topLeft]} />
            <View style={[styles.bracket, styles.topRight]} />
            <View style={[styles.bracket, styles.bottomLeft]} />
            <View style={[styles.bracket, styles.bottomRight]} />

            {isScanning && (
              <Animated.View style={[styles.scanLineContainer, { transform: [{ translateY }] }]}>
                <View style={styles.scanLine} />
                <LinearGradient 
                  colors={['rgba(216, 243, 108, 0.4)', 'transparent']} 
                  style={styles.scanGlow} 
                />
              </Animated.View>
            )}
          </View>
          
          {mlStatus === 'loading' && (
            <BlurView intensity={80} tint="dark" style={styles.loadingBox}>
              <Text style={styles.loadingText}>Running PyTorch Inference...</Text>
              <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, { width: '60%' }]} />
              </View>
            </BlurView>
          )}
        </View>

        <View style={styles.bottomBar}>
          <BlurView intensity={80} tint="light" style={styles.controlBlur}>
            <TouchableOpacity style={styles.controlItem} onPress={handleGalleryPick}>
              <Ionicons name="images-outline" size={26} color="#000" />
              <Text style={styles.controlLabel}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.mainScanBtn, isScanning && { backgroundColor: '#FF3B30' }]}
              onPress={() => setIsScanning(!isScanning)}
            >
              <Ionicons name={isScanning ? "stop" : "scan"} size={30} color={isScanning ? "#FFF" : "#000"} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlItem}>
              <MaterialCommunityIcons name="brain" size={26} color="#000" />
              <Text style={styles.controlLabel}>ML Mode</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraPreview: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  overlay: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  mlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  mlText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinder: {
    width: 280,
    height: 350,
    position: 'relative',
  },
  bracket: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#D8F36C',
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 25 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 25 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 25 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 25 },
  scanLineContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    height: 40,
  },
  scanLine: {
    height: 4,
    backgroundColor: '#D8F36C',
    borderRadius: 2,
  },
  scanGlow: {
    height: 30,
    width: '100%',
  },
  loadingBox: {
    position: 'absolute',
    padding: 20,
    borderRadius: 20,
    width: 250,
    alignItems: 'center',
    overflow: 'hidden',
  },
  loadingText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D8F36C',
    borderRadius: 3,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 25,
    right: 25,
    height: 85,
    borderRadius: 45,
    overflow: 'hidden',
  },
  controlBlur: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  controlItem: {
    alignItems: 'center',
    gap: 4,
  },
  controlLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
  },
  mainScanBtn: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#D8F36C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D8F36C',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
});
