import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Import components
import Card from '../../components/common/Card';
import TestCard from '../../components/student/TestCard';
import Loading from '../../components/common/Loading';
import Header from '../../components/common/Header';

// Import utils, context and constants
import { fetchStudentData } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../constants/colors';

// Define types
type StudentDashboardProps = {};
type TestType = {
  id: string;
  title: string;
  type: 'timed' | 'practice' | 'diagnostic';
  questionsCount: number;
  duration?: number; // optional for practice tests
  completed?: boolean;
};

type NavigationProps = {
  StudentStack: {
    TakeTimedTest: { testId: string };
    TakePracticeTest: { testId: string };
    TakeDiagnosticTest: { testId: string };
    ViewProgress: undefined;
    ViewReport: undefined;
    SearchQuestion: undefined;
    BookmarkedQuestions: undefined;
    RetakeTest: { testId: string };
  };
};

const Dashboard: React.FC<StudentDashboardProps> = () => {
  const navigation = useNavigation<StackNavigationProp<NavigationProps, 'StudentStack'>>();
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [availableTests, setAvailableTests] = useState<TestType[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [stats, setStats] = useState({
    testsCompleted: 0,
    questionsAnswered: 0,
    averageScore: 0,
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch this data from your API
      const data = await fetchStudentData(user?.id);
      
      setAvailableTests(data.availableTests || []);
      setRecentActivity(data.recentActivity || []);
      setStats(data.stats || {
        testsCompleted: 0,
        questionsAnswered: 0,
        averageScore: 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Mock data for UI display
  const mockTests: TestType[] = [
    {
      id: '1',
      title: 'Algebra Readiness',
      type: 'timed',
      questionsCount: 30,
      duration: 45,
    },
    {
      id: '2',
      title: 'Geometry Basics',
      type: 'practice',
      questionsCount: 25,
    },
    {
      id: '3',
      title: 'Math Diagnostic',
      type: 'diagnostic',
      questionsCount: 50,
      duration: 90,
    },
  ];

  if (loading && !refreshing) {
    return <Loading />;
  }

  const navigateToTest = (test: TestType) => {
    switch (test.type) {
      case 'timed':
        navigation.navigate('TakeTimedTest', { testId: test.id });
        break;
      case 'practice':
        navigation.navigate('TakePracticeTest', { testId: test.id });
        break;
      case 'diagnostic':
        navigation.navigate('TakeDiagnosticTest', { testId: test.id });
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Dashboard" />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back, {user?.name || 'Student'}!</Text>
          <Text style={styles.subtitleText}>Let's continue your test prep journey</Text>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.testsCompleted}</Text>
            <Text style={styles.statLabel}>Tests Completed</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.questionsAnswered}</Text>
            <Text style={styles.statLabel}>Questions Answered</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.averageScore}%</Text>
            <Text style={styles.statLabel}>Average Score</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Tests</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {mockTests.map((test) => (
              <TestCard 
                key={test.id} 
                test={test} 
                onPress={() => navigateToTest(test)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.menuGrid}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigation.navigate('ViewProgress')}
            >
              <View style={[styles.menuIcon, { backgroundColor: colors.primary }]} />
              <Text style={styles.menuText}>View Progress</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigation.navigate('ViewReport')}
            >
              <View style={[styles.menuIcon, { backgroundColor: colors.secondary }]} />
              <Text style={styles.menuText}>View Reports</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigation.navigate('SearchQuestion')}
            >
              <View style={[styles.menuIcon, { backgroundColor: colors.accent }]} />
              <Text style={styles.menuText}>Search Questions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigation.navigate('BookmarkedQuestions')}
            >
              <View style={[styles.menuIcon, { backgroundColor: colors.warning }]} />
              <Text style={styles.menuText}>Bookmarks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: colors.primary,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  menuSection: {
    padding: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

export default Dashboard;