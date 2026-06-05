import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';

type UserContextType = {
  userName: string;
  setUserName: (name: string) => void;
  avatar: string;
  setAvatar: (avatar: string) => void;
  locationCity: string;
  setLocationCity: (city: string) => void;
  area: string;
  setArea: (area: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (darkMode: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState('Rehan');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop');
  const [locationCity, setLocationCity] = useState('Kolkata');
  const [area, setArea] = useState('Finding area...');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      
      let loc = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude, longitude: loc.coords.longitude
      });
      if (address.length > 0) {
        const addr = address[0];
        const detail = `${addr.name || addr.street || ''}, ${addr.district || addr.subregion || ''}`;
        setArea(detail);
        setLocationCity(addr.city || 'Kolkata');
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{ userName, setUserName, avatar, setAvatar, locationCity, setLocationCity, area, setArea, isDarkMode, setIsDarkMode }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
