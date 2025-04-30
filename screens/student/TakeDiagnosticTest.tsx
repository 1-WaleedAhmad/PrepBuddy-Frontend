import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Modal,
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
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  correctAnswerIndex?: number;
};

type DiagnosticTestParams = {
  testId: string;
};

type DiagnosticTestProps = {
  route: RouteProp<{ params: DiagnosticTestParams }, 'params'>;
  navigation: StackNavigationProp<any>;
};

const TakeDiagnosticTest: React.FC<DiagnosticTestProps> = ({ route, navigation }) => {
  const { testId } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [testTitle, setTestTitle] = useState<string>('');
  const [showIntroModal, setShowIntroModal] = useState<boolean>(true);
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
        title: 'Math Diagnostic Assessment',
        duration: 45 * 60, // 45 minutes in seconds
        description: 'This diagnostic test will assess your current math abilities across various topics. Your results will help personalize your study plan.',
        instructions: 'Answer each question to the best of your ability. You can skip questions and return to them later. Your performance on this test will determine your starting level.',
        questions: Array(15).fill(null).map((_, i) => {
          // Create different question types based on index
          const topics = ['Algebra', 'Geometry', 'Statistics', 'Calculus', 'Number Theory'];
          const difficulties = ['easy', 'medium', 'hard'] as const;
          
          return {
            id: `q${i+1}`,
            questionText: `Diagnostic question ${i+1}: Solve the ${topics[i % 5].toLowerCase()} problem based on the given information.`,
            options: [
              `Option A: Answer option 1`,
              `Option B: Answer option 2`,
              `Option C: Answer option 3`,
              `Option D: Answer option 4`
            ],
            topic: topics[i % 5],
            difficulty: difficulties[Math.floor(i / 5) % 3]
          };
        })
      };

      setQuestions(mockTest.questions);
      setTestTitle(mockTest.title);
      setTimeRemaining(mockTest.duration);
      setSelectedAnswers(new Array(mockTest.questions.length).fill(null));
    } catch (error) {
      console.error('Error fetching test:', error);
      Alert.alert('Error', 'Failed to load test. Please try again.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const startTest = () => {
    setShowIntroModal(false);
    // Start the timer
    startTimer();
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

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
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
      
      // Navigate to results screen with diagnostic results
      navigation.replace('ViewReport', { 
        testId, 
        resultId: 'diagnostic-' + Date.now(),
        fromDiagnostic: true
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
      
      {/* Introduction Modal */}
      <Modal
        visible={showIntroModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{testTitle}</Text>
            <Text style={styles.modalSubtitle}>Diagnostic Assessment</Text>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.instructionTitle}>Description:</Text>
              <Text style={styles.instructionText}>
                This diagnostic test will assess your current math abilities across various topics. 
                Your results will help personalize your study plan.
              </Text>
              
              <Text style={styles.instructionTitle}>Instructions:</Text>
              <Text style={styles.instructionText}>
                • Answer each question to the best of your ability{'\n'}
                • You can skip questions and return to them later{'\n'}
                • Your performance will determine your starting level{'\n'}
                • You have 45 minutes to complete the test{'\n'}
                • Click "Start Test" when you're ready
              </Text>
              
              <Text style={styles.instructionTitle}>Topics Covered:</Text>
              <Text style={styles.instructionText}>
                • Algebra{'\n'}
                • Geometry{'\n'}
                • Statistics{'\n'}
                • Calculus{'\n'}
                • Number Theory
              </Text>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.startButton}
              onPress={startTest}
            >
              <Text style={styles.startButtonText}>Start Test</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Time Remaining:</Text>
        <Text style={[
          styles.timerValue, 
          timeRemaining < 300 && styles.timerWarning
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
            showTopic={true}
            showDifficulty={true}
          />
        )}
      </ScrollView>
      
      <View style={styles.questionNavigator}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {questions.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.questionDot,
                currentQuestionIndex === index && styles.currentQuestionDot,
                selectedAnswers[index] !== null && styles.answeredQuestionDot
              ]}
              onPress={() => jumpToQuestion(index)}
            >
              <Text style={[
                styles.questionDotText,
                currentQuestionIndex === index && styles.currentQuestionDotText
              ]}>
                {index + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalContent: {
    maxHeight: 350,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  startButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
  questionNavigator: {
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  questionDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  currentQuestionDot: {
    backgroundColor: colors.primary,
  },
  answeredQuestionDot: {
    backgroundColor: colors.secondary,
  },
  questionDotText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  currentQuestionDotText: {
    color: 'white',
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

export default TakeDiagnosticTest;