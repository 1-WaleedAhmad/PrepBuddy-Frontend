import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StudentNavigator from './StudentNavigator';
import TeacherNavigator from './TeacherNavigator';
import AdminNavigator from './AdminNavigator';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { userType } = useAuth();

  // Based on user type, show appropriate navigator
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userType === 'student' ? (
        <Stack.Screen name="StudentRoot" component={StudentNavigator} />
      ) : userType === 'teacher' ? (
        <Stack.Screen name="TeacherRoot" component={TeacherNavigator} />
      ) : (
        <Stack.Screen name="AdminRoot" component={AdminNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;