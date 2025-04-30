import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RetakeTest = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Retake Test</Text>
      <Text style={styles.description}>This screen will allow students to retake a previously attempted test.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default RetakeTest;