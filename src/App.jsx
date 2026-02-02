import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import TaskTable from './components/TaskTable';
import AddTaskPopup from './components/AddTaskPopup';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (error) {
        console.error('Ошибка загрузки задач из localStorage:', error);
        return getInitialTasks();
      }
    }
    return getInitialTasks();
  });

  const [filter, setFilter] = useState('all');
  const [showPopup, setShowPopup] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', status: '', deadline: '' });
  const [errors, setErrors] = useState({});
  const [tableHeight, setTableHeight] = useState(0);

  function getInitialTasks() {
    return [
      { 
        id: 1, 
        title: 'Выполнить ЛР7', 
        status: 'Активная задача', 
        deadline: '2025-02-18',
      },
      { 
        id: 2, 
        title: 'Сдать курсач по БД', 
        status: 'Задача выполнена', 
        deadline: '2026-02-27',
      },
      { 
        id: 3, 
        title: 'Найти работу', 
        status: 'Задача отменена', 
        deadline: '2023-02-27',
      }
    ];
  }

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]); 

  useEffect(() => {
    const updateTableHeight = () => {
      const table = document.querySelector('.task-table tbody');
      if (table) {
        const rows = table.querySelectorAll('tr');
        const height = rows.length * 45;
        setTableHeight(height);
      }
    };
    
    updateTableHeight();
    window.addEventListener('resize', updateTableHeight);
    
    return () => window.removeEventListener('resize', updateTableHeight);
  }, [tasks, filter]);

  const isDeadlineExpired = (deadline, status) => {
    if (!deadline || status !== 'Активная задача') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    return deadlineDate < today;
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => task.status === 'Активная задача');
      case 'completed':
        return tasks.filter(task => 
          task.status === 'Задача выполнена' || 
          task.status === 'Задача отменена'
        );
      default:
        return tasks;
    }
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    if (!newStatus.trim()) return;
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const handleTitleChange = (id, newTitle) => {
    if (!newTitle.trim()) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        const input = document.querySelector(`input[data-id="${id}"]`);
        if (input) input.value = task.title;
      }
      return;
    }
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, title: newTitle } : task
    ));
  };

  const handleDeadlineChange = (id, newDeadline) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, deadline: newDeadline } : task
    ));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!newTask.title.trim()) newErrors.title = 'Введите описание задачи';
    if (!newTask.status) newErrors.status = 'Выберите статус';
    if (!newTask.deadline) newErrors.deadline = 'Укажите дедлайн';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const taskToAdd = {
      ...newTask,
      id: Date.now(),
    };
    
    setTasks([...tasks, taskToAdd]);
    setNewTask({ title: '', status: '', deadline: '' });
    setErrors({});
    setShowPopup(false);
  };

  const handleClosePopup = () => {
    setNewTask({ title: '', status: '', deadline: '' });
    setErrors({});
    setShowPopup(false);
  };

  const handleInputChange = (field, value) => {
    setNewTask({ ...newTask, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSelectChange = (field, value) => {
    setNewTask({ ...newTask, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const filteredTasks = getFilteredTasks();

  const getStatusClass = (status) => {
    switch (status) {
      case 'Активная задача': return 'status-active';
      case 'Задача выполнена': return 'status-completed';
      case 'Задача отменена': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <div className="app">
      <Header filter={filter} setFilter={setFilter} />
      
      <TaskTable 
        tasks={tasks}
        filteredTasks={filteredTasks}
        tableHeight={tableHeight}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onTitleChange={handleTitleChange}
        onDeadlineChange={handleDeadlineChange}
        getStatusClass={getStatusClass}
        isDeadlineExpired={isDeadlineExpired}
      />

      <div className="add-btn-container">
        <button className="add-btn" onClick={() => setShowPopup(true)}>
          Добавить задачу
        </button>
      </div>

      <AddTaskPopup 
        showPopup={showPopup}
        newTask={newTask}
        errors={errors}
        onClose={handleClosePopup}
        onSubmit={handleAddTask}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
      />
    </div>
  );
}

export default App;