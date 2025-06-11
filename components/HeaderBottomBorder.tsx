import { useHeaderHeight } from '@react-navigation/elements';
import { LinearGradient } from "expo-linear-gradient";
import React from 'react';

const HeaderBottomBorder = () => {
  const headerHeight = useHeaderHeight();

  return (
    <LinearGradient
        start={[0, 0]}
        end={[1, 0]}
        locations={[0, 0.45, 0.55, 1]}
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0)']}
        style={{
            position: 'absolute',
            top: headerHeight,
            left: 0,
            right: 0,
            height: 1,
            zIndex: 1,
        }}
    />
  );
}

export default HeaderBottomBorder;