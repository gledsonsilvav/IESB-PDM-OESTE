import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function FadeIn({ children, style }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return <Animated.View style={[style, { opacity: fadeAnim }]}>{children}</Animated.View>;
}