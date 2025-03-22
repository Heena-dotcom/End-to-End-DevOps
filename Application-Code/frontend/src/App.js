import React, { useState, useEffect } from 'react';
import './App.css';  

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = () => {
    fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTask })
    }).then(() => {
      setNewTask('');
      window.location.reload();
    });
  };

  const deleteTask = (id) => {
    if (!id || id.length !== 24) {
      console.error("Invalid ObjectId:", id);
      return;
    }
  
    fetch(`http://localhost:3001/api/tasks/${id}`, { method: "DELETE" })
      .then(() => window.location.reload())
      .catch((err) => console.error("Failed to delete task:", err));
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <input value={newTask} onChange={(e) => setNewTask(e.target.value)} />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>{task.task} <button onClick={() => deleteTask(task._id)}>Delete</button></li>
        ))}
      </ul>
    </div>
  );
};

export default App;
