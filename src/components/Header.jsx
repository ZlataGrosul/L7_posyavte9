const Header = ({ filter, setFilter }) => {
  return (
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
  );
};

export default Header;