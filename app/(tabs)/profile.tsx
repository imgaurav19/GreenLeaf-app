import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Switch, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/context/UserContext';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { userName, setUserName, isDarkMode, setIsDarkMode, avatar } = useUser();
  const [pushNotifs, setPushNotifs] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logging out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", onPress: () => router.replace('/login'), style: 'destructive' }
    ]);
  };

  const bgColor = isDarkMode ? '#0D140D' : '#FFF';
  const textColor = isDarkMode ? '#FFF' : '#000';
  const subTextColor = isDarkMode ? '#AAA' : '#666';
  const cardBg = isDarkMode ? 'rgba(255,255,255,0.08)' : '#F9F9F9';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={{ height: insets.top, backgroundColor: isDarkMode ? '#0D140D' : '#1A2A1A' }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        
        {/* Header */}
        <View style={[styles.profileHeader, isDarkMode && { backgroundColor: '#0D140D' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.profileHeaderTitle, { color: textColor }]}>Profile Settings</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={22} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="pencil" size={14} color="#FFF" />
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
              <Ionicons name={isEditing ? "checkmark-circle" : "create-outline"} size={20} color="#D8F36C" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.userEmail, { color: subTextColor }]}>scarlett.greens@botany.com</Text>

          {/* Stats Row */}
          <View style={[styles.statsGrid, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: textColor }]}>12</Text>
              <Text style={[styles.statLabel, { color: subTextColor }]}>Plants</Text>
            </View>
            <View style={[styles.statItem, styles.statBorder]}>
              <Text style={[styles.statNum, { color: textColor }]}>450g</Text>
              <Text style={[styles.statLabel, { color: subTextColor }]}>CO2 Saved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: textColor }]}>2.4k</Text>
              <Text style={[styles.statLabel, { color: subTextColor }]}>Points</Text>
            </View>
          </View>
        </View>

        {/* Achievements Section - New */}
        <View style={styles.settingsGroup}>
          <Text style={[styles.groupTitle, { color: textColor }]}>Badges Earned</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeScroll}>
            <BadgeItem icon="trophy" label="Top Care" color="#FFD700" />
            <BadgeItem icon="leaf" label="Greens" color="#4CAF50" />
            <BadgeItem icon="star" label="Expert" color="#2196F3" />
            <BadgeItem icon="water" label="Hydrator" color="#00BCD4" />
          </ScrollView>
        </View>

        {/* Account Settings */}
        <View style={styles.settingsGroup}>
          <Text style={[styles.groupTitle, { color: textColor }]}>My Activities</Text>
          <View style={[styles.groupCard, { backgroundColor: cardBg, borderColor, borderWidth: 1 }]}>
            <SettingItem icon="receipt-outline" label="Order History" color={textColor} onPress={() => router.push('/orders')} />
            <SettingItem icon="calendar-outline" label="Care Calendar" color={textColor} />
            <SettingItem icon="leaf-outline" label="My Virtual Garden" color={textColor} />
            <SettingItem icon="heart-outline" label="Wishlist" badge="8" color={textColor} />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.settingsGroup}>
          <Text style={[styles.groupTitle, { color: textColor }]}>Experience</Text>
          <View style={[styles.groupCard, { backgroundColor: cardBg, borderColor, borderWidth: 1 }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="moon" size={22} color="#D8F36C" />
                <Text style={[styles.settingLabel, { color: textColor }]}>Dark Theme</Text>
              </View>
              <CustomSwitch value={isDarkMode} onValueChange={setIsDarkMode} />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications" size={22} color="#FF9500" />
                <Text style={[styles.settingLabel, { color: textColor }]}>Push Notifications</Text>
              </View>
              <CustomSwitch value={pushNotifs} onValueChange={setPushNotifs} />
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: subTextColor }]}>Green Leaf Marketplace • Hackathon Version 1.0</Text>

      </ScrollView>
    </View>
  );
}

function BadgeItem({ icon, label, color }: any) {
  return (
    <View style={styles.badgeCard}>
      <View style={[styles.badgeIconWrap, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.badgeLabel}>{label}</Text>
    </View>
  );
}

function SettingItem({ icon, label, badge, color, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.settingItem} activeOpacity={0.7}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIconBg, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={[styles.settingLabel, { color }]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {badge && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color="rgba(150,150,150,0.5)" />
      </View>
    </TouchableOpacity>
  );
}

function CustomSwitch({ value, onValueChange }: { value: boolean, onValueChange: (val: boolean) => void }) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      style={[styles.customSwitch, { backgroundColor: value ? '#00C881' : '#E0E0E0' }]} 
      onPress={() => onValueChange(!value)}
    >
      <View style={[styles.switchThumb, { transform: [{ translateX: value ? 22 : 2 }] }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  profileHeaderTitle: { fontSize: 18, fontWeight: '900' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  profileSection: { alignItems: 'center', marginVertical: 20 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#1A2A1A',
    borderWidth: 3, borderColor: '#D8F36C',
  },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0, width: 30, height: 30,
    borderRadius: 15, backgroundColor: '#00C881', alignItems: 'center',
    justifyContent: 'center', borderWidth: 2, borderColor: '#FFF',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  userName: { fontSize: 24, fontWeight: '900' },
  nameInput: {
    fontSize: 24, fontWeight: '900', borderBottomWidth: 1,
    borderBottomColor: '#00C881', minWidth: 120, textAlign: 'center',
  },
  userEmail: { fontSize: 13, marginTop: 4 },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row', marginTop: 25, marginHorizontal: 20,
    borderRadius: 20, padding: 20, borderWidth: 1,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statNum: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 10, fontWeight: '600', marginTop: 4, textTransform: 'uppercase' },

  // Badges
  badgeScroll: { paddingHorizontal: 20, gap: 15 },
  badgeCard: { alignItems: 'center', gap: 6 },
  badgeIconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  badgeLabel: { fontSize: 11, fontWeight: '700', color: '#888' },

  // Settings
  settingsGroup: { paddingHorizontal: 20, marginBottom: 25 },
  groupTitle: { fontSize: 13, fontWeight: '800', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1.2 },
  groupCard: { borderRadius: 24, overflow: 'hidden' },
  settingItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18,
    borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.1)',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  settingIconBg: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: 16, fontWeight: '600' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  countBadge: { backgroundColor: '#D8F36C', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  countBadgeText: { color: '#1A2A1A', fontSize: 12, fontWeight: '900' },
  
  customSwitch: {
    width: 52, height: 30, borderRadius: 15, justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  switchThumb: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: '#FFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginHorizontal: 20, marginTop: 10, marginBottom: 30, height: 56,
    borderRadius: 20, backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  logoutText: { color: '#FF3B30', fontSize: 16, fontWeight: '900' },
  versionText: { textAlign: 'center', fontSize: 11, marginBottom: 40, fontWeight: '600', letterSpacing: 0.5 },
});
