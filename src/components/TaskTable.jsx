import { useState, useEffect } from 'react';

const TaskTable = ({ 
  tasks, 
  filteredTasks, 
  tableHeight, 
  onDelete, 
  onStatusChange, 
  onTitleChange, 
  onDeadlineChange,
  getStatusClass,
  isDeadlineExpired
}) => {
  const [localTableHeight, setLocalTableHeight] = useState(0);

  useEffect(() => {
    const updateTableHeight = () => {
      const table = document.querySelector('.task-table tbody');
      if (table) {
        const rows = table.querySelectorAll('tr');
        const height = rows.length * 45;
        setLocalTableHeight(height);
      }
    };
    
    updateTableHeight();
    window.addEventListener('resize', updateTableHeight);
    
    return () => window.removeEventListener('resize', updateTableHeight);
  }, [tasks, filteredTasks]);

  const finalHeight = tableHeight || localTableHeight;

  return (
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
                    onBlur={(e) => onTitleChange(task.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        onTitleChange(task.id, e.target.value);
                        e.target.blur();
                      }
                    }}
                  />
                </td>
                
                <td>
                  <select
                    className={`status-dropdown ${getStatusClass(task.status)}`}
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
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
                    onChange={(e) => onDeadlineChange(task.id, e.target.value)}
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
      
      <div className="delete-buttons-container" style={{ height: finalHeight }}>
        {filteredTasks.map((task, index) => (
          <div key={`delete-${task.id}`} className="delete-btn-wrapper">
            <button 
              className="delete-btn"
              onClick={() => onDelete(task.id)}
              title="Удалить задачу"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTable;