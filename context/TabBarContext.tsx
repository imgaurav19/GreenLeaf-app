import React, { createContext, useContext, useRef, useCallback } from 'react';
import { Animated } from 'react-native';

type TabBarContextType = {
  tabBarTranslateY: Animated.Value;
  tabBarOpacity: Animated.Value;
  handleScroll: (event: any) => void;
};

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export function TabBarProvider({ children }: { children: React.ReactNode }) {
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;
  const tabBarOpacity = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);

  const handleScroll = useCallback((event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;
    const scrollingDown = diff > 0 && currentY > 80;
    const scrollingUp = diff < -5;

    if (scrollingDown && !isHidden.current) {
      isHidden.current = true;
      Animated.parallel([
        Animated.timing(tabBarTranslateY, { toValue: 120, duration: 300, useNativeDriver: true }),
        Animated.timing(tabBarOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    } else if (scrollingUp && isHidden.current) {
      isHidden.current = false;
      Animated.parallel([
        Animated.timing(tabBarTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(tabBarOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }

    lastScrollY.current = currentY;
  }, []);

  return (
    <TabBarContext.Provider value={{ tabBarTranslateY, tabBarOpacity, handleScroll }}>
      {children}
    </TabBarContext.Provider>
  );
}

export function useTabBar() {
  const context = useContext(TabBarContext);
  if (!context) throw new Error('useTabBar must be used within TabBarProvider');
  return context;
}
