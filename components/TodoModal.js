import React, { useState } from 'react';
import { StyleSheet, Text, View, Animated, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import colors from '../Colors';
import { Swipeable } from 'react-native-gesture-handler';

export default function TodoModal({ list, closeModal, updateList }) {
  const [name, setName] = useState(list.name);
  const [color, setColor] = useState(list.color);
  const [todos, setTodos] = useState(list.todos);
  const [newTodo, setnewTodo] = useState('');
  const taskCount = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  const toggleTodoCompleted = (index) => {
    const changeList = list;
    changeList.todos[index].completed = !changeList.todos[index].completed;
    updateList(changeList);
  };

  const addTodo = () => {
    if (!list.todos.some((todo) => todo.title === newTodo)) {
      list.todos.push({ title: newTodo, completed: false });
      updateList(list);
    }
    setnewTodo('');
    Keyboard.dismiss();
  };

  const deleteTodo = (index) => {
    const deleteList = list.todos.splice(index, 1);
    updateList(deleteList);
  };

  const renderTodo = (todo, index) => {
    return (
      <Swipeable renderRightActions={(_, dragX) => rightActions(dragX, index)}>
        <View style={styles.todoContainer}>
          <TouchableOpacity onPress={() => toggleTodoCompleted(index)}>
            <Ionicons name={todo.completed ? 'ios-square' : 'ios-square-outline'} size={24} color="gray" style={{ width: 32 }} />
          </TouchableOpacity>
          <Text
            style={[
              styles.todo,
              { textDecorationLine: todo.completed ? 'line-through' : 'none', color: todo.completed ? colors.gray : colors.black },
            ]}
          >
            {todo.title}
          </Text>
        </View>
      </Swipeable>
    );
  };

  const rightActions = (dragX, index) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.9],
      extrapolate: 'clamp',
    });
    const opacity = dragX.interpolate({
      inputRange: [-100, -30, 0],
      outputRange: [1, 0.9, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity onPress={() => deleteTodo(index)}>
        <Animated.View style={[styles.deleteButton, { opacity: opacity }]}>
          <Animated.Text style={[styles.delete, { transform: [{ scale }] }]}>삭 제</Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={{ position: 'absolute', top: 64, right: 32, zIndex: 10 }} onPress={() => closeModal()}>
          <AntDesign name="close" size={24} color={colors.black} />
        </TouchableOpacity>

        <View style={[styles.section, styles.header, { borderBottomColor: color }]}>
          <View>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.taskCount}>
              {completedCount} of {taskCount}
            </Text>
          </View>
        </View>
        <View style={[styles.section, { flex: 3, marginVertical: 16 }]}>
          <FlatList
            data={todos}
            renderItem={({ item, index }) => renderTodo(item, index)}
            keyExtractor={(item) => item.title}
            contentContainerStyle={{
              paddingHorizontal: 32,
              paddingVertical: 64,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={[styles.section, styles.footer]}>
          <TextInput style={[styles.input, { borderColor: color }]} onChangeText={(text) => setnewTodo(text)} value={newTodo} />
          <TouchableOpacity style={[styles.addTodo, { backgroundColor: color }]} onPress={() => addTodo()}>
            <AntDesign name="plus" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    alignSelf: 'stretch',
  },
  header: {
    justifyContent: 'flex-end',
    marginLeft: 64,
    borderBottomWidth: 3,
    paddingTop: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.black,
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: colors.gray,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  addTodo: {
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 32,
  },
  todo: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 16,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignContent: 'center',
    width: 60,
  },
  delete: {
    alignSelf: 'center',
    fontWeight: '600',
    color: colors.white,
  },
});
