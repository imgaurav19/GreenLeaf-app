import React, { useState } from 'react';
import {
  StyleSheet, View, Text, Modal, TouchableOpacity,
  TextInput, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useUser } from '@/context/UserContext';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

type LocationPickerModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const PRESET_LOCATIONS = [
  { city: 'Kolkata', area: 'Salt Lake, Sector V', latitude: 22.5726, longitude: 88.3639, icon: 'city' },
  { city: 'Mumbai', area: 'Bandra West, Link Road', latitude: 19.0596, longitude: 72.8295, icon: 'office-building' },
  { city: 'Delhi', area: 'Connaught Place, Central Delhi', latitude: 28.6304, longitude: 77.2177, icon: 'fort' },
  { city: 'Bangalore', area: 'Indiranagar, 100 Feet Road', latitude: 12.9716, longitude: 77.5946, icon: 'home-city' },
  { city: 'Pune', area: 'Koregaon Park, Lane 6', latitude: 18.5362, longitude: 73.8940, icon: 'tree' },
  { city: 'Hyderabad', area: 'Gachibowli, Hitec City', latitude: 17.4483, longitude: 78.3741, icon: 'lightning-bolt' },
];

export default function LocationPickerModal({ visible, onClose }: LocationPickerModalProps) {
  const { locationCity, setLocationCity, area, setArea, coords, setCoords, isDarkMode } = useUser();
  const [customAddress, setCustomAddress] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  const bgColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A2A1A';
  const subTextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const inputBg = isDarkMode ? '#2D2D2D' : '#F3F4F6';
  const borderCol = isDarkMode ? 'rgba(255,255,255,0.08)' : '#E5E7EB';

  const selectPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLocationCity(preset.city);
    setArea(preset.area);
    setCoords({ latitude: preset.latitude, longitude: preset.longitude });
    onClose();
  };

  const handleUseCurrentLocation = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setGpsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'GPS permission is needed to detect current location.');
        setGpsLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

      let address = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        const detail = `${addr.name || addr.street || ''}, ${addr.district || addr.subregion || ''}`;
        setArea(detail || 'Current Location Details');
        setLocationCity(addr.city || 'My City');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setArea('Unknown Location');
        setLocationCity('My City');
      }
      onClose();
    } catch (error) {
      console.warn(error);
      Alert.alert('Error Detecting Location', 'Failed to retrieve GPS location.');
    } finally {
      setGpsLoading(false);
    }
  };

  const handleSaveCustomAddress = () => {
    if (!customAddress.trim()) {
      Alert.alert('Address Empty', 'Please enter a valid address.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Split input by commas to guess city, or default to current
    const parts = customAddress.split(',');
    const cityGuess = parts.length > 1 ? parts[parts.length - 1].trim() : locationCity;
    
    setArea(customAddress.trim());
    setLocationCity(cityGuess || 'Kolkata');
    
    // Maintain current coords or look if it matches a preset city
    const matchedPreset = PRESET_LOCATIONS.find(p => p.city.toLowerCase() === cityGuess.toLowerCase());
    if (matchedPreset) {
      setCoords({ latitude: matchedPreset.latitude, longitude: matchedPreset.longitude });
    }
    
    setCustomAddress('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismissArea} activeOpacity={1} onPress={onClose} />
        
        <View style={[styles.bottomSheet, { backgroundColor: bgColor }]}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>Select Delivery Address</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: inputBg }]}>
              <Ionicons name="close" size={20} color={textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Custom address input */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Enter Address</Text>
              <View style={[styles.inputRow, { backgroundColor: inputBg }]}>
                <Ionicons name="search-outline" size={18} color={subTextColor} />
                <TextInput
                  placeholder="e.g. Block C, Sector 5, Kolkata"
                  placeholderTextColor={subTextColor}
                  style={[styles.input, { color: textColor }]}
                  value={customAddress}
                  onChangeText={setCustomAddress}
                />
                {customAddress.length > 0 && (
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSaveCustomAddress}>
                    <Text style={styles.saveText}>Save</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* GPS Button */}
            <TouchableOpacity 
              style={styles.gpsBtn} 
              onPress={handleUseCurrentLocation}
              disabled={gpsLoading}
            >
              <LinearGradient colors={['#00C881', '#00A86B']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.gpsInner}>
                {gpsLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Ionicons name="location" size={18} color="#FFF" />
                )}
                <Text style={styles.gpsText}>Use Current Location (GPS)</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: borderCol }]} />

            {/* Presets */}
            <Text style={[styles.sectionTitle, { color: textColor, marginBottom: 12 }]}>Popular Cities</Text>
            <View style={styles.presetGrid}>
              {PRESET_LOCATIONS.map((preset) => {
                const isSelected = locationCity.toLowerCase() === preset.city.toLowerCase();
                return (
                  <TouchableOpacity
                    key={preset.city}
                    style={[
                      styles.presetCard,
                      { 
                        backgroundColor: inputBg,
                        borderColor: isSelected ? '#00C881' : 'transparent',
                        borderWidth: 1.5,
                      }
                    ]}
                    onPress={() => selectPreset(preset)}
                  >
                    <View style={[styles.presetIconWrap, { backgroundColor: isSelected ? 'rgba(0,200,129,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                      <MaterialCommunityIcons 
                        name={preset.icon as any} 
                        size={20} 
                        color={isSelected ? '#00C881' : textColor} 
                      />
                    </View>
                    <View style={styles.presetTextWrap}>
                      <Text style={[styles.presetCity, { color: textColor }]}>{preset.city}</Text>
                      <Text style={[styles.presetArea, { color: subTextColor }]} numberOfLines={1}>{preset.area}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={18} color="#00C881" style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#00C881',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gpsBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
  },
  gpsInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    gap: 8,
  },
  gpsText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: 10,
    marginBottom: 20,
  },
  presetGrid: {
    gap: 10,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    gap: 12,
  },
  presetIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetTextWrap: {
    flex: 1,
  },
  presetCity: {
    fontSize: 14,
    fontWeight: '700',
  },
  presetArea: {
    fontSize: 12,
    marginTop: 2,
  },
  checkIcon: {
    marginLeft: 8,
  },
});
