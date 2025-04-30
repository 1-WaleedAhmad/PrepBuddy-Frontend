import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SearchQuestion = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Question</Text>
      <Text style={styles.description}>This screen will allow students to search for specific questions.</Text>
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

export default SearchQuestion;