import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function Index() {
  const [tasks, setTasks] = useState(['', '', '', '', '']);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 現在時刻を更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // アプリ起動時にタスクを読み込み
  useEffect(() => {
    loadTasks();
  }, []);

  const getTodayKey = () => {
    return new Date().toDateString();
  };

  const loadTasks = async () => {
    try {
      const todayKey = getTodayKey();
      const savedTasks = await AsyncStorage.getItem(todayKey);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        // 新しい日なので空のタスクをセット
        setTasks(['', '', '', '', '']);
      }
    } catch (error) {
      console.error('タスクの読み込みに失敗しました:', error);
    }
  };

  const saveTasks = async (newTasks: string[]) => {
    try {
      const todayKey = getTodayKey();
      await AsyncStorage.setItem(todayKey, JSON.stringify(newTasks));
    } catch (error) {
      console.error('タスクの保存に失敗しました:', error);
    }
  };

  const updateTask = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const handleSave = () => {
    saveTasks(tasks);
    setIsEditing(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  // タスクが入力されているかチェック
  const hasAnyTasks = tasks.some(task => task.trim() !== '');

  if (isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.editHeader}>
          <Text style={styles.editHeaderTitle}>今日のフォーカス</Text>
          <Text style={styles.editDate}>{formatDate(currentTime)}</Text>
        </View>

        <ScrollView style={styles.editContainer} showsVerticalScrollIndicator={false}>
          {tasks.map((task, index) => (
            <View key={index} style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{index + 1}. フォーカスタスク</Text>
              <TextInput
                style={styles.textInput}
                value={task}
                onChangeText={(text) => updateTask(index, text)}
                placeholder="今日集中することを入力..."
                placeholderTextColor="#666"
                multiline
                maxLength={100}
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>フォーカスを設定</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // メイン表示画面
  if (!hasAnyTasks) {
    // タスクが何も入力されていない場合の初期画面
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>今日の{'\n'}フォーカスは？</Text>
          <Text style={styles.welcomeSubtitle}>集中したいことを5つ設定しましょう</Text>
          
          <TouchableOpacity style={styles.startButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.startButtonText}>フォーカスを設定</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* 時刻表示 */}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
      </View>

      {/* メインコンテンツ */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.todayLabel}>TODAY'S FOCUS</Text>
        
        {tasks.map((task, index) => (
          task.trim() !== '' && (
            <View key={index} style={styles.focusItem}>
              <Text style={styles.focusText}>{task}</Text>
            </View>
          )
        ))}
      </ScrollView>

      {/* 編集ボタン */}
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => setIsEditing(true)}
      >
        <Text style={styles.floatingButtonText}>✏️</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  // 初期画面
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 40,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 60,
  },
  startButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // メイン画面
  timeContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  time: {
    fontSize: 24,
    fontWeight: '300',
    color: '#fff',
    letterSpacing: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  todayLabel: {
    fontSize: 12,
    color: '#888',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '500',
  },
  focusItem: {
    marginBottom: 30,
    alignItems: 'center',
  },
  focusText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 32,
  },
  
  // 編集画面
  editHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  editHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  editDate: {
    fontSize: 14,
    color: '#888',
  },
  editContainer: {
    flex: 1,
    paddingHorizontal: 30,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    minHeight: 60,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // フローティングボタン
  floatingButton: {
    position: 'absolute',
    right: 30,
    bottom: 40,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    fontSize: 18,
  },
});