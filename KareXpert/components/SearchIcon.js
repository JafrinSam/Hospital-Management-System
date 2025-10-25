import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

/**
 * A simple, reusable Search Icon component.
 *
 * @param {object} props
 * @param {string} [props.color='#000'] - The color of the icon.
 * @param {number} [props.size=24] - The width and height of the icon.
 * @param {object} [props.style] - Optional style prop to pass to the Svg component.
 */
export const SearchIcon = ({ color = '#000', size = 24, style }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}>
      {/* The magnifying glass circle */}
      <Circle cx="11" cy="11" r="8" />
      {/* The handle */}
      <Path d="m21 21-4.35-4.35" />
    </Svg>
  );
};

export default SearchIcon;
