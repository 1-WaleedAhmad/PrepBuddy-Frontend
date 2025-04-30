import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import student screens
import Dashboard from '../screens/student/Dashboard';
import TakeTimedTest from '../screens/student/TakeTimedTest';
import TakePracticeTest from '../screens/student/TakePracticeTest';
import TakeDiagnosticTest from '../screens/student/TakeDiagnosticTest';
import ViewProgress from '../screens/student/ViewProgress';
import ViewReport from '../screens/student/ViewReport';
import SearchQuestion from '../screens/student/SearchQuestion';
import BookmarkedQuestions from '../screens/student/BookmarkedQuestions';
import RetakeTest from '../screens/student/RetakeTest';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator for Tests screens
const TestsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TestsHome" component={Dashboard} options={{ title: 'Tests' }} />
      <Stack.Screen name="TimedTest" component={TakeTimedTest} options={{ title: 'Timed Test' }} />
      <Stack.Screen name="PracticeTest" component={TakePracticeTest} options={{ title: 'Practice Test' }} />
      <Stack.Screen name="DiagnosticTest" component={TakeDiagnosticTest} options={{ title: 'Diagnostic Test' }} />
      <Stack.Screen name="RetakeTest" component={RetakeTest} options={{ title: 'Retake Test' }} />
    </Stack.Navigator>
  );
};

// Stack navigator for Progress screens
const ProgressNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Progress" component={ViewProgress} options={{ title: 'My Progress' }} />
      <Stack.Screen name="Report" component={ViewReport} options={{ title: 'Test Report' }} />
    </Stack.Navigator>
  );
};

// Stack navigator for Questions screens
const QuestionsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchQuestions" component={SearchQuestion} options={{ title: 'Search Questions' }} />
      <Stack.Screen name="BookmarkedQuestions" component={BookmarkedQuestions} options={{ title: 'My Bookmarks' }} />
    </Stack.Navigator>
  );
};

// Main tab navigator for student
const StudentNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Tests"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Tests') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Questions') {
            iconName = focused ? 'search' : 'search-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5DADE2',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Tests" 
        component={TestsNavigator} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressNavigator} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Questions" 
        component={QuestionsNavigator} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default StudentNavigator;