import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import admin screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import ManageTeachers from '../screens/admin/ManageTeachers';
import ManageStudents from '../screens/admin/ManageStudents';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator for User Management
const UserManagementNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserManagement" component={AdminDashboard} options={{ title: 'User Management' }} />
      <Stack.Screen name="ManageTeachers" component={ManageTeachers} options={{ title: 'Manage Teachers' }} />
      <Stack.Screen name="ManageStudents" component={ManageStudents} options={{ title: 'Manage Students' }} />
    </Stack.Navigator>
  );
};

// Main tab navigator for admin
const AdminNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5DADE2',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={AdminDashboard} 
      />
      <Tab.Screen 
        name="Users" 
        component={UserManagementNavigator} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator;