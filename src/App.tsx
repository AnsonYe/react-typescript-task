import React, { useState } from "react";
import "./App.css";
import InputFeild from "./components/InputFeild";
import TodoList from "./components/TodoList";
import { Todo } from "./models/models";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
/*
react-beautiful-dnd 提供了三个主要的组件：
DragDropContext：包裹在你的应用的根层(App.tsx)
Droppable：表示可放置的区域(TodoList.tsx)
Draggable：表示可拖拽的元素(SingleTodo.tsx)
*/

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [CompletedTodos, setCompletedTodos] = useState<Todo[]>([]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (todo) {
      setTodos([...todos, { id: Date.now(), todo, isDone: false }]);
      setTodo("");
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    console.log(result);

    let add;
    let active = todos;
    let complete = CompletedTodos;

    // 来源逻辑
    if (source.droppableId === "TodosList") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
    }

    /*
    let arr = [1, 2, 3, 4, 5];
    删除
    arr.splice(2, 1);  返回 [3]，arr 变为 [1, 2, 4, 5]
    替换
    arr.splice(2, 1, "three");  返回 [4]，arr 变为 [1, 2, "three", 5]
    添加
    arr.splice(2, 0, "two-and-half");  返回 []，arr 变为 [1, 2, "two-and-half", "three", 5]
    */

    // 目标逻辑
    if (destination.droppableId === "TodosList") {
      active.splice(destination.index, 0, add);
    } else {
      complete.splice(destination.index, 0, add);
    }

    setCompletedTodos(complete);
    setTodos(active);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <span className="heading">Task</span>
        <InputFeild todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
        <TodoList
          todos={todos}
          setTodos={setTodos}
          CompletedTodos={CompletedTodos}
          setCompletedTodos={setCompletedTodos}
        />
      </div>
    </DragDropContext>
  );
};

export default App;
