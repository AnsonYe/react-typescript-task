import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { Todo } from "../models/models";
import { Draggable } from "react-beautiful-dnd";

interface props {
  index: number;
  todo: Todo;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const SingleTodo = ({ index, todo, todos, setTodos }: props) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<string>(todo.todo);

  /*
  这段代码的功能是使用 React 的 useRef 和 useEffect hooks 在组件挂载或更新时，自动聚焦到一个输入元素。
  首先，const inputRef = useRef<HTMLInputElement>(null) 创建了一个 ref（引用），它可以用来在 React 组件内部访问 DOM 元素。这个 ref 是指向一个 <input> 元素的引用。
  然后，useEffect hook 的作用是在 React 组件渲染后执行特定的操作。这个 hook 接受两个参数，一个函数和一个依赖数组。当依赖数组中的任何值发生变化时，该函数就会被执行。
  在这个例子中，useEffect 的函数部分是 () => {inputRef.current?.focus()}，这是一个箭头函数，它的作用是聚焦到 inputRef 所引用的 DOM 元素。
  依赖数组是 [edit]，这意味着只有当 edit 的值发生变化时，useEffect 所包含的函数才会被执行。换句话说，每当 edit 值改变，输入元素就会自动获得焦点。
  */
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  /*
  这个函数接收两个参数：一个React的表单事件e和一个id，类型为number。
  在函数内部，首先调用e.preventDefault()阻止了表单的默认提交行为，因为这个函数是在表单提交的时候触发的，如果不阻止默认行为，页面可能会被刷新。
  接着，使用setTodos函数来更新todos数组。
  具体的更新操作是：遍历todos数组，如果某个todo项的id与传入的id相同，那么就将这个todo项的属性更新为新的值，这里是{ ...todo, todo: editTodo }。这个语句使用了对象展开运算符(...)来复制了todo对象的所有属性，然后更新了todo属性为editTodo的值。对于id不同的todo项，它们保持不变。
  最后，调用setEdit(false)将编辑状态设为false，可能表示编辑动作已经完成。
  所以，这个函数的主要作用是在表单提交时，找到特定的todo项并更新其内容，然后关闭编辑状态。
  */
  const handleEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, todo: editTodo } : todo,
      ),
    );
    setEdit(false);
  };

  /*
  函数内部调用了setTodos方法（这是一个由React的useState提供的用于更新状态的方法），并且使用了todos.filter来生成一个新的数组。
  这个新数组由满足todo.id !== id条件的元素构成。换句话说，新数组将不包含与传入id相同的todo项。
  这样的结果就是，拥有传入id的todo项将会从todos数组中删除。
  所以这段代码的作用就是删除指定id的todo项。
  */
  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  /*
  这个函数handleDone是用来改变todos数组中某一项的isDone属性值的。
  当调用handleDone函数并传入一个id作为参数时，它会通过setTodos来更新todos数组。
  函数体中，todos.map会遍历所有的todo对象，在每次遍历中，会检查当前todo的id是否等于传入的id。
  如果相等，则创建一个新的todo对象（这是通过...todo来拷贝旧的todo属性），但是isDone属性值会被取反（即，如果isDone原来是true，那么现在就变为false；反之亦然）。
  如果todo.id不等于传入的id，那么就返回原来的todo对象。
  因此，这个函数的效果是：在todos数组中找到特定的todo（通过id来找），然后改变它的isDone状态。
  */
  const handleDone = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo,
      ),
    );
  };

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided) => (
        <form
          className="todos__single"
          onSubmit={(e) => handleEdit(e, todo.id)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {edit ? (
            <input
              value={editTodo}
              onChange={(e) => setEditTodo(e.target.value)}
              className="todos__single--text"
              ref={inputRef}
            />
          ) : todo.isDone ? (
            <s className="todos__single--text">{todo.todo}</s>
          ) : (
            <span className="todos__single--text">{todo.todo}</span>
          )}
          <div>
            <span
              className="icon"
              onClick={() => {
                if (!edit && !todo.isDone) {
                  setEdit(!edit);
                }
              }}
            >
              <AiFillEdit />
            </span>
            <span className="icon" onClick={() => handleDelete(todo.id)}>
              <AiFillDelete />
            </span>
            <span className="icon" onClick={() => handleDone(todo.id)}>
              <MdDone />
            </span>
          </div>
        </form>
      )}
    </Draggable>
  );
};

export default SingleTodo;
