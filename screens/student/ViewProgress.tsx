import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ViewProgress = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Progress</Text>
      <Text style={styles.description}>This screen will display the student's progress over time.</Text>
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

export default ViewProgress;