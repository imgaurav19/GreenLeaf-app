import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, Switch, TextInput, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userName, setUserName] = useState('Jacob Oran');
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logging out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", onPress: () => router.replace('/login'), style: 'destructive' }
    ]);
  };

  const bgColor = isDarkMode ? '#1A1A1A' : '#FFF';
  const textColor = isDarkMode ? '#FFF' : '#000';
  const subTextColor = isDarkMode ? '#AAA' : '#666';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={{ height: insets.top, backgroundColor: '#1A2A1A' }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        
        {/* Explore-style Header for Profile */}
        <View style={styles.headerExplore}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerExploreTitle}>Your Profile</Text>
        </View>

        {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.avatar} />
              <TouchableOpacity style={styles.editBadge}>
                <Ionicons name="camera" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.nameRow}>
              {isEditing ? (
                <TextInput 
                  style={[styles.nameInput, { color: textColor }]} 
                  value={userName} 
                  onChangeText={setUserName} 
                  autoFocus 
                  onBlur={() => setIsEditing(false)}
                />
              ) : (
                <Text style={[styles.userName, { color: textColor }]}>{userName}</Text>
              )}
              <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                <Ionicons name={isEditing ? "checkmark-circle" : "create-outline"} size={20} color="#00C881" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.userEmail, { color: subTextColor }]}>jacob.oran@design.com</Text>
          </View>

          {/* Settings Groups */}
          <View style={styles.settingsGroup}>
            <Text style={[styles.groupTitle, { color: textColor }]}>Account</Text>
            <View style={[styles.groupCard, { backgroundColor: isDarkMode ? '#333' : '#F9F9F9' }]}>
              <SettingItem 
                icon="receipt-outline" 
                label="Order Tracking" 
                color={textColor}
                onPress={() => router.push('/tracking')} 
              />
              <SettingItem icon="leaf-outline" label="My Garden" color={textColor} />
              <SettingItem icon="notifications-outline" label="Notifications" color={textColor} />
            </View>
          </View>


          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

        </ScrollView>
    </View>
  );
}

function SettingItem({ icon, label, badge, color, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color={color} />
        <Text style={[styles.settingLabel, { color }]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color="#CCC" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerExplore: {
    padding: 25,
    paddingTop: 50,
    backgroundColor: '#1A2A1A',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 40,
  },
  headerExploreTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    marginTop: 15,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutTopBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEE',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00C881',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userName: {
    fontSize: 26,
    fontWeight: '900',
  },
  nameInput: {
    fontSize: 26,
    fontWeight: '900',
    borderBottomWidth: 1,
    borderBottomColor: '#00C881',
    minWidth: 150,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 5,
  },
  settingsGroup: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  groupCard: {
    borderRadius: 25,
    padding: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  statSub: {
    fontSize: 10,
    color: '#888',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 200, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C881',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#00C881',
  },
  badge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 25,
    marginTop: 10,
    marginBottom: 30,
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#FF3B30',
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
