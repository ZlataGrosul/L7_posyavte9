import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const initialTasks = [
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

  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('all');
  const [showPopup, setShowPopup] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', status: '', deadline: '' });
  const [errors, setErrors] = useState({});
  const [tableHeight, setTableHeight] = useState(0);

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
      <header className="header">
        <div className="filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Все задачи
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Активные задачи
          </button>
        </div>
        
        <div className="right-filter">
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Выполненные задачи
          </button>
        </div>
      </header>

      <div className="table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>Описание</th>
              <th>Статус</th>
              <th>Дедлайн</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.id} className="task-row">
                  <td>
                    <input
                      type="text"
                      className="task-input"
                      defaultValue={task.title}
                      data-id={task.id}
                      onBlur={(e) => handleTitleChange(task.id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleTitleChange(task.id, e.target.value);
                          e.target.blur();
                        }
                      }}
                    />
                  </td>
                  
                  <td>
                    <select
                      className={`status-dropdown ${getStatusClass(task.status)}`}
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    >
                      <option value="Активная задача" className="status-active">
                        Активная задача
                      </option>
                      <option value="Задача выполнена" className="status-completed">
                        Задача выполнена
                      </option>
                      <option value="Задача отменена" className="status-cancelled">
                        Задача отменена
                      </option>
                    </select>
                  </td>
                  
                  <td>
                    <input
                      type="date"
                      className="date-input"
                      value={task.deadline}
                      onChange={(e) => handleDeadlineChange(task.id, e.target.value)}
                      style={{
                        color: isDeadlineExpired(task.deadline, task.status) ? 'red' : 'inherit',
                        fontWeight: isDeadlineExpired(task.deadline, task.status) ? 'bold' : 'normal'
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="empty-message">
                  Нет задач для отображения
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="delete-buttons-container" style={{ height: tableHeight }}>
          {filteredTasks.map((task, index) => (
            <div key={`delete-${task.id}`} className="delete-btn-wrapper">
              <button 
                className="delete-btn"
                onClick={() => handleDelete(task.id)}
                title="Удалить задачу"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="add-btn-container">
        <button className="add-btn" onClick={() => setShowPopup(true)}>
          Добавить задачу
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-btn" onClick={handleClosePopup}>
              ×
            </button>
            
            <h2>Добавить новую задачу</h2>
            
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Описание</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Введите описание"
                  value={newTask.title}
                  onChange={(e) => {
                    setNewTask({ ...newTask, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: '' });
                  }}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label>Статус</label>
                <select
                  className="form-select"
                  value={newTask.status}
                  onChange={(e) => {
                    setNewTask({ ...newTask, status: e.target.value });
                    if (errors.status) setErrors({ ...errors, status: '' });
                  }}
                  style={{
                    backgroundColor: 
                      newTask.status === 'Активная задача' ? '#FFDADA' :
                      newTask.status === 'Задача выполнена' ? '#d4ffda' :
                      newTask.status === 'Задача отменена' ? '#fff9d4' : 'white'
                  }}
                >
                  <option value="">Выберите статус</option>
                  <option value="Активная задача" className="status-active">
                    Активная задача
                  </option>
                  <option value="Задача выполнена" className="status-completed">
                    Задача выполнена
                  </option>
                  <option value="Задача отменена" className="status-cancelled">
                    Задача отменена
                  </option>
                </select>
                {errors.status && <span className="error-message">{errors.status}</span>}
              </div>

              <div className="form-group">
                <label>Дедлайн</label>
                <input
                  type="date"
                  className="form-input"
                  value={newTask.deadline}
                  onChange={(e) => {
                    setNewTask({ ...newTask, deadline: e.target.value });
                    if (errors.deadline) setErrors({ ...errors, deadline: '' });
                  }}
                />
                {errors.deadline && <span className="error-message">{errors.deadline}</span>}
              </div>

              <button type="submit" className="submit-btn">
                Добавить задачу
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;