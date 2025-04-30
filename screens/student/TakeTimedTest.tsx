import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Import components
import Loading from '../../components/common/Loading';
import QuestionItem from '../../components/student/QuestionItem';
import Header from '../../components/common/Header';

// Import utils, constants, and api
import { fetchTestDetails, submitTestAnswers } from '../../utils/api';
import { colors } from '../../constants/colors';

// Define types
type Question = {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex?: number;
};

type TimedTestParams = {
  testId: string;
};

type TimedTestProps = {
  route: RouteProp<{ params: TimedTestParams }, 'params'>;
  navigation: StackNavigationProp<any>;
};

const TakeTimedTest: React.FC<TimedTestProps> = ({ route, navigation }) => {
  const { testId } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [testTitle, setTestTitle] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchTest();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [testId]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from your API
      const testData = await fetchTestDetails(testId);
      
      // Mock data for display
      const mockTest = {
        id: testId,
        title: 'Algebra Fundamentals',
        duration: 30 * 60, // 30 minutes in seconds
        questions: Array(10).fill(null).map((_, i) => ({
          id: `q${i+1}`,
          questionText: `This is question ${i+1} about algebra fundamentals. Solve for x: 2x + 3 = ${i+5}`,
          options: [
            `Option A: x = ${(i+2)/2}`,
            `Option B: x = ${(i+3)/2}`,
            `Option C: x = ${(i+1)}`,
            `Option D: x = ${(i-1)/2}`
          ],
          correctAnswerIndex: 1
        }))
      };

      setQuestions(mockTest.questions);
      setTestTitle(mockTest.title);
      setTimeRemaining(mockTest.duration);
      setSelectedAnswers(new Array(mockTest.questions.length).fill(null));
      
      // Start the timer
      startTimer();
    } catch (error) {
      console.error('Error fetching test:', error);
      Alert.alert('Error', 'Failed to load test. Please try again.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up, auto-submit
          if (timerRef.current) clearInterval(timerRef.current);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Confirm submission
    if (!testCompleted) {
      const unansweredCount = selectedAnswers.filter(ans => ans === null).length;
      
      if (unansweredCount > 0 && timeRemaining > 0) {
        Alert.alert(
          'Confirm Submission',
          `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`,
          [
            { 
              text: 'Cancel', 
              style: 'cancel',
              onPress: () => {
                // Restart the timer
                startTimer();
              }
            },
            { 
              text: 'Submit', 
              onPress: () => submitTest() 
            }
          ]
        );
      } else {
        submitTest();
      }
    }
  };

  const submitTest = async () => {
    try {
      setLoading(true);
      // In a real app, this would submit to your API
      await submitTestAnswers(testId, selectedAnswers);
      
      setTestCompleted(true);
      setLoading(false);
      
      // Navigate to results screen
      navigation.replace('ViewReport', { 
        testId, 
        resultId: 'result-' + Date.now(),
        fromTest: true
      });
    } catch (error) {
      console.error('Error submitting test:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to submit test. Please try again.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = selectedAnswers.filter(ans => ans !== null).length;

  return (
    <SafeAreaView style={styles.container}>
      <Header title={testTitle} showBackButton={false} />
      
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Time Remaining:</Text>
        <Text style={[
          styles.timerValue, 
          timeRemaining < 60 && styles.timerWarning
        ]}>
          {formatTime(timeRemaining)}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>
      
      <ScrollView style={styles.contentContainer}>
        {questions.length > 0 && (
          <QuestionItem
            question={questions[currentQuestionIndex]}
            selectedAnswer={selectedAnswers[currentQuestionIndex]}
            onSelectAnswer={(answerIndex) => 
              handleAnswerSelect(currentQuestionIndex, answerIndex)
            }
            questionNumber={currentQuestionIndex + 1}
          />
        )}
      </ScrollView>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {answeredCount} of {questions.length} questions answered
        </Text>
      </View>
      
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        
        {currentQuestionIndex < questions.length - 1 ? (
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, testCompleted && styles.disabledButton]}
            onPress={handleSubmitTest}
            disabled={testCompleted}
          >
            <Text style={styles.submitButtonText}>Submit Test</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  timerValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 10,
  },
  timerWarning: {
    color: colors.error,
  },
  progressContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  summaryContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  navButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default TakeTimedTest;