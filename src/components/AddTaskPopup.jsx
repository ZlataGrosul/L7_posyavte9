const AddTaskPopup = ({ 
  showPopup, 
  newTask, 
  errors, 
  onClose, 
  onSubmit, 
  onInputChange, 
  onSelectChange 
}) => {
  if (!showPopup) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        
        <h2>Добавить новую задачу</h2>
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Описание</label>
            <input
              type="text"
              className="form-input"
              placeholder="Введите описание"
              value={newTask.title}
              onChange={(e) => onInputChange('title', e.target.value)}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Статус</label>
            <select
              className="form-select"
              value={newTask.status}
              onChange={(e) => onSelectChange('status', e.target.value)}
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
              onChange={(e) => onInputChange('deadline', e.target.value)}
            />
            {errors.deadline && <span className="error-message">{errors.deadline}</span>}
          </div>

          <button type="submit" className="submit-btn">
            Добавить задачу
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskPopup;