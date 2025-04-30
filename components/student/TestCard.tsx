import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TestCard = ({ testName, date }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.testName}>{testName}</Text>
      <Text style={styles.date}>Date: {date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});

export default TestCard;