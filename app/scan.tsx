import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Animated,
  Dimensions, ScrollView, Image,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const SCAN_RESULT = {
  name: 'Money Plant',
  scientific: 'Epipremnum aureum',
  overallHealth: 92,
  healthGrade: 'A',
  age: '~3 Years',
  lifeSpan: '15–20 Years',
  oxygenOutput: '2.4 L/day',
  co2Absorbed: '1.8 L/day',
  humidity: '68%',
  diseaseStatus: 'Mild Leaf Spot',
  diseaseSeverity: 'Low',
  diseaseAdvice: 'Prune affected leaves & reduce watering frequency. Apply neem oil spray weekly.',
  waterNeeds: 'Moderate',
  sunlight: 'Indirect Bright',
  soilPH: '6.0 – 7.5',
  fertilizer: 'NPK 10-10-10',
};

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [showIntro, setShowIntro] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [isARMode, setIsARMode] = useState(true);
  const [scanPhase, setScanPhase] = useState<'idle' | 'scanning' | 'analyzing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(scanLineAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isScanning]);

  const handleScan = () => {
    if (scanPhase !== 'idle') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsScanning(true);
    setScanPhase('scanning');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 60);

    setTimeout(() => {
      setScanPhase('analyzing');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 1500);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setScanPhase('done');
      setIsScanning(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.timing(fadeIn, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, 3200);
  };

  const resetScan = () => {
    setScanPhase('idle');
    setProgress(0);
    fadeIn.setValue(0);
  };

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 320],
  });

  const healthColor = SCAN_RESULT.overallHealth >= 80 ? '#00C881' : SCAN_RESULT.overallHealth >= 50 ? '#FF9500' : '#FF3B30';

  const handleGetStarted = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    setShowIntro(false);
  };

  // Intro screen — shown first
  if (showIntro) {
    return (
      <View style={styles.introScreen}>
        <LinearGradient colors={['#E8DCC8', '#D4C4A8']} style={StyleSheet.absoluteFill} />
        <TouchableOpacity onPress={() => router.back()} style={styles.introBack}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Image source={require('@/assets/images/fiddle_leaf_fig.png')} style={styles.introImg} resizeMode="contain" />
        <View style={styles.introContent}>
          <Text style={styles.introTitle}>Living with Greens</Text>
          <Text style={styles.introSub}>Scan any plant with AI to check health, age, oxygen output & detect diseases in real-time.</Text>
          <TouchableOpacity style={styles.introBtn} onPress={handleGetStarted}>
            <LinearGradient colors={['#00C881', '#009D65']} style={styles.introBtnGrad}>
              <Text style={styles.introBtnText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Permission handling
  if (!permission) {
    return <View style={styles.container}><Text style={{ color: '#FFF', textAlign: 'center', marginTop: 100 }}>Loading camera...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionScreen}>
        <LinearGradient colors={['#1A2A1A', '#0D140D']} style={StyleSheet.absoluteFill} />
        <Ionicons name="camera" size={60} color="#D8F36C" />
        <Text style={styles.permTitle}>Camera Access Needed</Text>
        <Text style={styles.permSub}>We need camera access to scan and analyze your plants in real-time using AR.</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <LinearGradient colors={['#D8F36C', '#B2F44C']} style={styles.permBtnGrad}>
            <Text style={styles.permBtnText}>Enable Camera</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#888', fontSize: 14 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* REAL CAMERA FEED */}
      <CameraView style={StyleSheet.absoluteFill} facing="back" />

      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.headerDark}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtnWhite}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.arToggle, isARMode && styles.arActive]}
            onPress={() => setIsARMode(!isARMode)}
          >
            <MaterialCommunityIcons name={isARMode ? "cube-scan" : "cube-outline"} size={20} color={isARMode ? "#FFF" : "#FF6F00"} />
            <Text style={[styles.arText, isARMode && { color: '#FFF' }]}>{isARMode ? 'AR ON' : 'AR OFF'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtnWhite}>
            <Ionicons name="flash-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Viewfinder Area */}
        <View style={styles.viewfinderContainer}>
          {/* AR floating data pills */}
          {isARMode && (
            <View style={styles.arOverlay}>
              <Animated.View style={[styles.arMarker, { top: '15%', left: '5%', transform: [{ scale: pulseAnim }] }]}>
                <BlurView intensity={90} tint="dark" style={styles.arPill}>
                  <Text style={styles.arLabel}>🏥 Health</Text>
                  <Text style={[styles.arValue, { color: healthColor }]}>{SCAN_RESULT.overallHealth}%</Text>
                </BlurView>
              </Animated.View>
              <Animated.View style={[styles.arMarker, { top: '28%', right: '5%', transform: [{ scale: pulseAnim }] }]}>
                <BlurView intensity={90} tint="dark" style={styles.arPill}>
                  <Text style={styles.arLabel}>🌬 O₂ Output</Text>
                  <Text style={styles.arValue}>{SCAN_RESULT.oxygenOutput}</Text>
                </BlurView>
              </Animated.View>
              <Animated.View style={[styles.arMarker, { top: '42%', left: '3%', transform: [{ scale: pulseAnim }] }]}>
                <BlurView intensity={90} tint="dark" style={styles.arPill}>
                  <Text style={styles.arLabel}>🧬 Age</Text>
                  <Text style={styles.arValue}>{SCAN_RESULT.age}</Text>
                </BlurView>
              </Animated.View>
              <Animated.View style={[styles.arMarker, { top: '55%', right: '8%', transform: [{ scale: pulseAnim }] }]}>
                <BlurView intensity={90} tint="dark" style={styles.arPill}>
                  <Text style={styles.arLabel}>🦠 Disease</Text>
                  <Text style={[styles.arValue, { color: '#FF9500' }]}>{SCAN_RESULT.diseaseStatus}</Text>
                </BlurView>
              </Animated.View>
              <Animated.View style={[styles.arMarker, { top: '68%', left: '10%', transform: [{ scale: pulseAnim }] }]}>
                <BlurView intensity={90} tint="dark" style={styles.arPill}>
                  <Text style={styles.arLabel}>⏳ Life Span</Text>
                  <Text style={styles.arValue}>{SCAN_RESULT.lifeSpan}</Text>
                </BlurView>
              </Animated.View>
            </View>
          )}

          {/* Viewfinder brackets */}
          <View style={styles.viewfinder}>
            <View style={[styles.bracket, styles.topLeft]} />
            <View style={[styles.bracket, styles.topRight]} />
            <View style={[styles.bracket, styles.bottomLeft]} />
            <View style={[styles.bracket, styles.bottomRight]} />

            {isScanning && (
              <Animated.View style={[styles.scanLineContainer, { transform: [{ translateY }] }]}>
                <LinearGradient colors={['transparent', '#D8F36C', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.scanLine} />
              </Animated.View>
            )}
          </View>

          {/* Scanning / Analyzing Status */}
          {(scanPhase === 'scanning' || scanPhase === 'analyzing') && (
            <BlurView intensity={80} tint="dark" style={styles.loadingBox}>
              <Text style={styles.loadingText}>
                {scanPhase === 'scanning' ? '📡 Scanning Plant...' : '🧠 AI Analyzing...'}
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressPercent}>{progress}%</Text>
            </BlurView>
          )}

          {/* FULL RESULT MODAL */}
          {scanPhase === 'done' && (
            <Animated.View style={[styles.resultOverlay, { opacity: fadeIn }]}>
              <ScrollView style={styles.resultScroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                <BlurView intensity={95} tint="light" style={styles.resultModal}>
                  <View style={styles.modalHeader}>
                    <View>
                      <Text style={styles.modalPlantName}>{SCAN_RESULT.name}</Text>
                      <Text style={styles.modalScientific}>{SCAN_RESULT.scientific}</Text>
                    </View>
                    <TouchableOpacity onPress={resetScan}>
                      <Ionicons name="close-circle" size={32} color="#00C881" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.healthRing}>
                    <View style={[styles.healthCircle, { borderColor: healthColor }]}>
                      <Text style={[styles.healthScore, { color: healthColor }]}>{SCAN_RESULT.overallHealth}</Text>
                      <Text style={styles.healthUnit}>/ 100</Text>
                    </View>
                    <View style={styles.healthMeta}>
                      <View style={[styles.gradeBadge, { backgroundColor: healthColor }]}>
                        <Text style={styles.gradeText}>Grade {SCAN_RESULT.healthGrade}</Text>
                      </View>
                      <Text style={styles.healthLabel}>Overall Plant Health</Text>
                    </View>
                  </View>

                  <View style={styles.statsGrid}>
                    {[
                      { emoji: '🌬', label: 'O₂ Output', val: SCAN_RESULT.oxygenOutput },
                      { emoji: '🌿', label: 'CO₂ Absorbed', val: SCAN_RESULT.co2Absorbed },
                      { emoji: '🧬', label: 'Age', val: SCAN_RESULT.age },
                      { emoji: '⏳', label: 'Life Span', val: SCAN_RESULT.lifeSpan },
                      { emoji: '💧', label: 'Humidity', val: SCAN_RESULT.humidity },
                      { emoji: '🧪', label: 'Soil pH', val: SCAN_RESULT.soilPH },
                    ].map((s, i) => (
                      <View key={i} style={styles.statItem}>
                        <Text style={styles.statEmoji}>{s.emoji}</Text>
                        <Text style={styles.statLabel}>{s.label}</Text>
                        <Text style={styles.statVal}>{s.val}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.diseaseBox}>
                    <View style={styles.diseaseHeader}>
                      <Text style={styles.diseaseTitle}>🦠 Disease Detection</Text>
                      <View style={[styles.severityBadge, { backgroundColor: SCAN_RESULT.diseaseSeverity === 'Low' ? '#FFF3E0' : '#FFEBEE' }]}>
                        <Text style={[styles.severityText, { color: SCAN_RESULT.diseaseSeverity === 'Low' ? '#FF9500' : '#FF3B30' }]}>{SCAN_RESULT.diseaseSeverity} Risk</Text>
                      </View>
                    </View>
                    <Text style={styles.diseaseName}>{SCAN_RESULT.diseaseStatus}</Text>
                    <Text style={styles.diseaseAdvice}>{SCAN_RESULT.diseaseAdvice}</Text>
                  </View>

                  <View style={styles.careBox}>
                    <Text style={styles.careTitle}>🌱 Care Requirements</Text>
                    <View style={styles.careRow}>
                      <View style={styles.careItem}>
                        <Ionicons name="water" size={18} color="#4FC3F7" />
                        <Text style={styles.careLabel}>Water</Text>
                        <Text style={styles.careVal}>{SCAN_RESULT.waterNeeds}</Text>
                      </View>
                      <View style={styles.careItem}>
                        <Ionicons name="sunny" size={18} color="#FFB74D" />
                        <Text style={styles.careLabel}>Sunlight</Text>
                        <Text style={styles.careVal}>{SCAN_RESULT.sunlight}</Text>
                      </View>
                      <View style={styles.careItem}>
                        <MaterialCommunityIcons name="food-apple" size={18} color="#81C784" />
                        <Text style={styles.careLabel}>Fertilizer</Text>
                        <Text style={styles.careVal}>{SCAN_RESULT.fertilizer}</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.detailsFullBtn} onPress={() => { resetScan(); router.push('/details'); }}>
                    <Text style={styles.detailsFullBtnText}>View Full Botanical Report</Text>
                  </TouchableOpacity>
                </BlurView>
              </ScrollView>
            </Animated.View>
          )}
        </View>

        {/* Bottom Controls */}
        {scanPhase !== 'done' && (
          <View style={styles.bottomBar}>
            <BlurView intensity={80} tint="light" style={styles.controlBlur}>
              <TouchableOpacity style={styles.controlItem} onPress={handleScan}>
                <Ionicons name="images-outline" size={26} color="#000" />
                <Text style={styles.controlLabel}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mainScanBtn, isScanning && { backgroundColor: '#FF3B30' }]}
                onPress={handleScan}
              >
                <Ionicons name={isScanning ? "stop" : "scan"} size={30} color={isScanning ? "#FFF" : "#000"} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlItem} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/ar_viewer'); }}>
                <MaterialCommunityIcons name="cube-scan" size={26} color="#00C881" />
                <Text style={[styles.controlLabel, { color: '#00C881' }]}>AR View</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1 },

  // Intro Screen
  introScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  introBack: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  introImg: {
    width: '100%',
    height: height * 0.4,
    marginBottom: 20,
  },
  introContent: {
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#1A2A1A',
    textAlign: 'center',
    lineHeight: 48,
    marginBottom: 15,
  },
  introSub: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 35,
    paddingHorizontal: 10,
  },
  introBtn: {
    width: '100%',
    height: 64,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#00C881',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  introBtnGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
  },

  // Permission screen
  permissionScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  permTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', marginTop: 20, textAlign: 'center' },
  permSub: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  permBtn: { marginTop: 30, width: '100%', height: 56, borderRadius: 28, overflow: 'hidden' },
  permBtnGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  permBtnText: { color: '#1A2A1A', fontSize: 16, fontWeight: 'bold' },

  headerDark: {
    height: 120, backgroundColor: '#1A2A1A', flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 25, paddingTop: 40,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  arToggle: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, gap: 8,
    borderWidth: 1, borderColor: '#FF6F00',
  },
  arActive: { backgroundColor: '#FF6F00' },
  arText: { fontSize: 12, fontWeight: 'bold', color: '#FF6F00' },
  arOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 5 },
  arMarker: { position: 'absolute' },
  arPill: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 15, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  arLabel: { color: '#FFF', fontSize: 10, fontWeight: '600' },
  arValue: { color: '#D8F36C', fontSize: 12, fontWeight: '900' },
  iconBtnWhite: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  viewfinderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  viewfinder: { width: 280, height: 350, position: 'relative' },
  bracket: { position: 'absolute', width: 40, height: 40, borderColor: '#D8F36C' },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 25 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 25 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 25 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 25 },
  scanLineContainer: { position: 'absolute', top: 20, left: 10, right: 10, height: 6 },
  scanLine: { height: 6, borderRadius: 3 },
  loadingBox: { position: 'absolute', padding: 20, borderRadius: 20, width: 260, alignItems: 'center', overflow: 'hidden' },
  loadingText: { color: '#FFF', fontWeight: 'bold', marginBottom: 12, fontSize: 15 },
  progressBar: { width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: '#D8F36C', borderRadius: 3 },
  progressPercent: { color: '#D8F36C', fontWeight: '900', marginTop: 8, fontSize: 14 },

  resultOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 },
  resultScroll: { flex: 1, padding: 15 },
  resultModal: {
    padding: 22, borderRadius: 30, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.92)', borderWidth: 1, borderColor: 'rgba(0,200,129,0.2)',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  modalPlantName: { fontSize: 26, fontWeight: '900', color: '#000' },
  modalScientific: { fontSize: 13, color: '#888', fontStyle: 'italic', marginTop: 2 },

  healthRing: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 18 },
  healthCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 5, alignItems: 'center', justifyContent: 'center' },
  healthScore: { fontSize: 28, fontWeight: '900' },
  healthUnit: { fontSize: 10, color: '#999', fontWeight: 'bold' },
  healthMeta: { flex: 1, gap: 6 },
  gradeBadge: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 12 },
  gradeText: { color: '#FFF', fontWeight: '900', fontSize: 13 },
  healthLabel: { color: '#666', fontSize: 13 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 18, gap: 10 },
  statItem: {
    alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 18,
    width: '30%', shadowColor: '#000', shadowOpacity: 0.05, elevation: 2,
  },
  statEmoji: { fontSize: 22, marginBottom: 4 },
  statLabel: { fontSize: 9, color: '#666', fontWeight: 'bold', textAlign: 'center' },
  statVal: { fontSize: 11, fontWeight: '900', color: '#00C881', marginTop: 2, textAlign: 'center' },

  diseaseBox: {
    backgroundColor: '#FFF8E1', padding: 16, borderRadius: 20, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(255,152,0,0.15)',
  },
  diseaseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  diseaseTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  severityText: { fontSize: 11, fontWeight: '800' },
  diseaseName: { fontSize: 16, fontWeight: '800', color: '#FF9500', marginBottom: 6 },
  diseaseAdvice: { fontSize: 12, color: '#666', lineHeight: 18 },

  careBox: { backgroundColor: 'rgba(0,200,129,0.06)', padding: 16, borderRadius: 20, marginBottom: 18 },
  careTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  careRow: { flexDirection: 'row', justifyContent: 'space-between' },
  careItem: { alignItems: 'center', gap: 4, flex: 1 },
  careLabel: { fontSize: 10, color: '#888', fontWeight: 'bold' },
  careVal: { fontSize: 11, fontWeight: '800', color: '#333', textAlign: 'center' },

  detailsFullBtn: { backgroundColor: '#00C881', height: 55, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  detailsFullBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  bottomBar: { position: 'absolute', bottom: 40, left: 25, right: 25, height: 85, borderRadius: 45, overflow: 'hidden' },
  controlBlur: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.7)' },
  controlItem: { alignItems: 'center', gap: 4 },
  controlLabel: { fontSize: 10, fontWeight: 'bold', color: '#666' },
  mainScanBtn: {
    width: 65, height: 65, borderRadius: 32.5, backgroundColor: '#D8F36C',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#D8F36C', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8,
  },
});
