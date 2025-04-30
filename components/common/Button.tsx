import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false, 
  loading = false,
  type = 'primary' // 'primary', 'secondary', 'outline'
}) => {
  const getButtonStyle = () => {
    if (disabled) return [styles.button, styles.disabledButton, style];
    
    switch (type) {
      case 'secondary':
        return [styles.button, styles.secondaryButton, style];
      case 'outline':
        return [styles.button, styles.outlineButton, style];
      default:
        return [styles.button, styles.primaryButton, style];
    }
  };

  const getTextStyle = () => {
    if (disabled) return [styles.buttonText, styles.disabledText, textStyle];
    
    switch (type) {
      case 'outline':
        return [styles.buttonText, styles.outlineText, textStyle];
      default:
        return [styles.buttonText, textStyle];
    }
  };

  return (
    <TouchableOpacity 
      style={getButtonStyle()} 
      onPress={onPress} 
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: '#5DADE2', // Primary blue color
  },
  secondaryButton: {
    backgroundColor: '#7FB3D5', // Lighter blue
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5DADE2',
  },
  disabledButton: {
    backgroundColor: '#BDC3C7', // Gray color
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  outlineText: {
    color: '#5DADE2',
  },
  disabledText: {
    color: '#7F8C8D',
  },
});

export default Button;