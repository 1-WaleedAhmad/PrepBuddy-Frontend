import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ManageStudents = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Students</Text>
      <Text style={styles.description}>This screen will allow administrators to manage student accounts and data.</Text>
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

export default ManageStudents;