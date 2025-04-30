import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

const Card = ({ 
  children, 
  style, 
  onPress = null, 
  elevation = 2,
  bordered = false
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent 
      style={[
        styles.card, 
        { elevation },
        bordered && styles.bordered,
        style
      ]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bordered: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});

export default Card;