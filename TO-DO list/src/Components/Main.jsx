import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Main = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [todoDate, setTodoDate] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/todos')
      .then((response) => {
        setTodos(response.data);
      })
      .catch((err) => {
        setError('Failed to fetch todos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const addTodo = () => {
    if (newTodo.trim() && todoDate) {
      axios.post('http://localhost:5000/todos', { title: newTodo, date: todoDate })
        .then((response) => {
          setTodos([...todos, response.data]);
          setNewTodo('');
          setTodoDate('');
        })
        .catch(() => {
          setError('Failed to add todo');
        });
    }
  };

  const toggleTodoCompletion = (id) => {
    const todo = todos.find((todo) => todo._id === id);
    if (todo) {
      axios.put(`http://localhost:5000/todos/${id}`, { completed: !todo.completed })
        .then((response) => {
          setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
        })
        .catch(() => {
          setError('Failed to update todo');
        });
    }
  };

  const editTodo = (todo) => {
    setEditingTodo(todo._id);
    setUpdatedTitle(todo.title);
  };

  const saveEdit = (id) => {
    axios.put(`http://localhost:5000/todos/${id}`, { title: updatedTitle })
      .then((response) => {
        setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
        setEditingTodo(null);
        setUpdatedTitle('');
      })
      .catch(() => {
        setError('Failed to update todo');
      });
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/todos/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch(() => {
        setError('Failed to delete todo');
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4 text-center">Todo List</h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="mb-4 flex flex-col items-center">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="border border-gray-300 p-2 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new todo..."
        />
        <input
          type="date"
          value={todoDate}
          onChange={(e) => setTodoDate(e.target.value)}
          className="border border-gray-300 p-2 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={addTodo} 
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>
      <ul className="list-disc pl-5">
        {todos.map((todo) => (
          <li key={todo._id} className="flex justify-between items-center mb-2">
            {editingTodo === todo._id ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  className="border border-gray-300 p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={() => saveEdit(todo._id)} 
                  className="bg-green-500 text-white p-2 rounded-r-md hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <span
                  onClick={() => toggleTodoCompletion(todo._id)}
                  className={`cursor-pointer ${todo.completed ? 'line-through text-gray-500' : 'text-black'}`}
                >
                  {todo.title}
                </span>
                <span className="text-gray-500 text-sm ml-4">
                  {new Date(todo.date).toLocaleDateString()} {/* Format date as desired */}
                </span>
                <button 
                  onClick={() => editTodo(todo)}
                  className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
              </>
            )}
            <button 
              onClick={() => deleteTodo(todo._id)} 
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Main;
