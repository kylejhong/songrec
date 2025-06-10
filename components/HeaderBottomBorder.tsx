import { useHeaderHeight } from '@react-navigation/elements';
import { LinearGradient } from "expo-linear-gradient";
import React from 'react';

const HeaderBottomBorder = () => {
  const headerHeight = useHeaderHeight();

  return (
    <LinearGradient
        start={[0, 0]}
        end={[1, 0]}
        locations={[0, 0.4, 0.6, 1]}
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
        style={{
            position: 'absolute',
            top: headerHeight,
            left: 30,
            right: 30,
            height: 1,
            zIndex: 1,
        }}
    />
  );
}

export default HeaderBottomBorder;